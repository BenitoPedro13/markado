import PageLayout from '@/components/PageLayout';
import AvailabilityHeader from '@/components/availability/AvailabilityHeader';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityList from '@/components/availability/AvailabilityList';
import {redirect} from 'next/navigation';
import {auth} from '@/auth';
import {
  findDetailedScheduleById,
  getAllAvailabilitiesByUserId
} from '~/trpc/server/handlers/availability.handler';
import {AvailabilityProvider} from '@/contexts/AvailabilityContext';
import {getQueryClient} from '@/app/get-query-client';
import {dehydrate} from '@tanstack/react-query';
import {HydrationBoundary} from '@tanstack/react-query';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

/** Availability page of the website. */
export default async function AvailabilityPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  // Create a new QueryClient for this request
  const queryClient = getQueryClient();

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: [
      ['availability', 'getAll'],
      {
        type: 'query'
      }
    ],
    queryFn: () => getAllAvailabilitiesByUserId(userId)
  });

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: () => getMeByUserId(userId)
  });

  const allAvailability = await getAllAvailabilitiesByUserId(userId);
  const me = await getMeByUserId(userId);

  return (
    <PageLayout title="Disponibilidade">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AvailabilityProvider
          initialAllAvailability={allAvailability}
          initialAvailabilityDetails={null}
          initialMe={me}
        >
          <AvailabilityHeader />
          <div className="px-8">
            <Divider.Root />
          </div>

          <div className="p-8">
            <AvailabilityList initialAllAvailability={allAvailability} />
          </div>
        </AvailabilityProvider>
      </HydrationBoundary>
    </PageLayout>
  );
}
