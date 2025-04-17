import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || routing.defaultLocale;
  console.log('currentLocale', currentLocale);
  return {
    locale: currentLocale,
    messages: (await import(`~/messages/${currentLocale}.json`)).default
  };
});
