import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { db } from './db';
import { publicProcedure, router } from './trpc';

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  getUser: publicProcedure.input(z.object({id: z.string()})).query(async (opts) => {
    const { input: {id} } = opts;
    const user = await db.user.findById(id);
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

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
