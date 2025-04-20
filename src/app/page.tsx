import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export default async function IndexPage() {
  // Check if user is already logged in
  const session = await auth();
  
  // If user is not authenticated, redirect to sign-up/email
  if (!session?.user) {
    return redirect('/sign-up/email');
  }
  
  // Check if user has completed onboarding
  const onboardingComplete = cookies().get('onboarding_complete')?.value === 'true';
  
  // If onboarding is not complete, redirect to personal info page
  if (!onboardingComplete) {
    return redirect('/sign-up/personal');
  }
  
  // User is authenticated and has completed onboarding, redirect to dashboard or home
  return redirect('/services');
}