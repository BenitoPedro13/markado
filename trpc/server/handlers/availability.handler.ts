import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {
  ZCreateAvailabilitySchema,
  ZUpdateAvailabilitySchema
} from '../schemas/availability.schema';

export async function getAllAvailabilitiesHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.availability.findMany({
    where: {
      userId: ctx.session.user.id
    },
    include: {
      schedule: true
    }
  });
}

export async function getAvailabilityByIdHandler(ctx: Context, id: number) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  const availability = await ctx.prisma.availability.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    },
    include: {
      schedule: true
    }
  });

  if (!availability) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Availability not found'
    });
  }

  return availability;
}

export async function createAvailabilityHandler(
  ctx: Context,
  input: typeof ZCreateAvailabilitySchema._type
) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // If scheduleId is provided, verify it belongs to the user
  if (input.scheduleId) {
    const schedule = await ctx.prisma.schedule.findFirst({
      where: {
        id: input.scheduleId,
        userId: ctx.session.user.id
      }
    });

    if (!schedule) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Schedule not found or you do not have permission to use it'
      });
    }
  }

  return ctx.prisma.availability.create({
    data: {
      ...input,
      userId: ctx.session.user.id
    },
    include: {
      schedule: true
    }
  });
}

export async function updateAvailabilityHandler(
  ctx: Context,
  id: number,
  input: typeof ZUpdateAvailabilitySchema._type
) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if the availability belongs to the user
  const existingAvailability = await ctx.prisma.availability.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    }
  });

  if (!existingAvailability) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message:
        'Availability not found or you do not have permission to update it'
    });
  }

  // If scheduleId is provided, verify it belongs to the user
  if (input.scheduleId) {
    const schedule = await ctx.prisma.schedule.findFirst({
      where: {
        id: input.scheduleId,
        userId: ctx.session.user.id
      }
    });

    if (!schedule) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Schedule not found or you do not have permission to use it'
      });
    }
  }

  return ctx.prisma.availability.update({
    where: {
      id
    },
    data: input,
    include: {
      schedule: true
    }
  });
}

export async function deleteAvailabilityHandler(ctx: Context, id: number) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if the availability belongs to the user
  const existingAvailability = await ctx.prisma.availability.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    }
  });

  if (!existingAvailability) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message:
        'Availability not found or you do not have permission to delete it'
    });
  }

  return ctx.prisma.availability.delete({
    where: {
      id
    }
  });
}
