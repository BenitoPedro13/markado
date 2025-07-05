'use server';

import {prisma} from '@/lib/prisma';
import {TRPCError} from '@trpc/server';
import {hash} from 'bcryptjs';
import crypto from 'crypto';
import {Context} from '../context';
import {ZUserInputSchema} from '../schemas/user.schema';
import {serializeObject} from '@/lib/utils';


export type Me = Awaited<ReturnType<typeof getMeByUserId>>;

export async function getUserHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.user.findUnique({
    where: {id: ctx.session.user.id},
    include: {
      password: true,
      accounts: true,
      sessions: true
    }
  });
}

export async function getFirstUserHandler(ctx: Context) {
  const user = await ctx.prisma.user.findFirst();

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No user found`
    });
  }

  return user;
}

export async function createUserHandler(
  ctx: Context,
  input: typeof ZUserInputSchema._type
) {
  // Check if user already exists
  const existingUser = await ctx.prisma.user.findUnique({
    where: {email: input.email}
  });

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'User already exists'
    });
  }

  // Hash the password
  const hashedPassword = await hash(input.password, 10);

  // Create the user
  const user = await ctx.prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  return user;
}

export async function getUserListHandler(ctx: Context) {
  return ctx.prisma.user.findMany();
}

export async function getMeHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  const user = await getMeByUserId(ctx.session.user.id);

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found'
    });
  }

  return user;
}

export async function getMeByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: {
      password: true,
      accounts: {
        select: {
          provider: true,
          providerAccountId: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  // Remove sensitive information
  const {password, ...userWithoutPassword} = user;

  const serializedUser = serializeObject({
    ...userWithoutPassword,
    hasPassword: !!password,
    emailMd5: crypto.createHash('md5').update(user.email).digest('hex')
  });

  return serializedUser;
}

export async function getUserByUsernameHandler(ctx: Context, username: string) {
  const user = await ctx.prisma.user.findFirst({
    where: {
      username
    },
    include: {
      accounts: {
        select: {
          provider: true,
          providerAccountId: true
        }
      }
    }
  });
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found'
    });
  }

  return {
    ...user,
    emailMd5: crypto.createHash('md5').update(user.email).digest('hex')
  };
}

export async function getHostUserByUsername(username: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username
      },
      select: {
        name: true,
        username: true,
        image: true,
        biography: true,
        timeZone: true,
        instagram: true,
        linkedin: true,
        twitter: true,
        facebook: true,
        website: true,
        schedules: {
          include: {
            availability: true
          }
        }
      }
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    return user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error'
    });
  }
}
