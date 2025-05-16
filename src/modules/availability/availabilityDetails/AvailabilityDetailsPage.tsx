import AvailabilityDetailsHeader from '@/components/availability/AvailabilityDetailsHeader';
import React from 'react';

import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';

export default function AvailabilityDetailsPage() {
  return (
    <>
      <AvailabilityDetailsHeader />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityDetails />
      </div>
    </>
  );
}
