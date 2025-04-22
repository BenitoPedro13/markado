import {router} from '../trpc';

import {protectedProcedure} from '../middleware';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {
  ZCreateScheduleSchema,
  ZUpdateScheduleSchema
} from '../schemas/availability.schema';

export const scheduleRouter = router({
  // Get all schedules for the current user
  getAll: protectedProcedure.query(async ({ctx}) => {
    return ctx.prisma.schedule.findMany({
      where: {
        userId: ctx.session?.user.id
      },
      include: {
        availability: true
      }
    });
  }),

  // Get schedule by ID
  getById: protectedProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) => {
      return ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        },
        include: {
          availability: true
        }
      });
    }),

  // Create a new schedule
  create: protectedProcedure
    .input(ZCreateScheduleSchema)
    .mutation(async ({ctx, input}) => {
      return ctx.prisma.schedule.create({
        data: {
          ...input,
          userId: ctx.session?.user.id
        },
        include: {
          availability: true
        }
      });
    }),

  // Update an existing schedule
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ZUpdateScheduleSchema
      })
    )
    .mutation(async ({ctx, input}) => {
      // First check if the schedule belongs to the user
      const existingSchedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        }
      });

      if (!existingSchedule) {
        throw new Error(
          "Schedule not found or you don't have permission to update it"
        );
      }

      return ctx.prisma.schedule.update({
        where: {
          id: input.id
        },
        data: input.data,
        include: {
          availability: true
        }
      });
    }),

  // Delete a schedule
  delete: protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({ctx, input}) => {
      // First check if the schedule belongs to the user
      const existingSchedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        }
      });

      if (!existingSchedule) {
        throw new Error(
          "Schedule not found or you don't have permission to delete it"
        );
      }

      return ctx.prisma.schedule.delete({
        where: {
          id: input.id
        }
      });
    })
});
