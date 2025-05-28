export const dynamic = 'force-dynamic';

import PageLayout from '@/components/PageLayout';
import {ServicesProvider} from '@/contexts/services/ServicesContext';
import {getEventTypesFromGroup} from '~/trpc/server/handlers/services.handler';
import {redirect} from 'next/navigation';
import {auth} from '@/auth';
import ServicesListPage from '@/modules/services/ServicesListPage';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

export type TInitialServices = Awaited<
  ReturnType<typeof getEventTypesFromGroup>
>['eventTypes'];

/** Services page of the website. */
export default async function ServicesPage(
  props: {
    searchParams?: Promise<{filter?: string; search?: string}>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  // // Parse filters/search from URL
  const filter = searchParams?.filter;
  const search = searchParams?.search;

  // Map filter to your schema if needed
  const filters = filter
    ? {
        /* ...map filter string to object... */
      }
    : undefined;

  const input = {
    group: {teamId: null, parentId: null},
    limit: 10,
    filters,
    searchQuery: search
  };

  const {eventTypes: initialServices} = await getEventTypesFromGroup({input});
  const me = await getMeByUserId(userId);

  console.log('initialServices:', initialServices);

  return (
    <PageLayout title="Home">
      <ServicesProvider initialServices={initialServices} initialMe={me}>
        <ServicesListPage />
      </ServicesProvider>
    </PageLayout>
  );
}
