import {z} from 'zod';
import {protectedProcedure} from '~/trpc/server/middleware';
import {router} from '~/trpc/server/trpc';
import {TRPCError} from '@trpc/server';
import {google} from 'googleapis';
import {encrypt} from '@/utils/encryption';
import type {Context} from '~/trpc/server/context';
import { Calendar } from '~/prisma/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const calendarRouter = router({
  connect: protectedProcedure.mutation(async ({ctx}: {ctx: Context}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/meetings.space.created',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    return {authUrl};
  }),

  // callback: protectedProcedure
  //   .input(
  //     z.object({
  //       code: z.string()
  //     })
  //   )
  //   .mutation(async ({ctx, input}: {ctx: Context; input: {code: string}}) => {
  //     if (!ctx.session?.user) {
  //       throw new TRPCError({
  //         code: 'UNAUTHORIZED',
  //         message: 'Not authenticated'
  //       });
  //     }

  //     try {
  //       const {tokens} = await oauth2Client.getToken(input.code);

  //       if (!tokens.refresh_token) {
  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: 'No refresh token received from Google'
  //         });
  //       }

  //       // Encrypt tokens before storing
  //       const encryptedAccessToken = encrypt(tokens.access_token || '');
  //       const encryptedRefreshToken = encrypt(tokens.refresh_token);

  //       // Get user's calendars
  //       oauth2Client.setCredentials(tokens);
  //       const calendar = google.calendar({version: 'v3', auth: oauth2Client});
  //       const {data: calendarList} = await calendar.calendarList.list();

  //       await prisma.user.update({
  //         where: {id: ctx.session.user.id},
  //         data: {
  //           googleAccessToken: encryptedAccessToken,
  //           googleRefreshToken: encryptedRefreshToken,
  //           googleTokenExpiry: tokens.expiry_date || 0
  //         }
  //       });

  //       // --- NOVO: Instalar Google Calendar e Google Meet ---
  //       // Google Calendar
  //       await prisma.credential.upsert({
  //         where: {
  //           // Chave única composta: userId + appId + type
  //           userId_appId_type: {
  //             userId: ctx.session.user.id,
  //             appId: "google-calendar",
  //             type: "google_calendar"
  //           }
  //         },
  //         update: {
  //           key: tokens
  //         },
  //         create: {
  //           type: "google_calendar",
  //           key: tokens, // tokens completos do Google
  //           userId: ctx.session.user.id,
  //           appId: "google-calendar"
  //         }
  //       });

  //       // Google Meet
  //       await prisma.credential.upsert({
  //         where: {
  //           userId_appId_type: {
  //             userId: ctx.session.user.id,
  //             appId: "google-meet",
  //             type: "google_video"
  //           }
  //         },
  //         update: {
  //           key: {} // objeto vazio
  //         },
  //         create: {
  //           type: "google_video",
  //           key: {}, // objeto vazio
  //           userId: ctx.session.user.id,
  //           appId: "google-meet"
  //         }
  //       });

  //       if (!calendarList.items) {
  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: 'No calendars found from Google'
  //         });
  //       }

  //       for (const cal of calendarList.items) {
  //         await prisma.calendar.upsert({
  //           where: {
  //             // Use a unique identifier or composite unique fields
  //             googleId_userId: {
  //               googleId: cal.id || '',
  //               userId: ctx.session.user.id
  //             }
  //           },
  //           update: {
  //             name: cal.summary || '',
  //             description: cal.description || null,
  //             primary: cal.primary || false
  //             // Any other fields to update
  //           },
  //           create: {
  //             googleId: cal.id || '',
  //             name: cal.summary || '',
  //             description: cal.description || null,
  //             primary: cal.primary || false,
  //             userId: ctx.session.user.id
  //             // Any other fields to create
  //           }
  //         });
  //       }

  //       return {success: true};
  //     } catch (error) {
  //       console.error('Error in Google Calendar callback:', error);
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to connect Google Calendar'
  //       });
  //     }
  //   }),

  selectCalendar: protectedProcedure
    .input(
      z.object({
        calendarId: z.string()
      })
    )
    .mutation(
      async ({ctx, input}: {ctx: Context; input: {calendarId: string}}) => {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated'
          });
        }

        await ctx.prisma.user.update({
          where: {id: ctx.session.user.id},
          data: {
            selectedCalendarId: input.calendarId
          }
        });

        return {success: true};
      }
    ),

  getCalendars: protectedProcedure.query(async ({ctx}: {ctx: Context}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.session.user.id},
      include: {calendars: true}
    });

    if (!user?.calendars) {
      return [];
    }

    return user.calendars;
  })
});

export async function getCalendarsByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: {calendars: true}
  });


  if (!user?.calendars) {
    return [];
  }

  return user.calendars;
}