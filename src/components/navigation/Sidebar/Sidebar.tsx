import {Icon} from '@radix-ui/react-select';
import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiCalendarFill,
  RiDashboard3Line,
  RiDashboard3Fill,
  RiHeadphoneLine,
  RiHeadphoneFill,
  RiHomeLine,
  RiHomeFill,
  RiLinksLine,
  RiLinksFill,
  RiSettings2Line,
  RiSettings2Fill,
  RiSidebarFoldLine,
  RiTimeLine,
  RiTimeFill
} from '@remixicon/react';
import React, {
  ElementType,
  PropsWithChildren,
  ReactElement,
  ReactNode
} from 'react';

import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Divider from '@/components/align-ui/ui/divider';
import SidebarFooter from './SidebarFooter';

interface sidebarItem {
  iconLine: ReactElement;
  iconFill: ReactElement;
  label: string;
}

const mainItems: sidebarItem[] = [
  {
    iconLine: <RiHomeLine />,
    iconFill: <RiHomeFill />,
    label: 'Home'
  },
  {
    iconLine: <RiCalendarLine />,
    iconFill: <RiCalendarFill />,
    label: 'Agendamentos'
  },
  {
    iconLine: <RiTimeLine />,
    iconFill: <RiTimeFill />,
    label: 'Disponibilidade'
  },
  {
    iconLine: <RiLinksLine />,
    iconFill: <RiLinksFill />,
    label: 'Serviços'
  },
  {
    iconLine: <RiDashboard3Line />,
    iconFill: <RiDashboard3Fill />,
    label: 'Relatórios'
  }
];

const settingsItems: sidebarItem[] = [
  {
    iconLine: <RiSettings2Line />,
    iconFill: <RiSettings2Fill />,
    label: 'Configurações'
  },
  {
    iconLine: <RiHeadphoneLine />,
    iconFill: <RiHeadphoneFill />,
    label: 'Suporte'
  }
];

const Sidebar = ({children}: PropsWithChildren) => {
  return (
    <div className="flex">
      {/* Header */}
      <div className="w-[280px] h-screen bg-bg-white-0 border-r border-stroke-soft-200 inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="w-full p-3 relative bg-bg-white-0 inline-flex justify-center items-center gap-3 overflow-hidden">
          <div className="w-full p-3 bg-bg-white-0 rounded-[10px] flex justify-between items-center overflow-hidden">
            <div className="h-10 flex justify-start items-center gap-2.5">
              <img src="./images/logoMarkado.svg" />
            </div>
            <CompactButton.Root variant="stroke">
              <CompactButton.Icon as={RiSidebarFoldLine} />
            </CompactButton.Root>
          </div>
        </div>

        <div className="w-full px-5">
          <Divider.Root variant="line" />
        </div>

        <div className="self-stretch h-full flex-1 px-5 pt-5 pb-4 bg-bg-white-0 flex flex-col justify-start items-start gap-5 overflow-hidden">
          <div className="self-stretch h-full flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-full flex flex-col justify-start items-start gap-1">
              <div className="h-full w-full max-w-[258px]">
                <TabMenuVertical.Root defaultValue="Main" className="h-full">
                  <h4 className="text-subheading-xs text-text-soft-400 mb-2 px-2 py-1 uppercase">
                    Main
                  </h4>
                  <TabMenuVertical.List className="relative h-full">
                    {mainItems.map(({label, iconLine, iconFill}) => (
                      <TabMenuVertical.Trigger key={label} value={label}>
                        <TabMenuVertical.Icon
                          iconLine={iconLine}
                          iconFill={iconFill}
                          className="w-5 h-5"
                        />
                        {label}
                      </TabMenuVertical.Trigger>
                    ))}
                    <div className="w-full absolute bottom-4 items-end space-y-2">
                      {settingsItems.map(({label, iconLine, iconFill}) => (
                        <TabMenuVertical.Trigger key={label} value={label}>
                          <TabMenuVertical.Icon
                            iconLine={iconLine}
                            iconFill={iconFill}
                            className="w-5 h-5"
                          />
                          {label}
                        </TabMenuVertical.Trigger>
                      ))}
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

        {/* Footer */}
        <SidebarFooter
          variant="pro"
          name="Marcus Dutra"
          email="marcaum@markado.co"
          avatarUrl="https://media.contra.com/image/upload/c_fill,f_avif,h_160,q_auto:good,w_160/rbaw0sc545eixfngewsw"
        />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Sidebar;
