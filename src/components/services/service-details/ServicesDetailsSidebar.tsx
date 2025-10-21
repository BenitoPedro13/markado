'use client'

import React from 'react';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as TabMenuHorizontal from '@/components/align-ui/ui/tab-menu-horizontal';

import {
  RiArrowRightSLine,
  RiDraftFill,
  RiDraftLine,
  RiLinksFill,
  RiLinksLine,
  RiSettingsFill,
  RiSettingsLine,
  RiTimeFill,
  RiTimeLine
} from '@remixicon/react';

import ServiceDetails from '@/components/services/service-details/ServiceDetails';
import ServiceAvailability from '@/components/services/service-details/ServiceAvailability';
import ServiceForm from '@/components/services/service-details/ServiceForm';
import ServiceAdvanced from '@/components/services/service-details/ServiceAdvanced';

const menuItems = [
  {
    value: 'service',
    label: 'Serviço',
    iconLine: RiLinksLine,
    iconFill: RiLinksFill,
    component: ServiceDetails
  },
  {
    value: 'availability',
    label: 'Disponibilidade',
    iconLine: RiTimeLine,
    iconFill: RiTimeFill,
    component: ServiceAvailability
  },
  {
    value: 'form',
    label: 'Formulário',
    iconLine: RiDraftLine,
    iconFill: RiDraftFill,
    component: ServiceForm
  },
  {
    value: 'advanced',
    label: 'Avançado',
    iconLine: RiSettingsLine,
    iconFill: RiSettingsFill,
    component: ServiceAdvanced
  }
];

function ServicesDetailsSidebar({slug}: {slug: string}) {
  if (!slug) {
    return null; // or handle the case where slug is not provided
  }

  return (
    <div className="md:p-8 p-4 flex w-full justify-center">
      <TabMenuHorizontal.Root
        defaultValue="service"
        className=" w-full items-start justify-center flex md:hidden md:flex-row flex-col gap-4"
      >
        <TabMenuHorizontal.List className="rounded-lg h-fit md:hidden flex border-none justify-between" wrapperClassName='w-full overflow-x-scroll'>
          {menuItems.map(
            ({value, label, iconLine: IconLine, iconFill: IconFill}) => (
              <TabMenuHorizontal.Trigger
                key={value}
                value={value}
                // indicator={false}
              >
                <TabMenuHorizontal.Icon
                  iconLine={<IconLine />}
                  iconFill={<IconFill />}
                />
                {label}
                {/* <TabMenuHorizontal.ArrowIcon>
                  <RiArrowRightSLine />
                </TabMenuHorizontal.ArrowIcon> */}
              </TabMenuHorizontal.Trigger>
            )
          )}
        </TabMenuHorizontal.List>
        <div className="w-full">
          {menuItems.map(({value, component: Component}) => (
            <TabMenuHorizontal.Content key={value} value={value}>
              <Component slug={slug} />
            </TabMenuHorizontal.Content>
          ))}
        </div>
      </TabMenuHorizontal.Root>
      <TabMenuVertical.Root
        defaultValue="service"
        className="max-w-[900px] w-full items-start justify-center md:flex gap-8 hidden"
      >
        <TabMenuVertical.List className="w-[300px] p-4 border border-stroke-soft-200 rounded-lg h-fit">
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
              <Component slug={slug} />
            </TabMenuVertical.Content>
          ))}
        </div>
      </TabMenuVertical.Root>
    </div>
  );
}

export default ServicesDetailsSidebar;
