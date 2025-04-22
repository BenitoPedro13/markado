import {router} from '../trpc';
import {protectedProcedure} from '../middleware';
import {google} from 'googleapis';
import {GOOGLE_MEET_CONFIG, GOOGLE_MEET_ENDPOINTS} from '@/config/googleMeet';
import {TRPCError} from '@trpc/server';
import {decrypt} from '@/utils/encryption';
import {prisma} from '@/lib/prisma';
import type {Context} from '../context';
import {z} from 'zod';

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_MEET_CONFIG.clientId,
  GOOGLE_MEET_CONFIG.clientSecret,
  GOOGLE_MEET_CONFIG.redirectUri
);

export const meetRouter = router({
  connect: protectedProcedure.mutation(async ({ctx}: {ctx: Context}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    // Check if user already has Google Calendar tokens
    const user = await prisma.user.findUnique({
      where: {id: ctx.session.user.id},
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
        googleMeetEnabled: true
      }
    });

    // If user already has Google Meet connected, return success
    if (user?.googleMeetEnabled) {
      return {success: true, alreadyConnected: true};
    }

    // If user has Google Calendar tokens, try to use them for Google Meet
    if (user?.googleAccessToken && user?.googleRefreshToken) {
      try {
        // Decrypt tokens
        const accessToken = decrypt(user.googleAccessToken);
        const refreshToken = decrypt(user.googleRefreshToken);

        // Set credentials
        oauth2Client.setCredentials({
          access_token: accessToken,
          refresh_token: refreshToken,
          expiry_date: user.googleTokenExpiry ? Number(user.googleTokenExpiry) : undefined
        });

        // Check if tokens are expired and refresh if needed
        if (user.googleTokenExpiry && Number(user.googleTokenExpiry) < Date.now()) {
          const {credentials} = await oauth2Client.refreshAccessToken();
          // Update tokens in database
          await prisma.user.update({
            where: {id: ctx.session.user.id},
            data: {
              googleAccessToken: credentials.access_token,
              googleRefreshToken: credentials.refresh_token || user.googleRefreshToken,
              googleTokenExpiry: credentials.expiry_date ? BigInt(credentials.expiry_date) : null
            }
          });
        }

        // Check if we have all required scopes
        const calendarScopes = [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events'
        ];
        
        const meetScopes = [
          'https://www.googleapis.com/auth/meetings.space.created'
        ];
        
        // If we have all required scopes, connect Google Meet without showing consent screen
        if (calendarScopes.every(scope => oauth2Client.credentials.scope?.includes(scope))) {
          // Mark Google Meet as connected
          await prisma.user.update({
            where: {id: ctx.session.user.id},
            data: {
              googleMeetEnabled: true
            }
          });
          
          return {success: true, alreadyConnected: false};
        }
      } catch (error) {
        console.error('Error using existing Google tokens for Meet:', error);
        // Continue to show consent screen if there's an error
      }
    }

    // If we don't have tokens or they don't have the right scopes, show consent screen
    const params = new URLSearchParams({
      client_id: GOOGLE_MEET_CONFIG.clientId,
      redirect_uri: GOOGLE_MEET_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_MEET_CONFIG.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `${GOOGLE_MEET_ENDPOINTS.AUTH}?${params.toString()}`;

    return {
      authUrl,
      requiresConsent: true
    };
  }),

  callback: protectedProcedure
    .input(
      z.object({
        code: z.string()
      })
    )
    .mutation(async ({ctx, input}: {ctx: Context; input: {code: string}}) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated'
        });
      }

      try {
        const {tokens} = await oauth2Client.getToken(input.code);

        if (!tokens.refresh_token) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No refresh token received from Google'
          });
        }

        // Update user with Google Meet connected status
        await prisma.user.update({
          where: {id: ctx.session.user.id},
          data: {
            googleMeetEnabled: true
          }
        });

        return {success: true};
      } catch (error) {
        console.error('Error in Google Meet callback:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to connect Google Meet'
        });
      }
    })
});

export type MeetRouter = typeof meetRouter;
