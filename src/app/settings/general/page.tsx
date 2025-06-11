import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import {ZUpdateSettingsGeneralSchema} from '~/trpc/server/schemas/settings.schema';
import {updateGeneralSettingsHandler} from '~/trpc/server/handlers/settings.handler';
import {revalidatePath} from 'next/cache';
import {FormActionState} from '@/types/formTypes';
import General from '@/components/settings/general/General';

export default async function SettingsBusinessPage() {
  const session = await auth();
  const user = await getMeByUserId(session!.user.id);

  if (!user) {
    redirect('/login');
  }

  return <General me={user} />;
}
