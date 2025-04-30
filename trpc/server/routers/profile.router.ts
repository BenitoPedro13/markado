import { router, publicProcedure } from '../trpc';
import { ZUpdateProfileInputSchema } from '../schemas/profile.schema';
import { updateProfileHandler, completeOnboardingHandler } from '../handlers/profile.handler';
import { protectedProcedure } from '../middleware';
import { z } from 'zod';
import { cookies } from 'next/headers';

export const profileRouter = router({
  update: protectedProcedure
    .input(ZUpdateProfileInputSchema)
    .mutation(({ ctx, input }) => updateProfileHandler(ctx, input)),
  
  completeOnboarding: protectedProcedure
    .mutation(({ ctx }) => completeOnboardingHandler(ctx)),

  // New mutation to track onboarding progress
  updateOnboardingProgress: protectedProcedure
    .input(z.object({
      personalComplete: z.boolean().optional(),
      calendarComplete: z.boolean().optional(),
      availabilityComplete: z.boolean().optional(),
      profileComplete: z.boolean().optional(),
      onboardingComplete: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new Error('Not authenticated');
      }

      console.log(`[TRPC] Updating onboarding progress for user ${ctx.session.user.id}:`, input);

      // Temporarily mark that the user has completed a specific step
      // This will be used to allow them to proceed to the next step
      // For now, we only store this in a cookie, not in the database
      
      if (input.personalComplete) {
        // Set a cookie to mark the personal step as complete
        cookies().set('personal_step_complete', 'true', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        console.log(`[TRPC] Personal step marked as complete for user ${ctx.session.user.id}`);
      }
      
      if (input.calendarComplete) {
        // Set a cookie to mark the calendar step as complete
        cookies().set('calendar_step_complete', 'true', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        console.log(`[TRPC] Calendar step marked as complete for user ${ctx.session.user.id}`);
      }
      
      if (input.availabilityComplete) {
        // Set a cookie to mark the availability step as complete
        cookies().set('availability_step_complete', 'true', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        console.log(`[TRPC] Availability step marked as complete for user ${ctx.session.user.id}`);
      }

      if (input.profileComplete) {
        // Set a cookie to mark the profile step as complete
        cookies().set('profile_step_complete', 'true', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        console.log(`[TRPC] Profile step marked as complete for user ${ctx.session.user.id}`);
      }
      
      if (input.onboardingComplete) {
        // Set a cookie to mark the onboarding as complete
        cookies().set('onboarding_complete', 'true', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        console.log(`[TRPC] Onboarding marked as complete for user ${ctx.session.user.id}`);
      }

      // Return the user without modifications for now
      return ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id }
      });
    })
}); 