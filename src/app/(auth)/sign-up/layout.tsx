'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import { SignUpProvider, useSignUp } from '@/contexts/SignUpContext';
import { RiArrowLeftSLine } from '@remixicon/react';
import { PropsWithChildren } from 'react';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/trpc/server';

type MeResponse = inferRouterOutputs<AppRouter>['user']['me'];


const Layout = ({children}: PropsWithChildren) => {
  const {
    step,
    backStep,
  } = useSignUp();

  
  return (
    <>
      <div className="absolute left-24 top-8">
        {step !== '/sign-up/email' && (
          <Button variant="neutral" mode="stroke" onClick={backStep}>
            <RiArrowLeftSLine size={20} color="var(--text-sub-600)" />
            <span className="text-text-sub-600">Voltar</span>
          </Button>
        )}
      </div>
      {children}
    </>
  );
};

export default function SignUpLayout({children, initialUser}: PropsWithChildren & {initialUser: MeResponse | null}) {
  return (
    <SignUpProvider initialUser={initialUser}>
      <Layout>{children}</Layout>
    </SignUpProvider>
  );
}
