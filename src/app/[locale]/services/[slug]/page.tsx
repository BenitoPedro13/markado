import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import ServiceDetails from '@/components/services/service-details/ServiceDetails';
import ServiceAvailability from '@/components/services/service-details/ServiceAvailability';
import ServiceForm from '@/components/services/service-details/ServiceForm';
import ServiceAdvanced from '@/components/services/service-details/ServiceAdvanced';
import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiDraftLine,
  RiFileCopyFill,
  RiLinksFill,
  RiLinksLine,
  RiMore2Fill
} from '@remixicon/react';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

const menuItems = [
  {
    value: 'service',
    label: 'Serviço',
    iconLine: RiLinksLine,
    iconFill: RiLinksFill,
    component: ServiceDetails,
  },
  {
    value: 'availability',
    label: 'Disponibilidade',
    iconLine: RiCalendarLine,
    iconFill: RiCalendarLine,
    component: ServiceAvailability,
  },
  {
    value: 'form',
    label: 'Formulário',
    iconLine: RiDraftLine,
    iconFill: RiFileCopyFill,
    component: ServiceForm,
  },
  {
    value: 'advanced',
    label: 'Avançado',
    iconLine: RiMore2Fill,
    iconFill: RiMore2Fill,
    component: ServiceAdvanced,
  },
];

export default function ServicePage({params: {locale, slug}}: Props) {
  setRequestLocale(locale);

  return (
    <PageLayout title="Detalhes do Serviço">
      <Header variant="services" mode="inside" />
      <div className="p-8 flex w-full justify-center">
        <TabMenuVertical.Root
          defaultValue="service"
          className="max-w-[900px] w-full items-start justify-center flex gap-4"
        >
          <TabMenuVertical.List className="w-[300px] p-4 border rounded-lg border-border-stroke-200 h-fit">
            <div className="text-subheading-xs uppercase text-text-sub-600">
              Menu
            </div>
            {menuItems.map(({value, label, iconLine: IconLine, iconFill: IconFill}) => (
              <TabMenuVertical.Trigger key={value} value={value} indicator={false}>
                <TabMenuVertical.Icon
                  iconLine={<IconLine />}
                  iconFill={<IconFill />}
                />
                {label}
                <TabMenuVertical.ArrowIcon>
                  <RiArrowRightSLine />
                </TabMenuVertical.ArrowIcon>
              </TabMenuVertical.Trigger>
            ))}
          </TabMenuVertical.List>
          <div className="w-full">
            {menuItems.map(({value, component: Component}) => (
              <TabMenuVertical.Content key={value} value={value}>
                <Component slug={slug} />
              </TabMenuVertical.Content>
            ))}
          </div>
        </TabMenuVertical.Root>
      </div>
    </PageLayout>
  );
}
