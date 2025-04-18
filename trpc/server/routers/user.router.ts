import { router, publicProcedure } from '../trpc';
import { ZUserInputSchema } from '../schemas/user.schema';
import { 
  getUserHandler, 
  getFirstUserHandler, 
  createUserHandler, 
  getUserListHandler,
  getMeHandler
} from '../handlers/user.handler';
import { protectedProcedure } from '../middleware';

export const userRouter = router({
  get: publicProcedure
    .input((input) => input as string)
    .query(({ ctx, input }) => {
      // Since getUserHandler now expects no parameters, we need to create a new function
      return ctx.prisma.user.findUnique({
        where: { id: input }
      });
    }),
  
  getFirst: publicProcedure
    .query(({ ctx }) => getFirstUserHandler(ctx)),
  
  create: publicProcedure
    .input(ZUserInputSchema)
    .mutation(({ ctx, input }) => createUserHandler(ctx, input)),
  
  list: publicProcedure
    .query(({ ctx }) => getUserListHandler(ctx)),
  
  me: protectedProcedure
    .query(({ ctx }) => getMeHandler(ctx)),
  
  getUser: protectedProcedure
    .query(({ ctx }) => getUserHandler(ctx)),
  
  createUser: publicProcedure
    .input(ZUserInputSchema)
    .mutation(({ ctx, input }) => createUserHandler(ctx, input))
}); 