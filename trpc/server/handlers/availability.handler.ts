import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {
  ZCreateAvailabilitySchema,
  ZUpdateAvailabilitySchema
} from '../schemas/availability.schema';
import {prisma} from '@/lib/prisma';
import {
  transformAvailability,
  transformDateOverrides,
  transformWorkingHours
} from '../utils/availability/findDetailedScheduleById';

export async function getAllAvailabilitiesHandler(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  return getAllAvailabilitiesByUserId(ctx.session.user.id);
}

export async function getAllAvailabilitiesByUserId(userId: string) {
  return prisma.availability.findMany({
    where: {
      userId: userId
    },
    include: {
      schedule: {
        include: {
          user: true,
          availability: true
        }
      }
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

  const availability = await getAvailabilityById(id);

  if (!availability) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Availability not found'
    });
  }

  return availability;
}

export async function getAvailabilityById(id: number) {
  return prisma.availability.findUnique({
    where: {
      id
    },
    include: {
      schedule: {
        include: {
          user: true,
          availability: true
        }
      }
    }
  });
}

export async function findDetailedScheduleById({
  scheduleId,
  timeZone = 'America/Sao_Paulo',
  userId
}: {
  scheduleId: number;
  timeZone?: string;
  userId: string;
}) {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
      userId: userId
    },
    select: {
      id: true,
      userId: true,
      name: true,
      availability: true,
      timeZone: true
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  // const isCurrentUserPartOfTeam = hasReadPermissionsForUserId({
  //   memberId: schedule?.userId,
  //   userId
  // });

  // const isCurrentUserOwner = schedule?.userId === userId;

  // if (!isCurrentUserPartOfTeam && !isCurrentUserOwner) {
  //   throw new Error('UNAUTHORIZED');
  // }

  const timezone = schedule.timeZone || timeZone;

  const schedulesCount = await prisma.schedule.count({
    where: {
      userId: schedule.userId
    }
  });
  // disabling utc casting while fetching WorkingHours
  return {
    id: schedule.id,
    name: schedule.name,
    // isManaged: schedule.userId !== userId,
    workingHours: transformWorkingHours(schedule),
    schedule: schedule.availability,
    availability: transformAvailability(schedule),
    timeZone: timezone,
    dateOverrides: transformDateOverrides(schedule, timeZone),
    // isDefault: !input.scheduleId || defaultScheduleId === schedule.id,
    isLastSchedule: schedulesCount <= 1
    // readOnly: schedule.userId !== userId && !isManagedEventType
  };
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
