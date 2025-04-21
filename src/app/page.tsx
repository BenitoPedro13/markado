import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export default async function IndexPage() {
  // Check if user is already logged in
  const session = await auth();
  
  // If user is not authenticated, redirect to sign-up/email
  if (!session?.user) {
    console.log('[Home] No session, redirecting to sign-up/email');
    return redirect('/sign-up/email');
  }
  
  // Check if user has completed onboarding
  const onboardingComplete = cookies().get('onboarding_complete')?.value === 'true';
  
  console.log(`[Home] User: ${session.user.email}, Onboarding complete: ${onboardingComplete}`);
  
  // If onboarding is not complete, redirect to personal info page
  if (!onboardingComplete) {
    console.log('[Home] Onboarding not complete, redirecting to sign-up/personal');
    return redirect('/sign-up/personal');
  }
  
  // User is authenticated and has completed onboarding, redirect to services
  console.log('[Home] Onboarding complete, redirecting to services');
  return redirect('/services');
}