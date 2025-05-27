export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import PageLayout from '@/components/PageLayout';
import {ServicesDetailsProvider} from '@/contexts/services/servicesDetails/ServicesContext';

import ServiceDetailsPage from '@/modules/services/serviceDetails/ServiceDetailsPage';
import { get } from 'lodash';
import { findDetailedScheduleById } from '~/trpc/server/handlers/availability.handler';
import { getServiceHandler } from '~/trpc/server/handlers/services.handler';
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
  
  const serviceSlug = slug;

  const service = await getServiceHandler({input: {slug: serviceSlug}});

  const me = (await getMeByUserId(userId as string)) ?? undefined;

  return (
    <PageLayout title="Detalhes do Serviço">
      <ServicesDetailsProvider initialServiceDetails={service.eventType} initialMe={me}>
        <ServiceDetailsPage slug={slug} />
      </ServicesDetailsProvider>
    </PageLayout>
  );
}
