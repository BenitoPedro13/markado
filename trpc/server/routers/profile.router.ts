import { router, publicProcedure } from '../trpc';
import { ZUpdateProfileInputSchema } from '../schemas/profile.schema';
import { updateProfileHandler, completeOnboardingHandler } from '../handlers/profile.handler';
import { protectedProcedure } from '../middleware';

export const profileRouter = router({
  update: protectedProcedure
    .input(ZUpdateProfileInputSchema)
    .mutation(({ ctx, input }) => updateProfileHandler(ctx, input)),
  
  completeOnboarding: protectedProcedure
    .mutation(({ ctx }) => completeOnboardingHandler(ctx))
}); 