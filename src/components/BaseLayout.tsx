import {clsx} from 'clsx';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Inter, Plus_Jakarta_Sans} from 'next/font/google';
import {ReactNode} from 'react';
import '@/app/globals.css';
import {TooltipProvider} from '@radix-ui/react-tooltip';
import { ThemeProvider } from 'next-themes';

// Change to a font of your preference
const inter = Inter({subsets: ['latin']});
const plusJakartaSans = Plus_Jakarta_Sans({subsets: ['latin'], variable: '--font-plus-jakarta-sans'});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({children, locale}: Props) {
  // This will provide all the messages to the client side of your application
  const messages = await getMessages();

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <ThemeProvider attribute="class">
          <TooltipProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
