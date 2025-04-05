import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import BaseLayout from '@/components/BaseLayout';
import {routing} from '@/i18n/routing';
import PageWrapper from '@/app/PageWrapper';
import Header from '@/components/align-ui/header';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params: {locale}
}: Omit<Props, 'children'>) {
  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title')
  };
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <BaseLayout locale={locale}>
      <PageWrapper>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </PageWrapper>
    </BaseLayout>
  );
}
