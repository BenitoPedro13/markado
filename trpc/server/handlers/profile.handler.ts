'use server';

import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {ZUpdateProfileInputSchema} from '../schemas/profile.schema';
import {auth} from '@/auth';
import {FormActionState} from '@/types/formTypes';
import {revalidatePath} from 'next/cache';

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

export async function updateProfileAction(
  previousState: FormActionState,
  profileFormData: FormData
) {
  'use server';

  console.log(
    '\n\nReceived profile form data:',
    Object.fromEntries(profileFormData.entries())
  );

  const validatedForm = ZUpdateProfileInputSchema.safeParse({
    name: profileFormData.get('name')?.toString(),
    username: profileFormData.get('username')?.toString(),
    email: profileFormData.get('email')?.toString(),
    image:
      profileFormData.get('image')?.toString() !== ''
        ? profileFormData.get('image')?.toString()
        : undefined,
    biography: profileFormData.get('biography')?.toString()
  });

  if (!validatedForm.success) {
    console.error('Validation failed:', validatedForm.error);
    return {
      errors: validatedForm.error.flatten().fieldErrors,
      success: false
    };
  }

  console.log('Validated form data:', validatedForm.data);

  try {
    const result = await updateProfileSettingsHandler(validatedForm.data);
    console.log('Profile updated successfully:', result);
    revalidatePath('/settings/profile');
    return {success: true};
  } catch (error) {
    console.error('Error updating profile:', error);
    return {errors: {form: ['Erro ao atualizar perfil']}, success: false};
  }
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
