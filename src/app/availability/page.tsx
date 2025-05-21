export const dynamic = 'force-dynamic';

import PageLayout from '@/components/PageLayout';
import {redirect} from 'next/navigation';
import {auth} from '@/auth';
import {
  getAllAvailabilitiesByUserId
} from '~/trpc/server/handlers/availability.handler';
import {AvailabilityProvider} from '@/contexts/availability/AvailabilityContext';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import AvailabilityListPage from '@/modules/availability/AvailabilityListPage';

/** Availability page of the website. */
export default async function AvailabilityPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const allAvailability = await getAllAvailabilitiesByUserId(userId);
  const me = await getMeByUserId(userId);

  return (
    <PageLayout title="Disponibilidade">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <AvailabilityProvider
          initialAllAvailability={allAvailability}
          initialMe={me}
        >
          <AvailabilityListPage />
        </AvailabilityProvider>
      {/* </HydrationBoundary> */}
    </PageLayout>
  );
}
