'use client';

import {
  RiCalendarLine,
  RiCalendarFill,
  RiDashboard3Line,
  RiDashboard3Fill,
  RiHeadphoneLine,
  RiHeadphoneFill,
  RiLinksLine,
  RiLinksFill,
  RiSettings2Line,
  RiSettings2Fill,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
  RiTimeLine,
  RiTimeFill
} from '@remixicon/react';
import React, {PropsWithChildren, ReactElement} from 'react';

import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Divider from '@/components/align-ui/ui/divider';
import SidebarFooter from './SidebarFooter';
import Link from 'next/link';
import Image from 'next/image';
import logoMarkado from '~/public/images/logoMarkado.svg';
import logo from '~/public/images/logo.svg';
import {ProfileDropdown} from '@/components/navigation/ProfileDropdown';
import {useSidebarStore} from '@/store/useSidebarStore';
import Logo from './Logo';

interface sidebarItem {
  iconLine: ReactElement;
  iconFill: ReactElement;
  label: string;
  link: string;
}

const mainItems: sidebarItem[] = [
  // {
  //   iconLine: <RiHomeLine />,
  //   iconFill: <RiHomeFill />,
  //   label: 'Home'
  // },
  {
    iconLine: <RiCalendarLine />,
    iconFill: <RiCalendarFill />,
    label: 'Agendamentos',
    link: 'bookings'
  },
  {
    iconLine: <RiTimeLine />,
    iconFill: <RiTimeFill />,
    label: 'Disponibilidade',
    link: 'availability'
  },
  {
    iconLine: <RiLinksLine />,
    iconFill: <RiLinksFill />,
    label: 'Serviços',
    link: 'services'
  },
  {
    iconLine: <RiDashboard3Line />,
    iconFill: <RiDashboard3Fill />,
    label: 'Relatórios',
    link: 'reports'
  }
];

const settingsItems: sidebarItem[] = [
  {
    iconLine: <RiSettings2Line />,
    iconFill: <RiSettings2Fill />,
    label: 'Configurações',
    link: 'settings'
  },
  {
    iconLine: <RiHeadphoneLine />,
    iconFill: <RiHeadphoneFill />,
    label: 'Suporte',
    link: 'support'
  }
];

const Sidebar = ({children}: PropsWithChildren) => {
  // const pathname = usePathname()
  const {isCollapsed, toggleCollapse} = useSidebarStore();

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`${isCollapsed ? 'w-[80px]' : 'w-[280px]'} fixed  h-screen bg-bg-white-0 border-r border-stroke-soft-200 inline-flex flex-col justify-start items-start transition-all duration-300 z-10`}
      >
        {/* Sidebar Header */}
        <div
          className={`w-full relative max-h-[88px] bg-bg-white-0 inline-flex justify-center items-center gap-3 ${isCollapsed ? 'px-0 py-3' : 'p-3'}`}
        >
          <div
            className={`w-full p-3 bg-bg-white-0 rounded-[10px] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div
              className={`h-10 flex justify-start items-center gap-2.5 ${isCollapsed ? 'w-[41px] h-[41px]' : 'opacity-100'} transition-all duration-300`}
            >
              <Link href="/">
                <Logo isCollapsed={isCollapsed} />
              </Link>
            </div>
            <CompactButton.Root
              variant="stroke"
              className={isCollapsed ? 'hidden' : ''}
              id="sidebar-toggle"
              onClick={toggleCollapse}
            >
              <CompactButton.Icon
                as={isCollapsed ? RiSidebarUnfoldLine : RiSidebarFoldLine}
              />
            </CompactButton.Root>
            <CompactButton.Root
              variant="stroke"
              className={`${isCollapsed ? 'absolute left-[calc(100%-12px)]' : 'hidden'} z-10`}
              id="sidebar-toggle"
              onClick={toggleCollapse}
            >
              <CompactButton.Icon
                as={isCollapsed ? RiSidebarUnfoldLine : RiSidebarFoldLine}
              />
            </CompactButton.Root>
          </div>
        </div>

        <div className="w-full px-5">
          <Divider.Root variant="line" />
        </div>

        <div className="self-stretch h-full flex-1 p-4 bg-bg-white-0 flex flex-col justify-start items-start gap-5 overflow-hidden">
          <div className="self-stretch h-full flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-full flex flex-col justify-start items-start gap-1">
              <div className="h-full w-full max-w-[258px]">
                <TabMenuVertical.Root defaultValue="Main" className="h-full">
                  <h4
                    className={`text-subheading-xs text-text-soft-400 mb-2 px-2 py-1 uppercase ${isCollapsed ? 'hidden' : ''}`}
                  >
                    Main
                  </h4>
                  <TabMenuVertical.List className="relative h-full">
                    {mainItems.map(({label, iconLine, iconFill, link}) => (
                      <Link href={`/${link}`} key={label}>
                        <TabMenuVertical.Trigger
                          value={label}
                          className={
                            isCollapsed
                              ? 'justify-center flex items-center'
                              : ''
                          }
                        >
                          <TabMenuVertical.Icon
                            iconLine={iconLine}
                            iconFill={iconFill}
                            className="w-5 h-5"
                          />
                          {!isCollapsed && label}
                        </TabMenuVertical.Trigger>
                      </Link>
                    ))}
                    <div
                      className={`w-full absolute ${isCollapsed ? '-bottom-4' : 'bottom-4'} items-end space-y-2`}
                    >
                      {settingsItems.map(
                        ({label, iconLine, iconFill, link}) => (
                          <Link href={`/${link}`} key={label}>
                            <TabMenuVertical.Trigger
                              value={label}
                              className={
                                isCollapsed
                                  ? 'justify-center flex items-center'
                                  : ''
                              }
                            >
                              <TabMenuVertical.Icon
                                iconLine={iconLine}
                                iconFill={iconFill}
                                className="w-5 h-5"
                              />
                              {!isCollapsed && label}
                            </TabMenuVertical.Trigger>
                          </Link>
                        )
                      )}
                    </div>
                  </TabMenuVertical.List>
                </TabMenuVertical.Root>
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 flex flex-col justify-end items-start gap-1.5"></div>
        </div>
        <div className="w-full px-5">
          <Divider.Root variant="line" />
        </div>

        <ProfileDropdown>
          <SidebarFooter />
        </ProfileDropdown>
      </div>
      {/* Main Content */}
      <div
        className={`${isCollapsed ? 'w-[calc(100vw-80px)] left-[80px]' : 'w-[calc(100vw-280px)] left-[280px]'} relative transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
