export const dynamic = 'force-dynamic';

import PageLayout from '@/components/PageLayout';
// import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';
import {auth} from '@/auth';
import {findDetailedScheduleById} from '~/trpc/server/handlers/availability.handler';
// import {AvailabilityProvider} from '@/contexts/availability/AvailabilityContext';
import AvailabilityHeader from '@/components/availability/AvailabilityHeader';
// import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
// import {getQueryClient} from '@/app/get-query-client';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import { AvailabilityDetailsProvider } from '@/contexts/availability/availabilityDetails/AvailabilityContext';
import AvailabilityDetailsHeader from '@/components/availability/AvailabilityDetailsHeader';

type Props = {
  params: {
    slug: string;
  };
};

export default async function AvailabilityDetailsPage({params}: Props) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return;

  const availabilityId = params.slug;

  // Create a new QueryClient for this request
  // const queryClient = getQueryClient();

  // // Prefetch the data
  // await queryClient.prefetchQuery({
  //   queryKey: [
  //     'availability',
  //     'findDetailedScheduleById',
  //     {
  //       scheduleId: +availabilityId,
  //       timeZone: 'America/Sao_Paulo'
  //     }
  //   ],
  //   queryFn: () =>
  //     findDetailedScheduleById({
  //       scheduleId: +availabilityId,
  //       userId: userId,
  //       timeZone: 'America/Sao_Paulo'
  //     })
  // });

  // // Prefetch the data
  // await queryClient.prefetchQuery({
  //   queryKey: ['me'],
  //   queryFn: () => getMeByUserId(userId)
  // });

  const availability = await findDetailedScheduleById({
    scheduleId: +availabilityId,
    userId: userId
  });
  const me = await getMeByUserId(userId);

  const title = availability?.name;

  return (
    <PageLayout title="Disponibilidade">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <AvailabilityDetailsProvider
          initialAvailabilityDetails={availability}
          initialMe={me}
        >
          <AvailabilityDetailsHeader
            // title={title}
            // subtitle="seg. - sex., 9:00 até 17:00"
            scheduleId={+availabilityId}
            // timeZone={availability?.timeZone || 'America/Sao_Paulo'}
          />
          <div className="px-8">
            <Divider.Root />
          </div>

          <div className="p-8">
            <AvailabilityDetails title={title || ''} />
          </div>
        </AvailabilityDetailsProvider>
      {/* </HydrationBoundary> */}
    </PageLayout>
  );
}
