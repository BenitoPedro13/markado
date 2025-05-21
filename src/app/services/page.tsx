export const dynamic = 'force-dynamic';

import PageLayout from '@/components/PageLayout';
import * as Divider from '@/components/align-ui/ui/divider';
import {ServicesProvider} from '@/contexts/services/ServicesContext';
import ServicesList from '@/components/services/ServicesList';
import ServicesSearch from '@/components/services/ServicesSearch';
import ServicesFilter from '@/components/services/ServicesFilter';
import ServicesHeader from '@/components/services/ServicesHeader';
import {getEventTypesFromGroup} from '~/trpc/server/handlers/services.handler';

export type TInitialServices = Awaited<
  ReturnType<typeof getEventTypesFromGroup>
>['eventTypes'];

/** Services page of the website. */
export default async function ServicesPage({
  searchParams
}: {
  searchParams?: {filter?: string; search?: string};
}) {
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

  console.log('initialServices:', initialServices);

  return (
    <PageLayout title="Home">
      <ServicesProvider initialServices={initialServices}>
        <ServicesHeader />
        <div className="px-8">
          <Divider.Root />
        </div>

        <div className="gap-8 p-8 ">
          <div className="flex justify-between">
            <ServicesFilter />
            <ServicesSearch />
          </div>
        </div>

        <ServicesList />
      </ServicesProvider>
    </PageLayout>
  );
}
