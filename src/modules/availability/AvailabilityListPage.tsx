'use client';

import AvailabilityHeader from '@/components/availability/AvailabilityHeader';
import React, {useRef} from 'react';

import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityList from '@/components/availability/AvailabilityList';
import {useAvailability} from '@/contexts/availability/AvailabilityContext';
import type {
  TAvailabilityList,
  TAvailabilityListItem
} from '@/contexts/availability/AvailabilityContext';
import {submitCreateSchedule} from '~/trpc/server/handlers/schedule.handler';
import {notification} from '@/hooks/use-notification';
import {useLocale} from '@/hooks/use-locale';
import {useOptimistic} from 'react';
import {TFormatedAvailabilitiesBySchedule} from '@/utils/formatAvailability';

export default function AvailabilityListPage() {
  const {
    state: {setIsCreateModalOpen},
    queries: {allAvailability}
  } = useAvailability();

  const {t} = useLocale('Availability');

  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticAvailabilityList, addOptimisticAvailabilityList] =
    useOptimistic(
      allAvailability,
      (
        state: TFormatedAvailabilitiesBySchedule[] | null,
        newAvailability: TFormatedAvailabilitiesBySchedule
      ) => {
        if (!state) return [] as TFormatedAvailabilitiesBySchedule[];

        return [...state, newAvailability];
      }
    );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        try {
          const name = formData.get('name');
          console.log('formData', formData);
          if (!name) return;

          const nameValue = name.toString().trim();

          if (!nameValue) return;

          addOptimisticAvailabilityList({
            scheduleId: Math.trunc(Math.random() * 1000),
            scheduleName: nameValue,
            timeZone:
              Intl.DateTimeFormat().resolvedOptions().timeZone ||
              'America/Sao_Paulo',
            availability: 'seg. - sex., 9:00 até 17:00',
            isDefault: false
          });
          setIsCreateModalOpen(false);

          const res = await submitCreateSchedule(nameValue);

          console.log('response', res);

          // router.push(`/availability/${scheduleResult.id}`);

          notification({
            title: t('schedule_created_success'),
            variant: 'stroke',
            id: 'schedule_created_success',
            status: 'success'
          });
        } catch (error) {}
      }}
    >
      <AvailabilityHeader formRef={formRef} />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityList initialAllAvailability={optimisticAvailabilityList} />
      </div>
    </form>
  );
}
