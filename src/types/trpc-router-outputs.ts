import type { AppRouter } from '~/trpc/server';
import type { inferRouterOutputs } from '@trpc/server';

export type RouterOutputs = inferRouterOutputs<AppRouter>; 