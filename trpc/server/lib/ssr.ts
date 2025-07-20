import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { appRouter } from "../index";
import { createContext } from "../context";
import { getTranslation } from "@/packages/lib/server/i18n";

/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssrInit(context: GetServerSidePropsContext, options?: { noI18nPreload: boolean }) {
  const ctx = await createContext({
    req: context.req as any,
    resHeaders: new Headers(),
    info: {} as any,
  });
  
  const locale = context.locale || 'pt';
  
  const t = await getTranslation(locale, "common");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  const ssr = {
    queryClient,
    dehydrate: () => dehydrate(queryClient),
    user: {
      me: {
        fetch: async () => {
          return await appRouter.createCaller(ctx).user.me();
        },
                  prefetch: async () => {
            await queryClient.prefetchQuery({
              queryKey: ['user.me'],
              queryFn: () => appRouter.createCaller(ctx).user.me()
            });
          },
      },
    },
  };

  await Promise.allSettled([
    ssr.user.me.prefetch(),
  ]);

  return ssr;
}
