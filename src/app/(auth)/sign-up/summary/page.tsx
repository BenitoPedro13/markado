import SummaryForm from '@/modules/auth/sign-up/summary/SummaryForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';
import { getCalendarsByUserId } from '~/trpc/server/routers/calendar.router';

const SummaryPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/sign-in');
  }

  const calendars = await getCalendarsByUserId(session.user.id);

  return <SummaryForm user={me} calendars={calendars} />;
};

export default SummaryPage;