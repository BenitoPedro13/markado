import { router, publicProcedure } from '../trpc';
import { cityTimezonesHandler } from '../handlers/cityTimezones.handler';

export const cityTimezonesRouter = router({
  list: publicProcedure
    .query(({ ctx }) => cityTimezonesHandler(ctx))
}); 