export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import PageLayout from '@/components/PageLayout';
import {ServicesDetailsProvider} from '@/contexts/services/servicesDetails/ServicesContext';

import ServiceDetailsPage from '@/modules/services/serviceDetails/ServiceDetailsPage';
import { listAvailabilitiesHandler } from '~/trpc/server/handlers/availability.handler';
import { getServiceHandler } from '~/trpc/server/handlers/services.handler';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServiceDetailsServerPage(props: Props) {
  const params = await props.params;

  const {
    slug
  } = params;

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) return;

  const serviceSlug = slug;

  const service = await getServiceHandler({input: {slug: serviceSlug}});

  const me = (await getMeByUserId(userId as string));

  const scheduleList = await listAvailabilitiesHandler();

  return (
    <PageLayout title="Detalhes do Serviço">
      <ServicesDetailsProvider initialServiceDetails={service.eventType} locationOptions={service.locationOptions} initialMe={me} initialScheduleList={scheduleList.schedules}>
        <ServiceDetailsPage slug={slug} />
      </ServicesDetailsProvider>
    </PageLayout>
  );
}
