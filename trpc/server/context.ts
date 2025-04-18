import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth();
  
  return {
    session,
    prisma,
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>; 