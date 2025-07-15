import {useTranslations, useLocale as useNextIntlLocale} from 'next-intl';

export const useLocale: (namespace?: Parameters<typeof useTranslations>[0]) => {
  locale: ReturnType<typeof useNextIntlLocale>;
  t: ReturnType<typeof useTranslations>;
  isLocaleReady: boolean;
} = (namespace = 'common') => {
  const t = useTranslations(namespace);
  const locale = useNextIntlLocale();
  const isLocaleReady = !!locale;

  return {
    locale,
    t,
    isLocaleReady
  };
};

import {useTranslation} from 'next-i18next';
import type { i18n, TFunction } from 'i18next';

export const useLocaleI18: (
  namespace?: Parameters<typeof useTranslation>[0]
) => {
  i18n: i18n;
  t: TFunction;
  isLocaleReady: boolean;
} = (namespace = 'common') => {
  const { i18n, t } = useTranslation(namespace);
  const isLocaleReady = Object.keys(i18n).length > 0;

  return {
    i18n,
    t,
    isLocaleReady
  };
};