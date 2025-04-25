import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

export default async function IndexPage() {
  // Check if user is already logged in
  const session = await auth();

  // If user is not authenticated, redirect to sign-up/email
  if (!session?.user) {
    console.log('[Home] No session, redirecting to sign-up/email');
    return redirect('/sign-up/email');
  }

  // User is authenticated, get their data
  const me = await getMeByUserId(session.user.id);

  if (me?.completedOnboarding) {
    // User is authenticated and has completed onboarding, redirect to services
    console.log('[Home] Onboarding complete, redirecting to services');
    return redirect('/services');
  } else {
    return redirect('/sign-up/personal');
  }
}