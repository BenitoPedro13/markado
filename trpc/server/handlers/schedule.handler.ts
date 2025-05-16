'use server';

import {TRPCError} from '@trpc/server';
import {Context} from '../context';
import {
  ZCreateScheduleSchema,
  ZUpdateInputSchema,
  ZUpdateScheduleSchema
} from '../schemas/availability.schema';
import {revalidatePath} from 'next/cache';
import {DEFAULT_SCHEDULE} from '@/lib/availability';
import {auth} from '@/auth';

import {prisma} from '@/lib/prisma';
import dayjs from '@/lib/dayjs';
import {
  createAvailabilityHandler,
  updateDetailedAvailability
} from '~/trpc/server/handlers/availability.handler';
import { redirect } from 'next/navigation';

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
  input: typeof ZCreateScheduleSchema._type
) {
  const session = await auth();
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  console.log(`[TRPC] Creating schedule for user ${session.user.id}:`, input);

  // Wrap the Prisma call with delay
  const res = prisma.schedule.create({
    data: {
      ...input,
      userId: session?.user.id
    },
    include: {
      availability: true
    }
  });

  revalidatePath('/availability');

  return res;
}

export const submitCreateSchedule = async (newName: string) => {
  try {
    // Get form values from the Schedule component
    const scheduleValues = DEFAULT_SCHEDULE;

    // Create a schedule first
    // const scheduleResult = await createScheduleMutation.mutateAsync({
    //   name: newName,
    //   timeZone:
    //     Intl.DateTimeFormat().resolvedOptions().timeZone ||
    //     'America/Sao_Paulo'
    // });

    const scheduleResult = await createScheduleHandler({
      name: newName,
      timeZone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo'
    });

    // Convert the schedule format to availability format
    const schedule = scheduleValues;

    // Create availabilities for each day
    for (let dayIndex = 0; dayIndex < schedule.length; dayIndex++) {
      const timeRanges = schedule[dayIndex];
      if (timeRanges && timeRanges.length > 0) {
        for (const timeRange of timeRanges) {
          // Format the time values as HH:MM strings to match the schema requirements
          const startTime = dayjs(timeRange.start).format('HH:mm');
          const endTime = dayjs(timeRange.end).format('HH:mm');

          // await createAvailabilityMutation.mutateAsync({
          //   days: [dayIndex],
          //   startTime,
          //   endTime,
          //   scheduleId: scheduleResult.id
          // });

          await createAvailabilityHandler({
            days: [dayIndex],
            startTime,
            endTime,
            scheduleId: scheduleResult.id
          });
        }
      }
    }

    return scheduleResult;

    // queryClient.invalidateQueries({
    //   queryKey: [
    //     ['availability', 'getAll'],
    //     {
    //       type: 'query'
    //     }
    //   ]
    // });

    // Clear the edit_mode cookie if it exists
    // clearEditMode();

    // Set the availability step completion cookie
    // setStepComplete('availability');

    // router.push(`/availability/${scheduleResult.id}`);

    // notification({
    //   title: t('schedule_created_success'),
    //   variant: 'stroke',
    //   id: 'schedule_created_success'
    // });
  } catch (error: any) {
    console.error('Error submitting availability form:', error);
    // notification({
    //   title: t('availability_created_error'),
    //   description: error.message,
    //   variant: 'stroke',
    //   id: 'availability_created_error'
    // });
  } finally {
    // setIsSubmitting(false);
  }
};

export const submitUpdateSchedule = async (
  scheduleValues: typeof ZUpdateInputSchema._type
) => {
  try {
    const scheduleResult = await updateDetailedAvailability({
      input: scheduleValues
    });

    if (!scheduleResult.schedule.id) return;
    // notification({
    //   title: 'Alterações salvas!',
    //   description: 'Seus updates foram salvos com sucesso.',
    //   variant: 'stroke',
    //   status: 'success'
    // });

    // router.push(`/availability`);
    return scheduleResult;
  } catch (error: any) {
    console.error('Error submitting availability form:', error);

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update schedule'
    });
  }
};

export const deleteSchedule = async (scheduleId: number) => {
  const session = await auth();
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'deleteSchedule: Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'deleteSchedule: Not authenticated'
    });
  }

  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      userId: session.user.id
    }
  });

  if (!existingSchedule) {
    throw new Error(
      "Schedule not found or you don't have permission to delete it"
    );
  }

  console.log(
    `[TRPC] Deleting schedule for user ${session.user.id}:`,
    scheduleId
  );

  revalidatePath('/availability'); // revalidate the list page
  // revalidatePath(`/availability/${existingSchedule.id}`); // revalidate the details page

  return prisma.schedule.delete({
    where: {
      id: scheduleId
    }
  });
};

export const submitDeleteSchedule = async (scheduleId: number) => {
  try {
    const scheduleResult = await deleteSchedule(scheduleId);

    if (!scheduleResult.id) return;
    // notification({
    //   title: 'Agendamento deletado!',
    //   description: 'Seu agendamento foi deletado com sucesso.',
    //   variant: 'stroke',
    //   status: 'success'
    // });

    // router.push(`/availability`);
    // redirect('/availability');
    return scheduleResult;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete schedule'
    });
  }
};

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
