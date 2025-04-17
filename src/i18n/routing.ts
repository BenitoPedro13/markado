import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
import { auth } from '@/auth';

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'pt',
  localePrefix: 'never'
  // pathnames: {
  //   '/': '/',
  //   '/sign-up': {
  //     pt: '/cadastro'
  //   },
  //   '/sign-in': {
  //     pt: '/entrar'
  //   }
  // }
});

// export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const {Link, getPathname, redirect, usePathname, useRouter} =
  createNavigation(routing);

// Function to get the user's locale from the database
export async function getUserLocale(): Promise<Locale> {
  const session = await auth();
  if (!session?.user) {
    return routing.defaultLocale;
  }
  
  // Convert the database locale (PT/EN) to lowercase (pt/en)
  const userLocale = session.user.locale?.toLowerCase() as Locale;
  return routing.locales.includes(userLocale) ? userLocale : routing.defaultLocale;
}
