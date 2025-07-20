import {useTranslations, useLocale as useNextIntlLocale} from 'next-intl';

export const useLocale: (namespace?: Parameters<typeof useTranslations>[0]) => {
  locale: ReturnType<typeof useNextIntlLocale>;
  t: ReturnType<typeof useTranslations>;
  isLocaleReady: boolean;
  i18n: {
    language: string;
    locale: string;
  };
} = (namespace = 'common') => {
  const t = useTranslations(namespace);
  const locale = useNextIntlLocale();
  const isLocaleReady = !!locale;

  return {
    locale,
    t,
    isLocaleReady,
    i18n: {
      language: locale || 'pt',
      locale: locale || 'pt'
    }
  };
};

// Alias for backward compatibility
export const useLocaleI18 = useLocale;