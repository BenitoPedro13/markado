'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as Divider from '@/components/align-ui/ui/divider';
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
  RiStoreLine,
  RiStoreFill
} from '@remixicon/react';
import Profile from '@/components/settings/profile/Profile';
import General from '@/components/settings/general/General';
import Calendars from '@/components/settings/calendars/Calendars';
import Conference from '@/components/settings/conference/Conference';
import Privacy from '@/components/settings/privacy/Privacy';
import Subscription from '@/components/settings/subscription/Subscription';
import Payment from '@/components/settings/payment/Payment';
import Business from '@/components/settings/business/Business';

const menuItems = [
  {
    value: 'profile',
    label: 'Perfil',
    iconLine: RiUser3Line,
    iconFill: RiUser3Fill,
    component: Profile
  },
  {
    value: 'business',
    label: 'Página do Negócio',
    iconLine: RiStoreLine,
    iconFill: RiStoreFill,
    component: Business
  },
  {
    value: 'general',
    label: 'Geral',
    iconLine: RiGlobalLine,
    iconFill: RiGlobalFill,
    component: General
  },
  {
    value: 'calendars',
    label: 'Calendários',
    iconLine: RiCalendarLine,
    iconFill: RiCalendarFill,
    component: Calendars
  },
  {
    value: 'conference',
    label: 'Conferência',
    iconLine: RiVideoLine,
    iconFill: RiVideoFill,
    component: Conference
  },
  {
    value: 'privacy',
    label: 'Privacidade e segurança',
    iconLine: RiLockLine,
    iconFill: RiLockFill,
    component: Privacy
  },
  {
    value: 'subscription',
    label: 'Minha Assinatura',
    iconLine: RiVipCrownLine,
    iconFill: RiVipCrownFill,
    component: Subscription
  },
  {
    value: 'payment',
    label: 'Pagamento',
    iconLine: RiWalletLine,
    iconFill: RiWalletFill,
    component: Payment
  },
];

type SettingsLayoutProps = {
  me: any;
};

export default function SettingsLayout({ me }: SettingsLayoutProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0]);

  return (
    <>
      <Header variant="settings" selectedMenuItem={selectedMenuItem} />
      <div className="px-8">
        <Divider.Root />
      </div>
      <div className="flex w-full py-8 justify-center">
        <TabMenuVertical.Root
          defaultValue="profile"
          className="px-8 w-full items-start justify-center flex gap-8"
          onValueChange={(value) => {
            const selectedItem = menuItems.find(item => item.value === value);
            if (selectedItem) {
              setSelectedMenuItem(selectedItem);
            }
          }}
        >
          <TabMenuVertical.List className="max-w-[250px] p-4 border border-stroke-soft-200 rounded-lg h-fit">
            <div className="text-subheading-xs uppercase text-text-sub-600">
              Menu
            </div>
            {menuItems.map(
              ({value, label, iconLine: IconLine, iconFill: IconFill}) => (
                <TabMenuVertical.Trigger
                  key={value}
                  value={value}
                  indicator={false}
                >
                  <TabMenuVertical.Icon
                    iconLine={<IconLine />}
                    iconFill={<IconFill />}
                  />
                  {label}
                  <TabMenuVertical.ArrowIcon>
                    <RiArrowRightSLine />
                  </TabMenuVertical.ArrowIcon>
                </TabMenuVertical.Trigger>
              )
            )}
          </TabMenuVertical.List>
          <div className="w-full">
            {menuItems.map(({value, component: Component}) => (
              <TabMenuVertical.Content key={value} value={value}>
                <Component me={me} />
              </TabMenuVertical.Content>
            ))}
          </div>
        </TabMenuVertical.Root>
      </div>
    </>
  );
} 