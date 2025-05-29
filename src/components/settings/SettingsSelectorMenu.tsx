'use client';

import React, {useEffect, useState} from 'react';
import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import {RiArrowRightSLine} from '@remixicon/react';
import {usePathname, useRouter} from 'next/navigation';
import {settingsMenuItems} from './SettingsMenuData';

export default function SettingsSelectorMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuItemClick = (value: string) => {
    const selectedItem = settingsMenuItems.find((item) => item.value === value);
    if (selectedItem) {
      router.push(selectedItem.route);
    }
  };

  const getCurrentPage = () => {
    return (
      settingsMenuItems.find((item) => item.route === pathname) ||
      settingsMenuItems[0]
    );
  };
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [pathname]);

  return (
    <TabMenuVertical.Root
      value={currentPage.value}
      className="px- items-start justify-start flex gap-8"
      onValueChange={handleMenuItemClick}
    >
      <TabMenuVertical.List className="max-w-[250px] p-4 border border-stroke-soft-200 rounded-lg h-fit">
        <div className="text-subheading-xs uppercase text-text-sub-600">
          Menu
        </div>
        {settingsMenuItems.map(
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
      {/* <div className="w-full">
            {menuItems.map(({value, component: Component}) => (
              <TabMenuVertical.Content key={value} value={value}>
                <Component me={me} />
              </TabMenuVertical.Content>
            ))}
          </div> */}
    </TabMenuVertical.Root>
  );
}
