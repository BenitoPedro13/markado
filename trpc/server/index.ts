import { z } from 'zod';
import { db } from './db';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  getUser: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const user = await db.user.findById(input);

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user with id '${input}'`,
      });
    }
    
    return user;
  }),
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
});

export type AppRouter = typeof appRouter;
