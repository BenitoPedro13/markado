import {useTranslations} from 'next-intl';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import Profile from '@/components/settings/profile/Profile';
import General from '@/components/settings/general/General';
import Calendars from '@/components/settings/calendars/Calendars';
import Conference from '@/components/settings/conference/Conference';
import Privacy from '@/components/settings/privacy/Privacy';
import Subscription from '@/components/settings/subscription/Subscription';
import Payment from '@/components/settings/payment/Payment';
import {
  RiArrowRightSLine,
  RiUser3Line,
  RiUser3Fill,
  RiGlobalLine,
  RiGlobalFill,
  RiCalendarLine,
  RiCalendarFill,
  RiVideoLine,
  RiVideoFill,
  RiLockLine,
  RiLockFill,
  RiVipCrownLine,
  RiVipCrownFill,
  RiWalletLine,
  RiWalletFill,
} from '@remixicon/react';

type Props = {
  params: {
    slug: string;
  };
};

const menuItems = [
  {
    value: 'profile',
    label: 'Perfil',
    iconLine: RiUser3Line,
    iconFill: RiUser3Fill,
    component: Profile,
  },
  {
    value: 'general',
    label: 'Geral',
    iconLine: RiGlobalLine,
    iconFill: RiGlobalFill,
    component: General,
  },
  {
    value: 'calendars',
    label: 'Calendários',
    iconLine: RiCalendarLine,
    iconFill: RiCalendarFill,
    component: Calendars,
  },
  {
    value: 'conference',
    label: 'Conferência',
    iconLine: RiVideoLine,
    iconFill: RiVideoFill,
    component: Conference,
  },
  {
    value: 'privacy',
    label: 'Privacidade e segurança',
    iconLine: RiLockLine,
    iconFill: RiLockFill,
    component: Privacy,
  },
  {
    value: 'subscription',
    label: 'Minha Assinatura',
    iconLine: RiVipCrownLine,
    iconFill: RiVipCrownFill,
    component: Subscription,
  },
  {
    value: 'payment',
    label: 'Pagamento',
    iconLine: RiWalletLine,
    iconFill: RiWalletFill,
    component: Payment,
  },
];

export default function ServicePage() {
  return (
    <PageLayout title="Configurações">
      <Header variant="settings" />
      <div className="p-8 flex w-full justify-center">
        <TabMenuVertical.Root
          defaultValue="profile"
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
                <Component />
              </TabMenuVertical.Content>
            ))}
          </div>
        </TabMenuVertical.Root>
      </div>
    </PageLayout>
  );
} 