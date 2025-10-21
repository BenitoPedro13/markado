import AvailabilityDetailsHeader from '@/components/availability/AvailabilityDetailsHeader';
import React from 'react';

import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';

export default function AvailabilityDetailsPage() {
  return (
    <>
      <AvailabilityDetailsHeader />
      <div className="md:px-8 px-4">
        <Divider.Root />
      </div>

      <div className="md:p-8 px-4">
        <AvailabilityDetails />
      </div>
    </>
  );
}
