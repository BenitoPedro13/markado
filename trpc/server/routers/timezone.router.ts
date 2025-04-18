import { router, publicProcedure } from '../trpc';
import { ZTimezoneInputSchema } from '../schemas/timezone.schema';
import { updateTimezoneHandler } from '../handlers/timezone.handler';
import { protectedProcedure } from '../middleware';

export const timezoneRouter = router({
  update: protectedProcedure
    .input(ZTimezoneInputSchema)
    .mutation(({ ctx, input }) => updateTimezoneHandler(ctx, input))
}); 