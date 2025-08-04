import {useTranslation} from 'next-i18next';
import type {i18n, TFunction} from 'i18next';

export const useLocaleI18: (
  namespace?: Parameters<typeof useTranslation>[0]
) => {
  i18n: i18n;
  t: TFunction;
  isLocaleReady: boolean;
} = (namespace = 'common') => {
  const {i18n, t} = useTranslation(namespace);
  const isLocaleReady = Object.keys(i18n).length > 0;

  return {
    i18n,
    t,
    isLocaleReady
  };
};