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
