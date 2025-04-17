'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiMailLine } from '@remixicon/react';
import { Root as Button } from '@/components/align-ui/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

const CheckEmailContent = () => {
  const t = useTranslations('CheckEmailPage');
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="flex flex-col items-center gap-8 max-w-[392px] w-full">
      <RoundedIconWrapper>
        <RiMailLine size={32} color="var(--text-sub-600)" />
      </RoundedIconWrapper>

      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-title-h5 text-text-strong-950">
          {t('check_your_email')}
        </h2>
        <p className="text-paragraph-md text-text-sub-600">
          {t('verification_email_sent', { email })}
        </p>
        <p className="text-paragraph-sm text-text-sub-600 mt-2">
          {t('click_link_in_email')}
        </p>
      </div>

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        asChild
      >
        <Link href="/pt/sign-in">
          {t('back_to_sign_in')}
        </Link>
      </Button>
    </div>
  );
};

const CheckEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CheckEmailContent />
      </Suspense>
    </div>
  );
};

export default CheckEmailPage; 