import {router, publicProcedure} from '../trpc';
import {getAvailableSlots} from '../handlers/public/util';
import { type GetScheduleResponse } from '@/components/schedules/lib/use-schedule/types';
import { getScheduleSchema } from '../schemas/public/types';

export const publicSlotsRouter = router({
  // Get available slots for a schedule (public)
  getSchedule: publicProcedure
    .input(getScheduleSchema)
    .query(async ({ctx, input}): Promise<GetScheduleResponse> => {
      const result = await getAvailableSlots({
        ctx,
        input
      });

      return {
        slots: result.slots,
        timeZone: result.timeZone
      };
    }),
}); 