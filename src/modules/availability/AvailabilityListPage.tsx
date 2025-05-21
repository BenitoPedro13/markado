'use client';

import AvailabilityHeader from '@/components/availability/AvailabilityHeader';
import React from 'react';

import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityList from '@/components/availability/AvailabilityList';
import {useAvailability} from '@/contexts/availability/AvailabilityContext';

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
