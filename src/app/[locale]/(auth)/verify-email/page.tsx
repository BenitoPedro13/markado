'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTRPC } from '@/utils/trpc';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { Root as Button } from '@/components/align-ui/ui/button';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

const VerifyEmailPage = () => {
  const trpc = useTRPC();
  const t = useTranslations('VerifyEmailPage');
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const verifyEmail = useMutation(trpc.verifyEmail.mutationOptions({
    onSuccess: () => {
      setVerificationStatus('success');
    },
    onError: () => {
      setVerificationStatus('error');
    },
  }));

  useEffect(() => {
    if (token && email) {
      verifyEmail.mutate({ token, identifier: email });
    } else {
      setVerificationStatus('error');
    }
  }, [token, email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
    </div>
  );
};

export default VerifyEmailPage; 