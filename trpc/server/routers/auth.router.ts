import { router, publicProcedure } from '../trpc';
import { 
  ZVerifyEmailInputSchema, 
  ZSendVerificationEmailInputSchema,
  ZRequestPasswordResetInputSchema,
  ZResetPasswordInputSchema,
  ZUpdateLocaleInputSchema
} from '../schemas/auth.schema';
import { 
  getSessionHandler,
  updateLocaleHandler,
  verifyEmailHandler,
  sendVerificationEmailHandler,
  requestPasswordResetHandler,
  resetPasswordHandler
} from '../handlers/auth.handler';
import { protectedProcedure } from '../middleware';

export const authRouter = router({
  getSession: publicProcedure
    .query(({ ctx }) => getSessionHandler(ctx)),
  
  updateLocale: protectedProcedure
    .input(ZUpdateLocaleInputSchema)
    .mutation(({ ctx, input }) => updateLocaleHandler(ctx, input)),
  
  verifyEmail: publicProcedure
    .input(ZVerifyEmailInputSchema)
    .mutation(({ ctx, input }) => verifyEmailHandler(ctx, input)),
  
  sendVerificationEmail: publicProcedure
    .input(ZSendVerificationEmailInputSchema)
    .mutation(({ ctx, input }) => sendVerificationEmailHandler(ctx, input)),
  
  requestPasswordReset: publicProcedure
    .input(ZRequestPasswordResetInputSchema)
    .mutation(({ ctx, input }) => requestPasswordResetHandler(ctx, input)),
  
  resetPassword: publicProcedure
    .input(ZResetPasswordInputSchema)
    .mutation(({ ctx, input }) => resetPasswordHandler(ctx, input)),

  checkOnboardingStatus: publicProcedure
    .query(async ({ ctx }) => {
      const { session } = ctx;
      
      if (!session?.user) {
        return { isComplete: false, error: 'Not authenticated' };
      }
      
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: session.user.id },
          select: { completedOnboarding: true }
        });
        
        return { 
          isComplete: !!user?.completedOnboarding,
          userId: session.user.id
        };
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to true on error to avoid blocking users
        return { isComplete: true, error: 'Failed to check status' };
      }
    })
}); 