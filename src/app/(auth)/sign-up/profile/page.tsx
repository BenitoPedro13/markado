import ProfileForm from '@/modules/auth/sign-up/profile/ProfileForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/sign-in');
  }

  return <ProfileForm user={me} />;
};

export default ProfilePage; 