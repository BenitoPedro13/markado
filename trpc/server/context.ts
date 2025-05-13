import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';
import {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import {getMeByUserId} from './handlers/user.handler';
import {Me} from '@/app/settings/page';
import {Session} from 'next-auth';
import type {PrismaClient} from '~/prisma/app/generated/prisma/client';

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<{
  user: Me | null;
  session: Session | null;
  prisma: PrismaClient;
  req: Request;
}> {
  const session = await auth();

  if (session?.user.id) {
    const user = await getMeByUserId(session.user.id);

    return {
      user,
      session,
      prisma,
      req: opts.req
    };
  }

  return {
    user: null,
    session,
    prisma,
    req: opts.req
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
