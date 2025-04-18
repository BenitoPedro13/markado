'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import { SignUpProvider, useSignUp } from '@/contexts/SignUpContext';
import { RiArrowLeftSLine } from '@remixicon/react';
import { PropsWithChildren } from 'react';

const Layout = ({children}: PropsWithChildren) => {
  const {
    step,
    backStep,
    queries: {user},
    isAnyQueryLoading
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

export default function SignUpLayout({children}: PropsWithChildren) {
  return (
    <SignUpProvider>
      <Layout>{children}</Layout>
    </SignUpProvider>
  );
}
