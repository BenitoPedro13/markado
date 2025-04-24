import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {
  ZCreateScheduleSchema,
  ZUpdateScheduleSchema
} from '../schemas/availability.schema';

export async function getAllSchedulesHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.schedule.findMany({
    where: {
      userId: ctx.session.user.id
    },
    include: {
      availability: true
    }
  });
}

export async function getScheduleByIdHandler(ctx: Context, id: number) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  const schedule = await ctx.prisma.schedule.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    },
    include: {
      availability: true
    }
  });

  if (!schedule) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Schedule not found'
    });
  }

  return schedule;
}

export async function createScheduleHandler(
  ctx: Context,
  input: typeof ZCreateScheduleSchema._type
) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return ctx.prisma.schedule.create({
    data: {
      ...input,
      userId: ctx.session.user.id
    },
    include: {
      availability: true
    }
  });
}

export async function updateScheduleHandler(
  ctx: Context,
  id: number,
  input: typeof ZUpdateScheduleSchema._type
) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if the schedule belongs to the user
  const existingSchedule = await ctx.prisma.schedule.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    }
  });

  if (!existingSchedule) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Schedule not found or you do not have permission to update it'
    });
  }

  return ctx.prisma.schedule.update({
    where: {
      id
    },
    data: input,
    include: {
      availability: true
    }
  });
}

export async function deleteScheduleHandler(ctx: Context, id: number) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if the schedule belongs to the user
  const existingSchedule = await ctx.prisma.schedule.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    }
  });

  if (!existingSchedule) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Schedule not found or you do not have permission to delete it'
    });
  }

  // Check if this schedule is the default schedule
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id
    },
    select: {
      defaultScheduleId: true
    }
  });

  if (user?.defaultScheduleId === id) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'Cannot delete your default schedule. Please set another schedule as default first.'
    });
  }

  return ctx.prisma.schedule.delete({
    where: {
      id
    }
  });
}

export async function setDefaultScheduleHandler(ctx: Context, id: number) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Check if the schedule belongs to the user
  const existingSchedule = await ctx.prisma.schedule.findFirst({
    where: {
      id,
      userId: ctx.session.user.id
    }
  });

  if (!existingSchedule) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Schedule not found or you do not have permission to use it'
    });
  }

  return ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id
    },
    data: {
      defaultScheduleId: id
    }
  });
}
