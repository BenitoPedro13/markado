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
  RiTimeLine,
  RiTimeFill
} from '@remixicon/react';
import React, {PropsWithChildren, ReactElement} from 'react';

import * as TabMenuVertical from '@/components/align-ui/ui/tab-menu-vertical';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Divider from '@/components/align-ui/ui/divider';
import SidebarFooter from './SidebarFooter';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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



  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[280px] h-screen bg-bg-white-0 border-r border-stroke-soft-200 inline-flex flex-col justify-start items-start overflow-hidden">
        {/* Sidebar Header */}
        <div className="w-full p-3 relative bg-bg-white-0 inline-flex justify-center items-center gap-3 overflow-hidden">
          <div className="w-full p-3 bg-bg-white-0 rounded-[10px] flex justify-between items-center overflow-hidden">
            <div className="h-10 flex justify-start items-center gap-2.5">
              <Link href="/">
                <svg
                  width="142"
                  height="41"
                  viewBox="0 0 142 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.36465 0.0234375C9.84986 0.0234375 11.2742 0.613438 12.3245 1.66364L16.0635 5.40265C18.2504 7.58958 21.7961 7.58958 23.9831 5.40264L27.7221 1.66364C28.7723 0.613436 30.1966 0.0234375 31.6819 0.0234375H34.4232C37.516 0.0234375 40.0232 2.53064 40.0232 5.62344V10.4099L22.8545 27.6862C21.4622 29.0872 19.1949 29.0846 17.8059 27.6803L15.756 25.6079C14.4564 24.294 12.3493 24.294 11.0496 25.6079L9.88673 26.7836C8.58711 28.0975 8.58711 30.2277 9.88672 31.5416L15.4839 37.2003L15.4856 37.2021L17.974 39.7178C18.0841 39.8291 18.2 39.931 18.3207 40.0234H5.6232C2.5304 40.0234 0.0231934 37.5162 0.0231934 34.4234V5.62344C0.0231934 2.53064 2.5304 0.0234375 5.62319 0.0234375H8.36465ZM22.3337 40.0234H34.4232C37.516 40.0234 40.0232 37.5162 40.0232 34.4234V22.2497L26.2079 36.1515L26.1964 36.1631L22.6804 39.7178C22.5703 39.8291 22.4544 39.931 22.3337 40.0234Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M134.991 16.1602C138.639 16.1602 141.135 18.8482 141.135 22.3282C141.135 25.8322 138.711 28.4722 134.991 28.4722C131.295 28.4722 128.895 25.8322 128.895 22.3282C128.895 18.8482 131.319 16.1602 134.991 16.1602ZM134.991 18.4402C132.735 18.4402 131.367 20.2402 131.367 22.3282C131.367 24.4402 132.735 26.1682 134.991 26.1682C137.271 26.1682 138.639 24.4402 138.639 22.3282C138.639 20.2402 137.151 18.4402 134.991 18.4402Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M121.557 18.4641C119.469 18.4641 117.813 19.8801 117.813 22.3041C117.813 24.6801 119.469 26.1681 121.557 26.1681C123.621 26.1681 125.325 24.6321 125.325 22.3041C125.325 20.0241 123.621 18.4641 121.557 18.4641ZM125.493 11.4561H127.965V28.2321H125.637L125.493 26.3601C124.557 27.8721 122.973 28.4721 121.389 28.4721C117.957 28.4721 115.341 26.2161 115.341 22.3041C115.341 18.2721 117.909 16.1361 121.341 16.1361C122.781 16.1361 124.725 16.8561 125.493 18.2481V11.4561Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M111.915 18.2717L111.987 16.3997H114.387C114.387 20.3357 114.387 24.2957 114.387 28.2317H112.035L111.915 26.3117C111.123 27.8237 109.299 28.5437 107.835 28.5437C104.379 28.5677 101.763 26.3357 101.763 22.3037C101.763 18.3437 104.475 16.1357 107.883 16.1357C109.563 16.1357 111.171 16.9277 111.915 18.2717ZM108.075 18.3917C105.963 18.3917 104.235 19.8797 104.235 22.3037C104.235 24.7517 105.963 26.2397 108.075 26.2397C113.187 26.2397 113.187 18.3917 108.075 18.3917Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M92.5615 11.4561H95.0575V21.2481L99.4495 16.4001H102.45V16.5441L97.3375 21.9681L103.146 28.0641V28.2321H100.122L95.0575 22.7601V28.2321H92.5615V11.4561Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M83.6711 16.3997H85.9751L86.1431 17.9597C87.0071 16.4477 88.3511 16.1357 89.6231 16.1357C90.7751 16.1357 91.8791 16.5437 92.5511 17.1437L91.4231 19.3037C90.8231 18.8237 90.2471 18.5837 89.3351 18.5837C87.6311 18.5837 86.1431 19.6397 86.1431 21.8237V28.2317H83.6711V16.3997Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M79.5255 18.2717L79.5975 16.3997H81.9975C81.9975 20.3357 81.9975 24.2957 81.9975 28.2317H79.6455L79.5255 26.3117C78.7335 27.8237 76.9095 28.5437 75.4455 28.5437C71.9895 28.5677 69.3735 26.3357 69.3735 22.3037C69.3735 18.3437 72.0855 16.1357 75.4935 16.1357C77.1735 16.1357 78.7815 16.9277 79.5255 18.2717ZM75.6855 18.3917C73.5735 18.3917 71.8455 19.8797 71.8455 22.3037C71.8455 24.7517 73.5735 26.2397 75.6855 26.2397C80.7975 26.2397 80.7975 18.3917 75.6855 18.3917Z"
                    fill="var(--bg-strong-950)"
                  />
                  <path
                    d="M60.584 28.2316H58.088V21.7276C58.088 19.9756 57.08 18.5116 55.328 18.5116C53.576 18.5116 52.472 19.9756 52.472 21.7276V28.2316H50V16.3756H52.304L52.472 17.9596C53.144 16.6636 54.536 16.1836 55.784 16.1836C57.296 16.1836 58.832 16.8076 59.504 18.5596C60.464 16.8076 61.952 16.2076 63.56 16.2076C66.824 16.2076 68.576 18.2716 68.576 21.6796V28.2316H66.08V21.6796C66.08 19.9276 65.216 18.5356 63.464 18.5356C61.712 18.5356 60.584 19.9756 60.584 21.7276V28.2316Z"
                    fill="var(--bg-strong-950)"
                  />
                </svg>
              </Link>
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
                    {mainItems.map(({label, iconLine, iconFill, link}) => (
                      <Link href={`/pt/${link}`} key={label}>
                        <TabMenuVertical.Trigger value={label}>
                          <TabMenuVertical.Icon
                            iconLine={iconLine}
                            iconFill={iconFill}
                            className="w-5 h-5"
                          />
                          {label}
                        </TabMenuVertical.Trigger>
                      </Link>
                    ))}
                    <div className="w-full absolute bottom-4 items-end space-y-2">
                      {settingsItems.map(
                        ({label, iconLine, iconFill, link}) => (
                          <Link href={`/pt/${link}`} key={label}>
                            <TabMenuVertical.Trigger value={label}>
                              <TabMenuVertical.Icon
                                iconLine={iconLine}
                                iconFill={iconFill}
                                className="w-5 h-5"
                              />
                              {label}
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

        <SidebarFooter
          variant="pro"
          name="Marcus Dutra"
          email="marcaum@markado.co"
          avatarUrl="https://media.contra.com/image/upload/c_fill,f_avif,h_160,q_auto:good,w_160/rbaw0sc545eixfngewsw"
        />
      </div>
      {/* Main Content */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Sidebar;
