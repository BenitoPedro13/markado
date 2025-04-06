import {Icon} from '@radix-ui/react-select';
import {
  RiCalendarLine,
  RiDashboard3Line,
  RiHeadphoneLine,
  RiHomeLine,
  RiLinksLine,
  RiSettings2Line,
  RiSidebarFoldLine,
  RiTimeLine
} from '@remixicon/react';
import React, {PropsWithChildren} from 'react';

import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Divider from '@/components/align-ui/ui/divider';

const mainItems = [
  {
    icon: RiHomeLine,
    label: 'Home'
  },
  {
    icon: RiCalendarLine,
    label: 'Agendamentos'
  },
  {
    icon: RiTimeLine,
    label: 'Disponibilidade'
  },
  {
    icon: RiLinksLine,
    label: 'Serviços'
  },
  {
    icon: RiDashboard3Line,
    label: 'Relatórios'
  }
];

const settingsItems = [
  {
    icon: RiSettings2Line,
    label: 'Configurações'
  },
  {
    icon: RiHeadphoneLine,
    label: 'Suporte'
  }
];

const Sidebar = ({children}: PropsWithChildren) => {
  return (
    <div className="flex">
      <div className="w-68 h-screen bg-bg-white-0 border-r border-stroke-soft-200 inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="w-68 p-3 relative bg-bg-white-0 inline-flex justify-center items-center gap-3 overflow-hidden">
          <div className="w-60 p-3 bg-bg-white-0 rounded-[10px] flex justify-between items-center overflow-hidden">
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
                    {mainItems.map(({label, icon}) => (
                      <TabMenuVertical.Trigger key={label} value={label}>
                        <TabMenuVertical.Icon as={icon} />
                        {label}
                      </TabMenuVertical.Trigger>
                    ))}
                    <div className="w-full absolute bottom-4 items-end space-y-2">
                      {settingsItems.map(({label, icon: Icon}) => (
                        <TabMenuVertical.Trigger key={label} value={label}>
                          <TabMenuVertical.Icon as={Icon} />
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
        <div className="w-68 p-3 bg-bg-white-0 inline-flex justify-start items-center gap-3 overflow-hidden">
          <div className="w-60 p-3 bg-bg-white-0 rounded-[10px] flex justify-start items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                className="w-10 h-10"
                src="https://placehold.co/40x40"
              />
            </div>
            <div className="flex-1 h-10 inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch inline-flex justify-start items-start gap-0.5">
                <div className="text-label-sm text-text-strong-950 text-sm font-medium font-sans leading-tight">
                  Marcus Dutra
                </div>
                <div className="w-5 h-5 relative overflow-hidden">
                  <div className="w-3 h-3 left-[3.72px] top-[3.72px] absolute bg-state-verified-base" />
                </div>
              </div>
              <div className="self-stretch justify-start text-text-sub-600 text-paragraph-sm font-normal font-sans leading-none">
                marcaum@markado.co
              </div>
            </div>
            <div className="p-0.5 rounded-md flex justify-center items-center gap-0.5 overflow-hidden">
              <div className="w-5 h-5 relative overflow-hidden">
                <div className="w-1.5 h-2.5 left-[7.08px] top-[5.23px] absolute bg-icon-sub-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Sidebar;
