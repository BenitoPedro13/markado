'use client';

import * as Input from '@/components/align-ui/ui/input';
import * as Button from '@/components/align-ui/ui/button';
import {RiAddLine, RiDeleteBinLine, RiInformationLine} from '@remixicon/react';
import {useTRPC} from '@/utils/trpc';
import {useRouter} from 'next/navigation';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNotification} from '@/hooks/use-notification';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

interface CalendarItemProps {
  icon?: React.ReactNode;
  name: string;
  email?: string;
  onDelete?: () => void;
  isActive?: boolean;
}

interface Calendar {
  id: string;
  name: string;
}

const CalendarItem = ({
  icon,
  name,
  email,
  onDelete,
  isActive = true
}: CalendarItemProps) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            className="sr-only peer"
            onChange={() => {}}
          />
          <div className="w-9 h-5 bg-bg-weak-50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-base"></div>
        </label>
      </div>
      <div className="flex flex-col">
        <span className="text-paragraph-md text-text-strong-950">{name}</span>
        {email && (
          <span className="text-paragraph-sm text-text-sub-600">{email}</span>
        )}
      </div>
    </div>
    {onDelete && (
      <Button.Root variant="neutral" mode="ghost" onClick={onDelete}>
        <RiDeleteBinLine className="size-5 text-text-sub-600" />
      </Button.Root>
    )}
  </div>
);

export default function Calendars() {
  const trpc = useTRPC();
  const router = useRouter();
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('SignUpPage.CalendarSelect');
  const {notification} = useNotification();

  const {data: calendars, isLoading} = useQuery(
    trpc.calendar.getCalendars.queryOptions()
  );

  const {mutateAsync: selectCalendar} = useMutation(
    trpc.calendar.selectCalendar.mutationOptions({
      onSuccess: () => {
        router.push('/settings');
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_selecting_calendar'),
          variant: 'stroke'
        });
        console.error('Error selecting calendar:', error);
        setIsSubmitting(false);
      }
    })
  );

  const handleSelect = async () => {
    if (!selectedCalendarId) return;

    setIsSubmitting(true);
    try {
      await selectCalendar({calendarId: selectedCalendarId});
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleSkip = () => {
    router.push('/settings');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-paragraph-md text-text-sub-600">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 ">
      <div className="border  border-stroke-soft-200 rounded-lg ">
        <div className="p-6 border-b flex flex-col gap-4 border-stroke-soft-200">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">
              Escolha seu calendário
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Gerencie suas integrações de calendário.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {calendars?.map((calendar: Calendar) => (
              <Button.Root
                key={calendar.id}
                className="w-full"
                variant={
                  selectedCalendarId === calendar.id ? 'primary' : 'neutral'
                }
                mode={selectedCalendarId === calendar.id ? 'filled' : 'stroke'}
                onClick={() => setSelectedCalendarId(calendar.id)}
              >
                <span className="text-label-sm">{calendar.name}</span>
              </Button.Root>
            ))}

            <Button.Root
              className="w-full"
              variant="neutral"
              mode="filled"
              onClick={handleSelect}
              disabled={!selectedCalendarId || isSubmitting}
            >
              <span className="text-label-sm">{t('continue')}</span>
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
