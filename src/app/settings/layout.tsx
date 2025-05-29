import React from 'react';
import PageLayout from '@/components/PageLayout';
import * as Divider from '@/components/align-ui/ui/divider';
import SettingsSelectorMenu from '@/components/settings/SettingsSelectorMenu';
import SettingsHeader from '@/components/settings/SettingsHeader';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}
export default async function SettingsLayout({children}: SettingsLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/login');
  }

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
