export const dynamic = 'force-dynamic';
import PageLayout from '@/components/PageLayout';

import ServiceDetailsPage from '@/modules/services/serviceDetails/ServiceDetailsPage';

type Props = {
  params: {
    slug: string;
  };
};

export default async function ServiceDetailsServerPage({
  params: {slug}
}: Props) {
  return (
    <PageLayout title="Detalhes do Serviço">
      <ServiceDetailsPage slug={slug} />
    </PageLayout>
  );
}
