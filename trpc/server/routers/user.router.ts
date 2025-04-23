import {z} from 'zod';
import {
  createUserHandler,
  getFirstUserHandler,
  getMeHandler,
  getUserByUsernameHandler,
  getUserHandler,
  getUserListHandler
} from '../handlers/user.handler';
import {protectedProcedure} from '../middleware';
import {ZUserInputSchema} from '../schemas/user.schema';
import {publicProcedure, router} from '../trpc';

export const userRouter = router({
  get: publicProcedure
    .input((input) => input as string)
    .query(({ctx, input}) => {
      // Since getUserHandler now expects no parameters, we need to create a new function
      return ctx.prisma.user.findUnique({
        where: {id: input}
      });
    }),

  getFirst: publicProcedure.query(({ctx}) => getFirstUserHandler(ctx)),

  create: publicProcedure
    .input(ZUserInputSchema)
    .mutation(({ctx, input}) => createUserHandler(ctx, input)),

  list: publicProcedure.query(({ctx}) => getUserListHandler(ctx)),

  me: protectedProcedure.query(({ctx}) => getMeHandler(ctx)),

  getUser: protectedProcedure.query(({ctx}) => getUserHandler(ctx)),

  createUser: publicProcedure
    .input(ZUserInputSchema)
    .mutation(({ctx, input}) => createUserHandler(ctx, input)),

  getUserByUsername: publicProcedure
    .input(z.string())
    .query(({ctx, input}) => getUserByUsernameHandler(ctx, input))
});
