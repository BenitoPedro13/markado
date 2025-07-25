import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  const currentLocale = locale || routing.defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`~/messages/${currentLocale.toLowerCase()}.json`)).default
  };
});
