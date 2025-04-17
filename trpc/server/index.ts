import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { auth } from '@/auth';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  getUser: publicProcedure.input(z.string()).query(async (opts) => {
    const {input} = opts;
    const user = await prisma.user.findUnique({
      where: {id: input}
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user with id '${input}'`
      });
    }

    return user;
  }),
  getFirstUser: publicProcedure.query(async () => {
    const user = await prisma.user.findFirst();

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user found`
      });
    }

    return user;
  }),
  createUser: publicProcedure
    .input(z.object({name: z.string(), email: z.string(), image: z.string()}))
    .mutation(async (opts) => {
      const {input} = opts;
      return prisma.user.create({
        data: input
      });
    }),
  getSession: publicProcedure.query(async () => {
    const session = await auth();
    return session;
  }),
  verifyEmail: publicProcedure
    .input(z.object({
      token: z.string(),
      identifier: z.string()
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      
      // Find the verification token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: {
          identifier_token: {
            identifier: input.identifier,
            token: input.token
          }
        }
      });

      if (!verificationToken) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid verification token'
        });
      }

      // Check if token is expired
      if (verificationToken.expires < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Verification token has expired'
        });
      }

      // Update user's email verification status
      const user = await prisma.user.update({
        where: {
          email: input.identifier
        },
        data: {
          emailVerified: new Date()
        }
      });

      // Delete the used token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: input.identifier,
            token: input.token
          }
        }
      });

      return user;
    }),
  sendVerificationEmail: publicProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      
      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set token expiration to 24 hours from now
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      // Create verification token
      await prisma.verificationToken.create({
        data: {
          identifier: input.email,
          token,
          expires
        }
      });

      // Send verification email
      await sendVerificationEmail(input.email, token);

      return { success: true };
    })
});

export type AppRouter = typeof appRouter;
