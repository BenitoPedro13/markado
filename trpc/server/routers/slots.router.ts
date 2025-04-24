import {router} from '../trpc';
import {protectedProcedure} from '../middleware';
import {z} from 'zod';
import {getAvailableSlots} from '@/utils/slots';
import { type GetScheduleResponse } from '@/components/schedules/lib/use-schedule/types';

// Schema for getting schedule
const getScheduleSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  scheduleId: z.number(),
  timeZone: z.string().optional(),
});

// Schema for reserving a slot
const reserveSlotSchema = z.object({
  scheduleId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

// Schema for removing selected slot
const removeSelectedSlotSchema = z.object({
  uid: z.string().nullable(),
});

export const slotsRouter = router({
  // Get available slots for a schedule
  getSchedule: protectedProcedure
    .input(getScheduleSchema)
    .query(async ({ctx, input}): Promise<GetScheduleResponse> => {
      console.log(
        `[TRPC] Getting slots for schedule ${input.scheduleId}:`,
        input
      );

      // Verify schedule belongs to user
      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.scheduleId,
          userId: ctx.session?.user.id
        }
      });

      if (!schedule) {
        throw new Error('Schedule not found or you do not have permission to access it');
      }

      const result = await getAvailableSlots({
        ctx,
        input: {
          ...input,
          timeZone: input.timeZone || schedule.timeZone || ctx.session?.user.timeZone || 'America/Sao_Paulo'
        }
      });

      return {
        slots: result.slots,
        timeZone: result.timeZone || input.timeZone || schedule.timeZone || ctx.session?.user.timeZone || 'America/Sao_Paulo'
      };
    }),

  // Reserve a slot
  reserveSlot: protectedProcedure
    .input(reserveSlotSchema)
    .mutation(async ({ctx, input}) => {
      console.log(
        `[TRPC] Reserving slot for schedule ${input.scheduleId}:`,
        input
      );

      // Verify schedule belongs to user
      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.scheduleId,
          userId: ctx.session?.user.id
        }
      });

      if (!schedule) {
        throw new Error('Schedule not found or you do not have permission to access it');
      }

      // Create a new availability entry for the reserved slot
      return ctx.prisma.availability.create({
        data: {
          userId: ctx.session?.user.id,
          scheduleId: input.scheduleId,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime),
          date: new Date(input.startTime), // Store the date of the reservation
        }
      });
    }),

  // Remove selected slot mark
  removeSelectedSlotMark: protectedProcedure
    .input(removeSelectedSlotSchema)
    .mutation(async ({ctx, input}) => {
      const uid = ctx.session?.user.id || input.uid;
      
      if (!uid) {
        throw new Error('No user ID provided');
      }

      console.log(
        `[TRPC] Removing selected slot mark for user ${uid}`
      );

      // In your case, we'll just remove the availability entry
      return ctx.prisma.availability.deleteMany({
        where: {
          userId: uid,
          date: {
            gte: new Date() // Only remove future slots
          }
        }
      });
    })
}); 