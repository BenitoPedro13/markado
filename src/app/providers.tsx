"use client"

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

import {NextIntlClientProvider} from 'next-intl';
import {trpc} from '~/trpc/client';
import {TRPCProvider} from '@/utils/trpc';
import React, {useState} from 'react';
import {SessionProvider} from 'next-auth/react';
import {SessionStoreProvider} from '@/providers/session-store-provider';
import {ThemeStoreProvider} from '@/providers/theme-store-provider';
import {NotificationProvider} from '@/components/align-ui/ui/notification-provider';
import {createSessionStore} from '@/stores/session-store';
import {Session} from 'next-auth';
import OnboardingCheck from '@/components/OnboardingCheck';
import {TooltipProvider} from '@radix-ui/react-tooltip';
import {ThemeProvider} from 'next-themes';

interface ProvidersProps {
  initialSession: Session | null;
  messages: Record<string, any>;
  locale: string;
}

export default function Providers({
  children,
  initialSession,
  messages,
  locale
}: React.PropsWithChildren<ProvidersProps>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => trpc);

  const [sessionStore] = useState(() =>
    createSessionStore({
      user: initialSession?.user || null,
      isAuthenticated: !!initialSession?.user,
      isLoading: false
    })
  );

  return (
    <ThemeProvider attribute="class">
      <TooltipProvider>
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
          <SessionProvider session={initialSession}>
            <QueryClientProvider client={queryClient}>
              <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                <SessionStoreProvider initialSession={sessionStore}>
                  <ThemeStoreProvider>
                    <NotificationProvider />
                    <OnboardingCheck />
                    {children}
                  </ThemeStoreProvider>
                </SessionStoreProvider>
              </TRPCProvider>
            </QueryClientProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}