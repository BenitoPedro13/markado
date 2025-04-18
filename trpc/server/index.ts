import { router } from './trpc';
import { userRouter } from './routers/user.router';
import { profileRouter } from './routers/profile.router';
import { authRouter } from './routers/auth.router';
import { timezoneRouter } from './routers/timezone.router';
import { cityTimezonesRouter } from './routers/cityTimezones.router';

export const appRouter = router({
  user: userRouter,
  profile: profileRouter,
  auth: authRouter,
  timezone: timezoneRouter,
  cityTimezones: cityTimezonesRouter,
});

export type AppRouter = typeof appRouter;
