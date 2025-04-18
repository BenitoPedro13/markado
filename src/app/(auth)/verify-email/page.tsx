'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useTRPC } from '@/utils/trpc';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { Root as Button } from '@/components/align-ui/ui/button';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailPassword } from '@/components/auth/auth-actions';
import { useSignUp } from '@/app/(auth)/sign-up/SignUpContext';

const VerifyEmailContent = () => {
  const trpc = useTRPC();
      const {setStep} = useSignUp();
  const t = useTranslations('VerifyEmailPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const verificationAttempted = useRef(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const redirectTo = searchParams.get('redirect') || '/';

  const verifyEmail = useMutation(trpc.verifyEmail.mutationOptions({
    onSuccess: async (data) => {
      if (data.loginToken) {
        try {
          // Use the login token to sign in
          await signInWithEmailPassword(email!, data.loginToken, redirectTo);
          setVerificationStatus('success');
        } catch (error) {
          console.error('Failed to auto-login:', error);
          setVerificationStatus('success'); // Still show success for verification
        }
      } else {
        setVerificationStatus('success');
      }
    },
    onError: () => {
      setVerificationStatus('error');
    },
  }));

  useEffect(() => {
    if (token && email && !verificationAttempted.current) {
      verificationAttempted.current = true;
      verifyEmail.mutate({ token, identifier: email });
    } else if (!token || !email) {
      setVerificationStatus('error');
    }
  }, [token, email]);

  return (
    <div className="flex flex-col items-center gap-8 max-w-[392px] w-full">
      <RoundedIconWrapper>
        {verificationStatus === 'verifying' ? (
          <div className="animate-spin">
            <RiCheckboxCircleFill size={32} color="var(--text-sub-600)" />
          </div>
        ) : verificationStatus === 'success' ? (
          <RiCheckboxCircleFill size={32} color="var(--success-500)" />
        ) : (
          <RiCloseCircleFill size={32} color="var(--error-500)" />
        )}
      </RoundedIconWrapper>

      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-title-h5 text-text-strong-950">
          {verificationStatus === 'verifying'
            ? t('verifying')
            : verificationStatus === 'success'
            ? t('success')
            : t('error')}
        </h2>
        <p className="text-paragraph-md text-text-sub-600">
          {verificationStatus === 'verifying'
            ? t('please_wait')
            : verificationStatus === 'success'
            ? t('success_message')
            : t('missing_params')}
        </p>
      </div>

      {verificationStatus !== 'verifying' && (
        <Button
          className="w-full"
          variant="neutral"
          mode="filled"
          asChild
        >
          <Link href="/sign-in">
            {verificationStatus === 'success' ? t('continue_to_sign_in') : t('try_again')}
          </Link>
        </Button>
      )}
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
};

export default VerifyEmailPage; 