import { SignUpProvider } from '@/contexts/SignUpContext';
import { PropsWithChildren } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';
import { headers } from 'next/headers';

export default async function SignUpLayout({children}: PropsWithChildren ) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if we're on the main sign-up page or email page
  const isEmailPage = pathname.includes('/sign-up/email');
  const isRootSignUpPage = pathname === '/sign-up';
  
  // Check if we're in the onboarding flow
  const isOnboardingFlow = pathname.includes('/sign-up/personal') || 
                          pathname.includes('/sign-up/calendar') || 
                          pathname.includes('/sign-up/availability') || 
                          pathname.includes('/sign-up/profile') || 
                          pathname.includes('/sign-up/summary') || 
                          pathname.includes('/sign-up/ending');

  // Allow unauthenticated users to access the main sign-up or email page
  if ((isEmailPage || isRootSignUpPage) && !session?.user?.id) {
    return <SignUpProvider initialUser={null}>{children}</SignUpProvider>;
  }

  // Redirect to sign-in if not authenticated and not on allowed pages
  if (!session?.user?.id) {
    return redirect('/sign-in');
  }

  // User is authenticated, get their data
  const me = await getMeByUserId(session.user.id);

  // If user has completed onboarding and is not in the onboarding flow, redirect to services
  if (me?.completedOnboarding && !isOnboardingFlow) {
    return redirect('/services');
  }

  return <SignUpProvider initialUser={me}>{children}</SignUpProvider>;
}