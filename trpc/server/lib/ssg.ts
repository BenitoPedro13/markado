import type { GetStaticPropsContext } from "next";
import superjson from "superjson";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { appRouter } from "../index";
import { getTranslation } from "@/packages/lib/server/i18n";

/**
 * Initialize static site rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getStaticProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssgInit<TParams extends { locale?: string }>(opts: GetStaticPropsContext<TParams>) {
  const requestedLocale = opts.params?.locale || opts.locale || 'pt';
  const isSupportedLocale = ['pt', 'en'].includes(requestedLocale);
  if (!isSupportedLocale) {
    console.warn(`Requested unsupported locale "${requestedLocale}"`);
  }
  const locale = isSupportedLocale ? requestedLocale : 'pt';

  const t = await getTranslation(locale, "common");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  const ssg = {
    queryClient,
    dehydrate: () => dehydrate(queryClient),
  };

  return ssg;
}
