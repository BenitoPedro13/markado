import {getTranslations} from 'next-intl/server';
import {ReactNode} from 'react';
import BaseLayout from '@/components/BaseLayout';
import {routing} from '@/i18n/routing';
import PageWrapper from '@/app/PageWrapper';
import { cookies } from 'next/headers';

type Props = {
  children: ReactNode;
};

export async function generateMetadata() {
  const locale = cookies().get('NEXT_LOCALE')?.value || routing.defaultLocale;
  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title')
  };
}

/**
 * Layout required for all pages. NextJS stuff...
 */
export default async function RootLayout({
  children
}: Props) {
  const locale = cookies().get('NEXT_LOCALE')?.value || routing.defaultLocale;

  console.log('locale', locale);

  return (
    <BaseLayout locale={locale}>
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </BaseLayout>
  );
}
