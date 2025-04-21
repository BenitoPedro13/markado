import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/trpc/server/index';
import { createContext } from '~/trpc/server/context';

// Force dynamic rendering for this API route
// export const dynamic = 'force-dynamic';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
