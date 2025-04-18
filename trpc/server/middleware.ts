import { TRPCError } from '@trpc/server';
import { publicProcedure } from './trpc';

// Middleware to check if user has completed onboarding
export const hasCompletedOnboarding = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }
  
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id }
  });
  
  if (!user?.completedOnboarding) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User has not completed onboarding'
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user
    }
  });
});

// Create a protected procedure that requires authentication
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user
    }
  });
}); 