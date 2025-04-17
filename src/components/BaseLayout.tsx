import {clsx} from 'clsx';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Plus_Jakarta_Sans} from 'next/font/google';
import {ReactNode} from 'react';
import '@/app/globals.css';
import {TooltipProvider} from '@radix-ui/react-tooltip';
import {ThemeProvider} from 'next-themes';
import {NotificationProvider} from '@/components/align-ui/ui/notification-provider';
import PageWrapper from '@/app/PageWrapper';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans'
});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({children, locale}: Props) {
  // This will provide all the messages to the client side of your application
  const messages = await getMessages({locale});

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(plusJakartaSans.className, 'flex h-full flex-col')}>
        <NotificationProvider />
        <ThemeProvider attribute="class">
          <TooltipProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <PageWrapper>{children}</PageWrapper>
            </NextIntlClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
