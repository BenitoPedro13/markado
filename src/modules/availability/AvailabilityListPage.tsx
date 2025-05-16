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
    optimistic: {optimisticAvailabilityList}
  } = useAvailability();

  // const {t} = useLocale('Availability');

  return (
    <>
      <AvailabilityHeader />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityList initialAllAvailability={optimisticAvailabilityList} />
      </div>
    </>
  );
}
