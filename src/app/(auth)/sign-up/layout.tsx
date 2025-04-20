'use client';

import { SignUpProvider } from '@/contexts/SignUpContext';
import { PropsWithChildren } from 'react';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/trpc/server';

type MeResponse = inferRouterOutputs<AppRouter>['user']['me'];

export default function SignUpLayout({children, initialUser}: PropsWithChildren & {initialUser: MeResponse | null}) {
  return (
    <SignUpProvider initialUser={initialUser}>
      {children}
    </SignUpProvider>
  );
}
