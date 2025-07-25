import type { GetStaticPropsContext } from "next";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function getTranslations<TParams extends { locale?: string }>(
  opts: GetStaticPropsContext<TParams>
) {
  const requestedLocale = opts.params?.locale || opts.locale || routing.defaultLocale;
  const isSupportedLocale = routing.locales.includes(requestedLocale as any);
  if (!isSupportedLocale) {
    console.warn(`Requested unsupported locale "${requestedLocale}"`);
  }
  const locale = isSupportedLocale ? requestedLocale : routing.defaultLocale;

  const messages = await getMessages({ locale });

  return {
    messages,
    locale,
  };
}
