import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import ServiceDetails from '@/components/services/service-details/ServiceDetails';
import ServiceAvailability from '@/components/services/service-details/ServiceAvailability';
import ServiceForm from '@/components/services/service-details/ServiceForm';
import ServiceAdvanced from '@/components/services/service-details/ServiceAdvanced';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

export default function ServicePage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);

  return (
    <PageLayout title="Detalhes do Serviço">
      <Header variant="services" />
      <div className="p-8">
        <TabMenuVertical.Root defaultValue="service">
          <TabMenuVertical.List>
            <TabMenuVertical.Trigger value="service">Serviço</TabMenuVertical.Trigger>
            <TabMenuVertical.Trigger value="availability">Disponibilidade</TabMenuVertical.Trigger>
            <TabMenuVertical.Trigger value="form">Formulário</TabMenuVertical.Trigger>
            <TabMenuVertical.Trigger value="advanced">Avançado</TabMenuVertical.Trigger>
          </TabMenuVertical.List>
          <div className="mt-6">
            <TabMenuVertical.Content value="service">
              <ServiceDetails slug={slug} />
            </TabMenuVertical.Content>
            <TabMenuVertical.Content value="availability">
              <ServiceAvailability slug={slug} />
            </TabMenuVertical.Content>
            <TabMenuVertical.Content value="form">
              <ServiceForm slug={slug} />
            </TabMenuVertical.Content>
            <TabMenuVertical.Content value="advanced">
              <ServiceAdvanced slug={slug} />
            </TabMenuVertical.Content>
          </div>
        </TabMenuVertical.Root>
      </div>
    </PageLayout>
  );
} 