import { TRPCError } from '@trpc/server';
import { Context } from '../context';
import { 
  ZVerifyEmailInputSchema, 
  ZSendVerificationEmailInputSchema,
  ZRequestPasswordResetInputSchema,
  ZResetPasswordInputSchema,
  ZUpdateLocaleInputSchema
} from '../schemas/auth.schema';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function getSessionHandler(ctx: Context) {
  return ctx.session;
}

export async function updateLocaleHandler(ctx: Context, input: typeof ZUpdateLocaleInputSchema._type) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: { locale: input.locale }
  });
}

export async function verifyEmailHandler(ctx: Context, input: typeof ZVerifyEmailInputSchema._type) {
  // First check if the user is already verified
  const user = await ctx.prisma.user.findUnique({
    where: { email: input.identifier }
  });

  if (user?.emailVerified) {
    return { user, loginToken: null };
  }
  
  // Find the verification token
  const verificationToken = await ctx.prisma.verificationToken.findUnique({
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
  const updatedUser = await ctx.prisma.user.update({
    where: {
      email: input.identifier
    },
    data: {
      emailVerified: new Date()
    }
  });

  // Delete the used token - ignore if it doesn't exist (might have been deleted by another request)
  try {
    await ctx.prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: input.identifier,
          token: input.token
        }
      }
    });
  } catch (error) {
    // Token already deleted or not found
  }

  // Generate a one-time login token
  const loginToken = crypto.randomBytes(32).toString('hex');
  const loginTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

  // Store the login token
  await ctx.prisma.verificationToken.create({
    data: {
      identifier: input.identifier,
      token: loginToken,
      expires: loginTokenExpires
    }
  });

  return { user: updatedUser, loginToken };
}

export async function sendVerificationEmailHandler(ctx: Context, input: typeof ZSendVerificationEmailInputSchema._type) {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Set token expiration to 24 hours from now
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Create verification token
  await ctx.prisma.verificationToken.create({
    data: {
      identifier: input.email,
      token,
      expires
    }
  });

  // Send verification email
  await sendVerificationEmail(input.email, token);

  return { success: true };
}

export async function requestPasswordResetHandler(ctx: Context, input: typeof ZRequestPasswordResetInputSchema._type) {
  // Check if user exists
  const user = await ctx.prisma.user.findUnique({
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
  await ctx.prisma.verificationToken.create({
    data: {
      identifier: input.email,
      token,
      expires
    }
  });

  // Send password reset email
  await sendPasswordResetEmail(input.email, token);

  return { success: true };
}

export async function resetPasswordHandler(ctx: Context, input: typeof ZResetPasswordInputSchema._type) {
  // Find the reset token
  const resetToken = await ctx.prisma.verificationToken.findUnique({
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
  const hashedPassword = await bcrypt.hash(input.newPassword, 10);

  // Update user's password
  const updatedUser = await ctx.prisma.user.update({
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
  await ctx.prisma.verificationToken.delete({
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
  await ctx.prisma.verificationToken.create({
    data: {
      identifier: input.email,
      token: loginToken,
      expires: loginTokenExpires
    }
  });

  return { success: true, loginToken };
} 