'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/use-locale';
import * as Button from '@/components/align-ui/ui/button';
import { RiArrowLeftSLine } from '@remixicon/react';
import { SUPORT_WHATSAPP_NUMBER } from '@/constants';

type ServiceSchedulingPageClientProps = {
  username: string;
};

export const ServiceSchedulingPageClient = ({
  username
}: ServiceSchedulingPageClientProps) => {
  const { t } = useLocale();

  return (
    <div className="w-full flex justify-between">
      <Link href={`/${username}`} className="flex items-center gap-x-2">
        <Button.Root variant="neutral" mode="stroke">
          <Button.Icon as={RiArrowLeftSLine} />
          <span className="text-text-sub-600">{t('back_to_home')}</span>
        </Button.Root>
      </Link>

      <Link
        href={`https://wa.me/${SUPORT_WHATSAPP_NUMBER}`}
        className="flex items-center gap-x-2"
        target="_blank"
      >
        <Button.Root variant="neutral" mode="stroke">
          <span className="text-text-sub-600">{t('need_help')}</span>
        </Button.Root>
      </Link>
    </div>
  );
};
