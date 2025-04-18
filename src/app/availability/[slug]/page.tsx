'use client';

import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';

type Props = {
  params: {
    slug: string;
  };
};

export default function AvailabilityDetailsPage({params}: Props) {
  const title = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <PageLayout title="Disponibilidade">
      <Header 
        variant="availability" 
        mode="inside" 
        title={title}
        subtitle="seg. - sex., 9:00 até 17:00"
      />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityDetails title={title} />
      </div>
    </PageLayout>
  );
} 