import {router, publicProcedure} from '../trpc';
import {getAvailableSlots, IGetAvailableSlots} from '../handlers/public/util';
// import { type GetScheduleResponse } from '@/components/schedules/lib/use-schedule/types';
import { getScheduleSchema } from '../schemas/public/types';
// import { ContextForGetSchedule } from '../handlers/public/getSchedule.handler';
import { IncomingMessage } from 'node:http';

export const publicSlotsRouter = router({
  // Get available slots for a schedule (public)
  getSchedule: publicProcedure
    .input(getScheduleSchema)
    .query(async ({ctx, input}): Promise<IGetAvailableSlots> => {
      const result = await getAvailableSlots({
        ctx: {
          ...ctx,
          req: ctx.req as unknown as IncomingMessage & {
            cookies: Partial<{[key: string]: string}>;
          }
        },
        input
      });

      return {
        slots: result.slots,
        // timeZone: result.timeZone
      };
    })
}); 