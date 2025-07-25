import { getTranslations } from 'next-intl/server';

export const getTranslation = async (lng: string, ns: string) => {
  const t = await getTranslations({ locale: lng, namespace: ns });
  return t;
};