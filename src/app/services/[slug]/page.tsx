export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import PageLayout from '@/components/PageLayout';
import {ServicesDetailsProvider} from '@/contexts/services/servicesDetails/ServicesContext';

import ServiceDetailsPage from '@/modules/services/serviceDetails/ServiceDetailsPage';
import { findDetailedScheduleById } from '~/trpc/server/handlers/availability.handler';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

type Props = {
  params: {
    slug: string;
  };
};

export default async function ServiceDetailsServerPage({
  params: {slug}
}: Props) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return;

  const availabilityId = slug;

  // const availability = await findDetailedScheduleById({
  //   scheduleId: +availabilityId,
  //   userId: userId
  // });
  const me = await getMeByUserId(userId);

  // const title = availability?.name;

  return (
    <PageLayout title="Detalhes do Serviço">
      <ServicesDetailsProvider
        initialServiceDetails={null}
        initialMe={me}
      >
        <ServiceDetailsPage slug={slug} />
      </ServicesDetailsProvider>
    </PageLayout>
  );
}
