import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
  getUser: publicProcedure.input(z.string()).query(async (opts) => {
    const {input} = opts;
    const user = await prisma.user.findUnique({
      where: {id: input}
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user with id '${input}'`
      });
    }

    return user;
  }),
  getFirstUser: publicProcedure.query(async () => {
    const user = await prisma.user.findFirst();

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user found`
      });
    }

    return user;
  }),
  createUser: publicProcedure
    .input(z.object({name: z.string()}))
    .mutation(async (opts) => {
      const {input} = opts;
      return prisma.user.create({
        data: input
      });
    })
});

export type AppRouter = typeof appRouter;
