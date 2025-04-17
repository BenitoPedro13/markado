'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Root as Button } from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiLogoutBoxFill } from '@remixicon/react';
import Link from 'next/link';

export default function LogoutPage() {
  const t = useTranslations('LogoutPage');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex flex-col items-center gap-6 max-w-[392px] w-full">
      <div className="flex flex-col items-center gap-4">
        <RoundedIconWrapper>
          <RiLogoutBoxFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>
        
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('logged_out')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('logged_out_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <Link href={`/${locale}/sign-in`} className="w-full">
        <Button
          className="w-full"
          variant="neutral"
          mode="filled"
        >
          <span className="text-label-sm">
            {t('go_to_sign_in')}
          </span>
        </Button>
      </Link>
    </div>
  );
} 