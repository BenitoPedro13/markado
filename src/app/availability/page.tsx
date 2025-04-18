'use client';

import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityList from '@/components/availability/AvailabilityList';

/** Availability page of the website. */
export default function AvailabilityPage() {
  return (
    <PageLayout title="Disponibilidade">
      <Header variant="availability" />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityList />
      </div>
    </PageLayout>
  );
} 