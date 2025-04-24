import { useTRPC } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '~/trpc/server';

type MeResponse = inferRouterOutputs<AppRouter>['user']['me'];

export function useMeQuery() {
  const trpc = useTRPC();
  
  return useQuery({
    queryKey: trpc.user.me.queryOptions().queryKey,
    queryFn: () => trpc.user.me.queryOptions(),
    retry(failureCount: number) {
      return failureCount > 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}

export default useMeQuery; 