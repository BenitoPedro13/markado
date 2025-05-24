import {router, publicProcedure} from '../trpc';
// import {ZUpdateProfileInputSchema} from '../schemas/profile.schema';
// import {
//   updateProfileHandler,
//   completeOnboardingHandler
// } from '../handlers/profile.handler';
import {protectedProcedure} from '../middleware';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {
  ZCreateAvailabilitySchema,
  ZUpdateAvailabilitySchema,
  ZUpdateInputSchema
} from '../schemas/availability.schema';
import {timeStringToDate} from '@/utils/time-utils';
import {
  setupDefaultSchedule,
  transformAvailability,
  transformDateOverrides,
  transformScheduleToAvailability,
  transformWorkingHours
} from '~/trpc/server/utils/availability/findDetailedScheduleById';
import { getAvailabilityFromSchedule } from '@/lib/availability';
import { TRPCError } from '@trpc/server';
import { getAllAvailabilitiesHandler } from '../handlers/availability.handler';
import { revalidatePath } from 'next/cache';

// Define a type for the update data that matches the Prisma schema
type AvailabilityUpdateData = {
  days?: number[];
  startTime?: Date;
  endTime?: Date;
  date?: Date;
  scheduleId?: number;
};

export const availabilityRouter = router({
  // Get all availabilities for the current user
  getAll: protectedProcedure.query(async ({ctx}) => {
    return getAllAvailabilitiesHandler(ctx)
  }),

  // Get availability by ID
  getById: protectedProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) => {
      return ctx.prisma.availability.findUnique({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
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
    }),

  findDetailedScheduleById: protectedProcedure
    .input(z.object({scheduleId: z.number(), timeZone: z.string()}))
    .query(async ({ctx, input}) => {
      const schedule = await ctx.prisma.schedule.findUnique({
        where: {
          id: input.scheduleId,
          userId: ctx.session?.user.id
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

      const timeZone = schedule.timeZone || input.timeZone;

      const schedulesCount = await ctx.prisma.schedule.count({
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
        timeZone,
        dateOverrides: transformDateOverrides(schedule, timeZone),
        // isDefault: !input.scheduleId || defaultScheduleId === schedule.id,
        isLastSchedule: schedulesCount <= 1
        // readOnly: schedule.userId !== userId && !isManagedEventType
      };
    }),

  // Create a new availability
  create: protectedProcedure
    .input(ZCreateAvailabilitySchema)
    .mutation(async ({ctx, input}) => {
      // Get the schedule to access its timezone
      const schedule = input.scheduleId
        ? await ctx.prisma.schedule.findFirst({
            where: {
              id: input.scheduleId,
              userId: ctx.session?.user.id
            }
          })
        : null;

      // Use the schedule's timezone or default to America/Sao_Paulo
      const timezone = schedule?.timeZone || 'America/Sao_Paulo';

      // Convert time strings to Date objects for database storage
      const startDateTime = timeStringToDate(input.startTime, timezone);
      const endDateTime = timeStringToDate(input.endTime, timezone);

      // revalidatePath('/availability');
      if (input.scheduleId) {
        // revalidatePath(`/availability/${input.scheduleId}`);
      }

      return ctx.prisma.availability.create({
        data: {
          ...input,
          startTime: startDateTime,
          endTime: endDateTime,
          userId: ctx.session?.user.id
        },
        include: {
          schedule: true
        }
      });
    }),

  // Update an existing availability
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ZUpdateAvailabilitySchema
      })
    )
    .mutation(async ({ctx, input}) => {
      // First check if the availability belongs to the user
      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        },
        include: { schedule: true }
      });

      if (!existingAvailability) {
        throw new Error(
          "Availability not found or you don't have permission to update it"
        );
      }

      // Create a properly typed update data object
      const updateData: AvailabilityUpdateData = {};

      // Copy all fields except startTime and endTime
      if (input.data.days) {
        updateData.days = input.data.days;
      }

      if (input.data.date) {
        updateData.date = new Date(input.data.date);
      }

      if (input.data.scheduleId) {
        updateData.scheduleId = input.data.scheduleId;
      }

      // Convert time strings to Date objects for database storage if provided
      if (input.data.startTime) {
        updateData.startTime = timeStringToDate(input.data.startTime);
      }

      if (input.data.endTime) {
        updateData.endTime = timeStringToDate(input.data.endTime);
      }

      // revalidatePath('/availability');
      if (existingAvailability.scheduleId) {
        // revalidatePath(`/availability/${existingAvailability.scheduleId}`);
      }

      return ctx.prisma.availability.update({
        where: {
          id: input.id
        },
        data: updateData,
        include: {
          schedule: true
        }
      });
    }),

  updateDetailedAvailability: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ZUpdateInputSchema
      })
    )
    .mutation(async ({input, ctx}) => {
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED'
        });
      }

      const availability = input.data.schedule
        ? getAvailabilityFromSchedule(input.data.schedule, user.id)
        : (input.data.dateOverrides || []).map((dateOverride) => ({
            startTime: dateOverride.start,
            endTime: dateOverride.end,
            date: dateOverride.start,
            days: []
          }));

      // Not able to update the schedule with userId where clause, so fetch schedule separately and then validate
      // Bug: https://github.com/prisma/prisma/issues/7290
      const userSchedule = await ctx.prisma.schedule.findUnique({
        where: {
          id: input.data.scheduleId
        },
        select: {
          userId: true,
          name: true,
          id: true
        }
      });

      if (!userSchedule) {
        throw new TRPCError({
          code: 'UNAUTHORIZED'
        });
      }

      if (userSchedule?.userId !== user.id) {
        // const hasEditPermission = await hasEditPermissionForUserID({
        //   ctx,
        //   input: {memberId: userSchedule.userId}
        // });
        // if (!hasEditPermission) {
        //   throw new TRPCError({
        //     code: 'UNAUTHORIZED'
        //   });
        // }

        throw new TRPCError({
          code: 'UNAUTHORIZED'
        });
      }

      let updatedUser;
      if (input.data.isDefault) {
        const setupDefault = await setupDefaultSchedule(
          user.id,
          input.data.scheduleId,
          prisma
        );
        updatedUser = setupDefault;
      }

      if (!input.data.name) {
        // TODO: Improve
        // We don't want to pass the full schedule for just a set as default update
        // but in the current logic, this wipes the existing availability.
        // Return early to prevent this from happening.
        return {
          schedule: userSchedule,
          isDefault: updatedUser
            ? updatedUser.defaultScheduleId === input.data.scheduleId
            : user.defaultScheduleId === input.data.scheduleId
        };
      }

      const schedule = await ctx.prisma.schedule.update({
        where: {
          id: input.data.scheduleId
        },
        data: {
          timeZone: input.data.timeZone,
          name: input.data.name,
          availability: {
            deleteMany: {
              scheduleId: {
                equals: input.data.scheduleId
              }
            },
            createMany: {
              data: [
                ...availability,
                ...(input.data.dateOverrides || []).map((override) => ({
                  date: override.start,
                  startTime: override.start,
                  endTime: override.end
                }))
              ]
            }
          }
        },
        select: {
          id: true,
          userId: true,
          name: true,
          availability: true,
          timeZone: true
          // eventType: {
          //   select: {
          //     id: true,
          //     eventName: true
          //   }
          // }
        }
      });

      const userAvailability = transformScheduleToAvailability(schedule);

      // revalidatePath('/availability'); // revalidate the list page
      // revalidatePath(`/availability/${schedule.id}`); // revalidate the details page

      return {
        schedule,
        availability: userAvailability,
        timeZone: schedule.timeZone || user.timeZone,
        isDefault: updatedUser
          ? updatedUser.defaultScheduleId === schedule.id
          : user.defaultScheduleId === schedule.id,
        prevDefaultId: user.defaultScheduleId,
        currentDefaultId: updatedUser
          ? updatedUser.defaultScheduleId
          : user.defaultScheduleId
      };
    }),

  // Delete an availability
  delete: protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({ctx, input}) => {
      // First check if the availability belongs to the user
      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        },
        include: { schedule: true }
      });

      if (!existingAvailability) {
        throw new Error(
          "Availability not found or you don't have permission to delete it"
        );
      }

      revalidatePath('/availability');
      if (existingAvailability.scheduleId) {
        revalidatePath(`/availability/${existingAvailability.scheduleId}`);
      }

      return ctx.prisma.availability.delete({
        where: {
          id: input.id
        }
      });
    })
});
