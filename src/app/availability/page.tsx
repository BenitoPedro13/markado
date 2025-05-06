'use client';

import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityList from '@/components/availability/AvailabilityList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {getAllAvailabilitiesByUserId} from '~/trpc/server/handlers/availability.handler';

/** Availability page of the website. */
export default async function AvailabilityPage() {

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const allAvailability = await getAllAvailabilitiesByUserId(userId);

  console.log('[AvailabilityPage] allAvailability', allAvailability);

  return (
    <PageLayout title="Disponibilidade">
      <Header variant="availability" />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="p-8">
        <AvailabilityList allAvailability={allAvailability} />
      </div>
    </PageLayout>
  );
} 