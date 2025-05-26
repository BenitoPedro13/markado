import PageLayout from '@/components/PageLayout';
import * as Divider from '@/components/align-ui/ui/divider';
import ServicesDetailsHeader from '@/components/services/ServicesDetailsHeader';
import ServicesDetailsSidebar from '@/components/services/service-details/ServicesDetailsSidebar';

type Props = {
  params: {
    slug: string;
  };
};

export default function ServicePage({params: {slug}}: Props) {
  return (
    <PageLayout title="Detalhes do Serviço">
      <ServicesDetailsHeader title="Configuração do Serviço" />
      <div className="px-8">
        <Divider.Root />
      </div>
      <ServicesDetailsSidebar slug={slug} />
    </PageLayout>
  );
}
