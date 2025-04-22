import ConferencingForm from '@/modules/auth/sign-up/conferencing/ConferencingForm';
import {redirect} from 'next/navigation';
import {auth} from '@/auth';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

export default async function ConferencingPage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/sign-in');
  }

  return <ConferencingForm googleMeetEnabled={me.googleMeetEnabled} />;
} 