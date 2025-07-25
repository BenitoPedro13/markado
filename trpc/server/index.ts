import { router } from './trpc';
import { userRouter } from './routers/user.router';
import { profileRouter } from './routers/profile.router';
import { authRouter } from './routers/auth.router';
import { timezoneRouter } from './routers/timezone.router';
import { cityTimezonesRouter } from './routers/cityTimezones.router';
import { calendarRouter } from './routers/calendar.router';
import { meetRouter } from './routers/meet.router';
import { availabilityRouter } from './routers/availability.router';
import { scheduleRouter } from './routers/scheadule.router';
import { slotsRouter } from './routers/slots.router';
import { publicSlotsRouter } from './routers/public-slots.router';
import { eventRouter } from './routers/event.router';
import { bookingRouter } from './routers/booking.router';

export const appRouter = router({
  user: userRouter,
  profile: profileRouter,
  auth: authRouter,
  timezone: timezoneRouter,
  cityTimezones: cityTimezonesRouter,
  calendar: calendarRouter,
  meet: meetRouter,
  availability: availabilityRouter,
  schedule: scheduleRouter,
  slots: slotsRouter,
  event: eventRouter,
  booking: bookingRouter,
  public: router({
    slots: publicSlotsRouter,
    event: eventRouter,
  }),
});

export type AppRouter = typeof appRouter;
