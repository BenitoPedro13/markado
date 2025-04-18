import {useTranslations} from 'next-intl';
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
  RiDraftFill,
  RiDraftLine,
  RiFileCopyFill,
  RiLinksFill,
  RiLinksLine,
  RiMore2Fill,
  RiSettingsFill,
  RiSettingsLine,
  RiTimeFill,
  RiTimeLine
} from '@remixicon/react';

type Props = {
  params: {
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
    iconLine: RiTimeLine,
    iconFill: RiTimeFill,
    component: ServiceAvailability,
  },
  {
    value: 'form',
    label: 'Formulário',
    iconLine: RiDraftLine,
    iconFill: RiDraftFill,
    component: ServiceForm,
  },
  {
    value: 'advanced',
    label: 'Avançado',
    iconLine: RiSettingsLine,
    iconFill: RiSettingsFill,
    component: ServiceAdvanced,
  },
];

export default function ServicePage({params: {slug}}: Props) {
  return (
    <PageLayout title="Detalhes do Serviço">
      <Header variant="services" mode="inside" />
      <div className="p-8 flex w-full justify-center">
        <TabMenuVertical.Root
          defaultValue="service"
          className="max-w-[900px] w-full items-start justify-center flex gap-8"
        >
          <TabMenuVertical.List className="w-[300px] p-4 border border-stroke-soft-200 rounded-lg h-fit">
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