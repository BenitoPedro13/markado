import PersonalForm from '@/modules/auth/sign-up/personal/PersonalForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';


const PersonalPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/sign-in');
  }

  return <PersonalForm user={me} />;
};

export default PersonalPage;
