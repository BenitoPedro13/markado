import { router, publicProcedure } from '../trpc';
import { ZEventInputSchema } from '../schemas/events.schema';
import eventHandler from '../handlers/events.handler';

export const eventRouter = router({
  getPublicEvent: publicProcedure
    .input(ZEventInputSchema)
    .query(async ({ input, ctx }) => {
      return eventHandler({ input, userId: ctx.session?.user?.id });
    }),
}); 