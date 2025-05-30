import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import ProfileForm from '@/components/settings/profile/ProfileForm';

export default async function SettingsProfilePage() {
  const session = await auth();
  const me = await getMeByUserId(session!.user.id);

  if (!me) {
    redirect('/login');
  }

  return <ProfileForm me={me} />;
}
