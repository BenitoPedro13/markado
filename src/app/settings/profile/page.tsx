import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import {ZUpdateProfileInputSchema} from '~/trpc/server/schemas/profile.schema';
import {updateProfileSettingsHandler} from '~/trpc/server/handlers/profile.handler';
import ProfileForm from '@/components/settings/profile/ProfileForm';
import {revalidatePath} from 'next/cache';
import {FormActionState} from '@/types/formTypes';

export default async function SettingsProfilePage() {
  const session = await auth();
  const me = await getMeByUserId(session!.user.id);

  if (!me) {
    redirect('/login');
  }

  return <ProfileForm me={me} />;
}
