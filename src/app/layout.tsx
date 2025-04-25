import {getTranslations} from 'next-intl/server';
import {PropsWithChildren} from 'react';
import {routing} from '@/i18n/routing';
import {cookies} from 'next/headers';
import {auth} from '@/auth';
import {clsx} from 'clsx';
import {Plus_Jakarta_Sans} from 'next/font/google';
import Providers from '@/app/providers';
import {getMessages} from 'next-intl/server';
import '@/app/globals.css';
import { getQueryClient } from './get-query-client';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';



export async function generateMetadata() {
  const locale = cookies().get('NEXT_LOCALE')?.value || routing.defaultLocale;
  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title')
  };
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans'
});

export default async function RootLayout({children}: PropsWithChildren) {
  const locale = cookies().get('NEXT_LOCALE')?.value || routing.defaultLocale;
  const queryClient = getQueryClient();
  const session = await auth();

  const messages = await getMessages({locale});

  await queryClient.prefetchQuery({
    queryKey: ['user.me'],
    queryFn: () => getMeByUserId(session?.user?.id)
  });

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(plusJakartaSans.className, 'flex h-full flex-col')}>
        <Providers messages={messages} locale={locale} initialSession={session}>
          <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
