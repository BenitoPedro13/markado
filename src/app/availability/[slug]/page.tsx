import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';
import {auth} from '@/auth';
import {findDetailedScheduleById} from '~/trpc/server/handlers/availability.handler';
import { AvailabilityProvider } from '@/contexts/AvailabilityContext';
import AvailabilityHeader from '@/components/availability/AvailabilityHeader';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/app/get-query-client';

type Props = {
  params: {
    slug: string;
  };
};

export default async function AvailabilityDetailsPage({params}: Props) {
  const session = await auth();

  if (!session?.user.id) return;

  const availabilityId = params.slug;

  // Create a new QueryClient for this request
  const queryClient = getQueryClient();

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ['availability', 'findDetailedScheduleById', { 
      scheduleId: +availabilityId, 
      timeZone: 'America/Sao_Paulo'
    }],
    queryFn: () => findDetailedScheduleById({
      scheduleId: +availabilityId,
      userId: session.user.id,
      timeZone: 'America/Sao_Paulo'
    })
  });

  const availability = await findDetailedScheduleById({
    scheduleId: +availabilityId,
    userId: session.user.id
  });

  const title = availability?.name;

  return (
    <PageLayout title="Disponibilidade">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AvailabilityProvider initialAvailability={availability}>
          <AvailabilityHeader
            mode="inside"
            title={title}
            subtitle="seg. - sex., 9:00 até 17:00"
            scheduleId={+availabilityId}
            timeZone={availability?.timeZone || 'America/Sao_Paulo'}
          />
          <div className="px-8">
            <Divider.Root />
          </div>

          <div className="p-8">
            <AvailabilityDetails
              title={title || ''}
            />
          </div>
        </AvailabilityProvider>
      </HydrationBoundary>
    </PageLayout>
  );
}
