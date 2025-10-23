import React from 'react';
import PageLayout from '@/components/PageLayout';
import * as Divider from '@/components/align-ui/ui/divider';
import SettingsSelectorMenu from '@/components/settings/SettingsSelectorMenu';
import SettingsHeader from '@/components/settings/SettingsHeader';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}
export default async function SettingsLayout({children}: SettingsLayoutProps) {
  return (
    <PageLayout title="Configurações">
      <div className="md:px-8 px-4">
        <SettingsHeader />
        <div className="">
          <Divider.Root />
        </div>
        <div className="flex w-full 1290:py-8 py-4 gap-8 justify-center 1290:flex-row flex-col">
          <SettingsSelectorMenu />
          <div className="grow h-fit">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
}
