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
      <div className="px-8">
        <SettingsHeader />
        <div className="">
          <Divider.Root />
        </div>
        <div className="flex w-full py-8 gap-8 justify-center">
          <SettingsSelectorMenu />
          <div className="grow">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
}
