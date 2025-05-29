import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {ZUpdateProfileInputSchema} from '../schemas/profile.schema';
import {auth} from '@/auth';

export async function updateProfileHandler(
  ctx: Context,
  input: typeof ZUpdateProfileInputSchema._type
) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if username is taken
  if (input.username) {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        username: input.username,
        NOT: {
          id: ctx.session.user.id
        }
      }
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username already taken'
      });
    }
  }

  // Check if email is taken
  if (input.email) {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        email: input.email,
        NOT: {
          id: ctx.session.user.id
        }
      }
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already taken'
      });
    }
  }

  // Update user
  return ctx.prisma.user.update({
    where: {id: ctx.session.user.id},
    data: {
      name: input.name,
      username: input.username,
      email: input.email,
      biography: input.biography,
      image: input.image,
      timeZone: input.timeZone,
      locale: input.locale,
      completedOnboarding: input.completedOnboarding
    }
  });
}

export async function updateProfileSettingsHandler(
  input: typeof ZUpdateProfileInputSchema._type
) {
  const session = await auth();

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if username is taken
  if (input.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: input.username,
        NOT: {
          id: session.user.id
        }
      }
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username already taken'
      });
    }
  }

  // Check if email is taken
  if (input.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: input.email,
        NOT: {
          id: session.user.id
        }
      }
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already taken'
      });
    }
  }

  // Update user
  return prisma.user.update({
    where: {id: session.user.id},
    data: {
      name: input.name,
      username: input.username,
      email: input.email,
      biography: input.biography,
      image: input.image,
      timeZone: input.timeZone,
      locale: input.locale,
      completedOnboarding: input.completedOnboarding
    }
  });
}

export async function completeOnboardingHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.user.update({
    where: {id: ctx.session.user.id},
    data: {completedOnboarding: true}
  });
}
