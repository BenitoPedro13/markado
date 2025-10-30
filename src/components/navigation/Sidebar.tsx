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
  RiSidebarFoldFill,
  RiSidebarUnfoldLine,
  RiSidebarUnfoldFill,
  RiTimeLine,
  RiTimeFill
} from '@remixicon/react';
import React, {PropsWithChildren, ReactElement, useEffect} from 'react';
import {usePathname} from 'next/navigation';

import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as TabMenuHorizontal from '@/components/align-ui/ui/tab-menu-horizontal';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Divider from '@/components/align-ui/ui/divider';
import SidebarFooter from './SidebarFooter';
import Link from 'next/link';
import {ProfileDropdown} from '@/components/navigation/ProfileDropdown';
import {useSidebarStore} from '@/stores/sidebar-store';
import useMediaQuery from '@/packages/lib/hooks/useMediaQuery';

import Logo from './Logo';

import {SUPORT_WHATSAPP_NUMBER} from '@/constants';

interface sidebarItem {
  iconLine: ReactElement;
  iconFill: ReactElement;
  label: string;
  link: string;
  action?: () => void;
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
    link: '/bookings'
  },
  {
    iconLine: <RiTimeLine />,
    iconFill: <RiTimeFill />,
    label: 'Disponibilidade',
    link: '/availability'
  },
  {
    iconLine: <RiLinksLine />,
    iconFill: <RiLinksFill />,
    label: 'Serviços',
    link: '/services'
  }
];

const Sidebar = ({children}: PropsWithChildren) => {
  const {isCollapsed, toggleCollapse, collapse, expand} = useSidebarStore();
  const pathname = usePathname();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isActive = (link: string) => {
    return pathname === `${link}`;
  };

  const settingsItems: sidebarItem[] = [
    {
      iconLine: <RiSettings2Line />,
      iconFill: <RiSettings2Fill />,
      label: 'Configurações',
      link: '/settings'
    },
    {
      iconLine: <RiHeadphoneLine />,
      iconFill: <RiHeadphoneFill />,
      label: 'Suporte',
      link: `https://wa.me/${SUPORT_WHATSAPP_NUMBER}`
    }
  ];

  useEffect(() => {
    if (isTablet) {
      collapse();
    } else {
      expand();
    }
  }, [isTablet, isMobile, collapse, expand]);

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`${isMobile ? 'hidden' : isCollapsed ? 'w-[80px]' : 'w-[280px]'} fixed  h-screen bg-bg-white-0 border-r border-stroke-soft-200 inline-flex flex-col justify-start items-start transition-all duration-300 z-10`}
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
              <Link
                href={
                  process.env.NEXT_PUBLIC_LANDING_URL || 'https://markado.co'
                }
                target="_blank"
                rel="noopener"
              >
                <Logo isCollapsed={isCollapsed} />
              </Link>
            </div>
            <div className="group flex items-center">
              <CompactButton.Root
                variant="stroke"
                className={`${isCollapsed ? 'hidden' : ''}`}
                id="sidebar-toggle"
                onClick={toggleCollapse}
              >
                <CompactButton.Icon
                  as={isCollapsed ? RiSidebarUnfoldLine : RiSidebarFoldLine}
                  className="group-hover:hidden"
                />
                <CompactButton.Icon
                  as={isCollapsed ? RiSidebarUnfoldFill : RiSidebarFoldFill}
                  className="hidden group-hover:block"
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
                  className="group-hover:hidden"
                />
                <CompactButton.Icon
                  as={isCollapsed ? RiSidebarUnfoldFill : RiSidebarFoldFill}
                  className="hidden group-hover:block"
                />
              </CompactButton.Root>
            </div>
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
                      <Link href={link} key={label}>
                        <TabMenuVertical.Trigger
                          value={label}
                          onClick={expand}
                          className={`${isCollapsed ? 'justify-center flex items-center' : ''} ${isActive(link) ? 'bg-primary-50 dark:bg-[#1c1c1c] text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
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
                          <Link
                            href={link}
                            key={label}
                            target={label === 'Suporte' ? '_blank' : '_self'}
                          >
                            <TabMenuVertical.Trigger
                              value={label}
                              onClick={collapse}
                              className={`${isCollapsed ? 'justify-center flex items-center' : ''} 
                                ${isActive(link) ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
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
        className={`${isMobile ? 'w-full' : isCollapsed ? 'w-[calc(100vw-80px)] left-[80px]' : 'w-[calc(100vw-280px)] left-[280px]'} relative transition-all duration-300`}
      >
        {isMobile && (
          <>
            <header className="w-full h-16 bg-bg-white-0 border-b border-stroke-soft-200 flex items-center px-4 sticky top-0 z-40 justify-between bg-opacity-50 py-1.5 backdrop-blur-lg sm:p-4 md:hidden">
              <div
                className={`w-full h-10 flex justify-between items-center gap-2.5 ${false ? 'w-[41px] h-[41px]' : 'opacity-100'} transition-all duration-300`}
              >
                <Link
                  href={
                    process.env.NEXT_PUBLIC_LANDING_URL || 'https://markado.co'
                  }
                  target="_blank"
                  rel="noopener"
                >
                  <Logo isCollapsed={false} />
                </Link>

                <div className={`w-fit items-end space-y-2`}>
                  <TabMenuHorizontal.Root defaultValue="Main" className="h-fit">
                    <TabMenuHorizontal.List className="relative flex  h-fit border-none gap-2">
                      {settingsItems.map(
                        ({label, iconLine, iconFill, link}) => (
                          <Link
                            href={link}
                            key={label}
                            target={label === 'Suporte' ? '_blank' : '_self'}
                          >
                            <TabMenuHorizontal.Trigger
                              value={label}
                              onClick={collapse}
                              className={` h-8 w-8 rounded-10
                                ${isActive(link) ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                              <TabMenuHorizontal.Icon
                                iconLine={iconLine}
                                iconFill={iconFill}
                                className="w-5 h-5"
                              />
                              {/* {label} */}
                            </TabMenuHorizontal.Trigger>
                          </Link>
                        )
                      )}
                      <ProfileDropdown>
                        <SidebarFooter isMobile={isMobile} />
                      </ProfileDropdown>
                    </TabMenuHorizontal.List>
                  </TabMenuHorizontal.Root>
                </div>
              </div>
            </header>
          </>
        )}
        {children}
        {isMobile && (
          <nav className="bg-bg-white-0 border-stroke-soft-200 h-16 fixed bottom-0 left-0 z-30 flex w-full border-t bg-opacity-40 px-1 shadow backdrop-blur-md">
            <TabMenuHorizontal.Root defaultValue="Main" className="h-full">
              <TabMenuHorizontal.List className="relative h-16 justify-evenly px-2">
                {mainItems.map(({label, iconLine, iconFill, link}) => (
                  <Link href={link} key={label} className="h-16 w-full">
                    <TabMenuHorizontal.Trigger
                      value={label}
                      onClick={expand}
                      className={`w-full h-full justify-center flex-col items-between rounded-10 ${isActive(link) ? 'text-text-strong-950' : 'hover:text-text-strong-950'}`}
                    >
                      <TabMenuHorizontal.Icon
                        iconLine={iconLine}
                        iconFill={iconFill}
                        className="w-5 h-5 text-current"
                      />
                      {label}
                    </TabMenuHorizontal.Trigger>
                  </Link>
                ))}
              </TabMenuHorizontal.List>
            </TabMenuHorizontal.Root>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
