import {useTranslations} from 'next-intl';
import {useLocale as useNextIntlLocale} from 'next-intl';

export const useLocale = (
  namespace: Parameters<typeof useTranslations>[0] = 'common'
) => {
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

export const useLocaleI18 = (
  namespace: Parameters<typeof useTranslation>[0] = 'common'
) => {
  const {i18n, t} = useTranslation(namespace);
  const isLocaleReady = Object.keys(i18n).length > 0;

  return {
    i18n,
    t,
    isLocaleReady
  };
};
