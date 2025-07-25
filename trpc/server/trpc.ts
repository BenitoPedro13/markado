import { initTRPC } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';
import { UserFromSession } from '@/lib/getUserFromSession';

const t = initTRPC.context<Context>().create({transformer: superjson});

export type TrpcSessionUser = UserFromSession;

export const router = t.router;
export const publicProcedure = t.procedure;
