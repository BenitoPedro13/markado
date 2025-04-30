import {useTranslations} from 'next-intl';
import PageLayout from '@/components/PageLayout';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

type Props = {
  params: {
    slug: string;
  };
};

export type Me = NonNullable<Awaited<ReturnType<typeof getMeByUserId>>>;

export default async function ServicePage() {
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
      <SettingsLayout me={me} />
    </PageLayout>
  );
}
