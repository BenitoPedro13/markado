import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { auth } from '@/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import { hash } from '@node-rs/argon2';

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
      
      console.log('Verifying email with:', { token: input.token, identifier: input.identifier });
      
      // First check if the user is already verified
      const user = await prisma.user.findUnique({
        where: { email: input.identifier }
      });

      if (user?.emailVerified) {
        console.log('User already verified');
        return { user, loginToken: null };
      }
      
      // Find the verification token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: {
          identifier_token: {
            identifier: input.identifier,
            token: input.token
          }
        }
      });

      console.log('Found verification token:', verificationToken);

      if (!verificationToken) {
        console.log('No verification token found');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid verification token'
        });
      }

      // Check if token is expired
      if (verificationToken.expires < new Date()) {
        console.log('Token expired:', { expires: verificationToken.expires, now: new Date() });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Verification token has expired'
        });
      }

      // Update user's email verification status
      const updatedUser = await prisma.user.update({
        where: {
          email: input.identifier
        },
        data: {
          emailVerified: new Date()
        }
      });

      console.log('Updated user:', updatedUser);

      // Delete the used token - ignore if it doesn't exist (might have been deleted by another request)
      try {
        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: input.identifier,
              token: input.token
            }
          }
        });
      } catch (error) {
        console.log('Token already deleted or not found');
      }

      // Generate a one-time login token
      const loginToken = crypto.randomBytes(32).toString('hex');
      const loginTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store the login token
      await prisma.verificationToken.create({
        data: {
          identifier: input.identifier,
          token: loginToken,
          expires: loginTokenExpires
        }
      });

      return { user: updatedUser, loginToken };
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
    }),
  requestPasswordReset: publicProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      });

      if (!user) {
        // Return success even if user doesn't exist to prevent email enumeration
        return { success: true };
      }
      
      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set token expiration to 1 hour from now
      const expires = new Date(Date.now() + 60 * 60 * 1000);
      
      // Create password reset token
      await prisma.verificationToken.create({
        data: {
          identifier: input.email,
          token,
          expires
        }
      });

      // Send password reset email
      await sendPasswordResetEmail(input.email, token);

      return { success: true };
    }),
  resetPassword: publicProcedure
    .input(z.object({
      token: z.string(),
      email: z.string().email(),
      newPassword: z.string().min(8)
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      
      // Find the reset token
      const resetToken = await prisma.verificationToken.findUnique({
        where: {
          identifier_token: {
            identifier: input.email,
            token: input.token
          }
        }
      });

      if (!resetToken) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid reset token'
        });
      }

      // Check if token is expired
      if (resetToken.expires < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Reset token has expired'
        });
      }

      // Hash the new password
      const hashedPassword = await hash(input.newPassword);

      // Update user's password
      const updatedUser = await prisma.user.update({
        where: { email: input.email },
        data: {
          password: {
            upsert: {
              create: { hash: hashedPassword },
              update: { hash: hashedPassword }
            }
          }
        }
      });

      // Delete the used token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: input.email,
            token: input.token
          }
        }
      });

      // Generate a one-time login token
      const loginToken = crypto.randomBytes(32).toString('hex');
      const loginTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store the login token
      await prisma.verificationToken.create({
        data: {
          identifier: input.email,
          token: loginToken,
          expires: loginTokenExpires
        }
      });

      return { success: true, loginToken };
    })
});

export type AppRouter = typeof appRouter;
