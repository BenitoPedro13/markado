'use client';

import {RiSaveFill} from '@remixicon/react';
import React, {useEffect, useState} from 'react';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import {settingsMenuItems} from './SettingsMenuData';
import {usePathname} from 'next/navigation';

function SettingsHeader() {
  const pathname = usePathname();

  const getCurrentSettingsPage = () => {
    return (
      settingsMenuItems.find((item) => item.route === pathname) ||
      settingsMenuItems[0]
    );
  };

  const [currentPage, setCurrentPage] = useState(getCurrentSettingsPage);

  useEffect(() => {
    setCurrentPage(getCurrentSettingsPage());
  }, [pathname]);

  const Icon = currentPage.iconFill;

  return (
    <div className="w-full py-5 relative inline-flex justify-start items-center gap-3 overflow-hidden">
      <div className="flex-1 flex justify-center items-start gap-3.5">
        <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
          <Icon />
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-start text-text-strong-950 text-lg font-medium font-sans leading-normal">
            {currentPage.label}
          </div>
          <div className="self-stretch justify-start text-text-sub-600 text-sm font-normal font-sans leading-tight">
            {currentPage.description}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-3">
        <div className="settings">
          <FancyButton.Root
            variant="neutral"
            form={'form_' + currentPage.value}
            type="submit"
          >
            <FancyButton.Icon as={RiSaveFill} />
            Salvar
          </FancyButton.Root>
        </div>
      </div>
    </div>
  );
}

export default SettingsHeader;
