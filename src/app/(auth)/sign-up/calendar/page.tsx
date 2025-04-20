'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { useTRPC } from '@/utils/trpc';
import { RiCalendarCheckFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useNotification } from '@/hooks/use-notification';

// import type {inferRouterOutputs} from '@trpc/server';
// import type {AppRouter} from '~/trpc/server';

// type RouterOutputs = inferRouterOutputs<AppRouter>;

const CalendarForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { nextStep } = useSignUp();
  const [isConnecting, setIsConnecting] = useState(false);
  const t = useTranslations('SignUpPage.CalendarForm');
  const { notification } = useNotification();

  const { mutateAsync: connectGoogleCalendar } = useMutation(
    trpc.calendar.connect.mutationOptions({
      onSuccess: (data) => {
        router.push(data.authUrl);
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_connecting_calendar'),
          variant: 'stroke',
        });
        console.error('Error connecting to Google Calendar:', error);
        setIsConnecting(false);
      },
    })
  );

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectGoogleCalendar();
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCalendarCheckFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('connect_calendar')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('connect_calendar_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <Button
          className="w-full"
          variant="primary"
          mode="filled"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <span className="text-label-sm">{t('connect_google_calendar')}</span>
        </Button>

        <Button
          className="w-full"
          variant="neutral"
          mode="stroke"
          onClick={handleSkip}
        >
          <span className="text-label-sm">{t('skip_for_now')}</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarForm; 