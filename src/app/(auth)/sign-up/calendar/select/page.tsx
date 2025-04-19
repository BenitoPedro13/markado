'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { useTRPC } from '@/utils/trpc';
import { RiCalendarCheckFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/hooks/use-notification';

interface Calendar {
  id: string;
  name: string;
}

const CalendarSelect = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { nextStep } = useSignUp();
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('SignUpPage.CalendarSelect');
  const { notification } = useNotification();

  const { data: calendars, isLoading } = useQuery(
    trpc.calendar.getCalendars.queryOptions()
  );

  const { mutateAsync: selectCalendar } = useMutation(
    trpc.calendar.selectCalendar.mutationOptions({
      onSuccess: () => {
        nextStep();
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_selecting_calendar'),
          variant: 'stroke',
        });
        console.error('Error selecting calendar:', error);
        setIsSubmitting(false);
      },
    })
  );

  const handleSelect = async () => {
    if (!selectedCalendarId) return;
    
    setIsSubmitting(true);
    try {
      await selectCalendar({ calendarId: selectedCalendarId });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-paragraph-md text-text-sub-600">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCalendarCheckFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('select_calendar')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('select_calendar_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        {calendars?.map((calendar: Calendar) => (
          <Button
            key={calendar.id}
            className="w-full"
            variant={selectedCalendarId === calendar.id ? 'primary' : 'neutral'}
            mode={selectedCalendarId === calendar.id ? 'filled' : 'stroke'}
            onClick={() => setSelectedCalendarId(calendar.id)}
          >
            <span className="text-label-sm">{calendar.name}</span>
          </Button>
        ))}

        <Button
          className="w-full"
          variant="primary"
          mode="filled"
          onClick={handleSelect}
          disabled={!selectedCalendarId || isSubmitting}
        >
          <span className="text-label-sm">{t('continue')}</span>
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

export default CalendarSelect; 