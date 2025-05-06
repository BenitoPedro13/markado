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
  ZUpdateAvailabilitySchema
} from '../schemas/availability.schema';
import {timeStringToDate} from '@/utils/time-utils';

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
    return ctx.prisma.availability.findMany({
      where: {
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

  // Get availability by ID
  getById: protectedProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) => {
      return ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        },
        include: {
          schedule: true
        }
      });
    }),

  // Create a new availability
  create: protectedProcedure
    .input(ZCreateAvailabilitySchema)
    .mutation(async ({ctx, input}) => {
      // Get the schedule to access its timezone
      const schedule = input.scheduleId ? await ctx.prisma.schedule.findFirst({
        where: {
          id: input.scheduleId,
          userId: ctx.session?.user.id
        }
      }) : null;

      // Use the schedule's timezone or default to America/Sao_Paulo
      const timezone = schedule?.timeZone || 'America/Sao_Paulo';

      // Convert time strings to Date objects for database storage
      const startDateTime = timeStringToDate(input.startTime, timezone);
      const endDateTime = timeStringToDate(input.endTime, timezone);

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
        }
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

  // Delete an availability
  delete: protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({ctx, input}) => {
      // First check if the availability belongs to the user
      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        }
      });

      if (!existingAvailability) {
        throw new Error(
          "Availability not found or you don't have permission to delete it"
        );
      }

      return ctx.prisma.availability.delete({
        where: {
          id: input.id
        }
      });
    })
});
