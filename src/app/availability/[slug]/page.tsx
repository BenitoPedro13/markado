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
import AvailabilityDetailsPage from '@/modules/availability/availabilityDetails/AvailabilityDetailsPage';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AvailabilityDetailsServerPage(props: Props) {
  const params = await props.params;
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return;

  const availabilityId = params.slug;

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
          <AvailabilityDetailsPage />
        </AvailabilityDetailsProvider>
      {/* </HydrationBoundary> */}
    </PageLayout>
  );
}
