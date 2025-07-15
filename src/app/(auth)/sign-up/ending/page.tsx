'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { useTRPC } from '@/utils/trpc';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { setOnboardingComplete } from '@/utils/cookie-utils';

const EndingPage = () => {
  // const { forms, nextStep, queries } = useSignUp();
  const t = useTranslations('SignUpPage.EndingPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  const trpc = useTRPC();
  const redirectTo = searchParams?.get('redirect') || '/';

  const completeOnboardingMutation = useMutation(trpc.profile.completeOnboarding.mutationOptions({
    onSuccess: () => {
      // Set the onboarding complete cookie when the DB is updated
      setOnboardingComplete();
      // Redirect to the original destination or home
      router.push(redirectTo);
    }
  }));

  useEffect(() => {
    // Complete the onboarding process
    completeOnboardingMutation.mutate();
  }, []);

  return (
    <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCheckboxCircleFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('all_set')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('your_account_is_ready')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        onClick={() => router.push(redirectTo)}
      >
        <span className="text-label-sm">{t('get_started')}</span>
      </Button>
    </div>
  );
};

export default EndingPage; 