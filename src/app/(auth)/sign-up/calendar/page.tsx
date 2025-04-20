import CalendarForm from '@/modules/auth/sign-up/calendar/CalendarForm';
import {auth} from '@/auth';

import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {getCalendarsByUserId} from '~/trpc/server/routers/calendar.router';
import {redirect} from 'next/navigation';

const CalendarPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  if (!me) {
    redirect('/sign-in');
  }

  const calendars = await getCalendarsByUserId(session.user.id);

  return (
    <CalendarForm
      calendars={calendars}
      userEmail={me.email}
    />
  );
};

export default CalendarPage;
