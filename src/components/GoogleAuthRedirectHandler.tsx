'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTRPC } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';

/**
 * This component detects when we're coming from a Google OAuth redirect
 * and ensures the user is properly directed to the onboarding flow if needed
 */
export default function GoogleAuthRedirectHandler() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const trpc = useTRPC();
  
  // Check if we're coming from a Google auth callback
  const isGoogleCallback = searchParams?.has('callbackUrl') || searchParams?.has('_vercel_jwt') || searchParams?.has('next');
  
  // Query onboarding status directly
  const { data: onboardingData, isLoading } = useQuery(
    trpc.auth.checkOnboardingStatus.queryOptions(undefined, {
      enabled: !!session?.user && status === 'authenticated' && isGoogleCallback,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    })
  );

  useEffect(() => {
    // Only run logic if we're authenticated and coming from a Google callback
    if (status === 'authenticated' && session?.user && isGoogleCallback && !isLoading && onboardingData) {
      console.log('[GoogleAuthHandler] Auth detected, checking onboarding status');
      
      // If onboarding is not complete, redirect to personal info
      if (!onboardingData.isComplete) {
        console.log('[GoogleAuthHandler] Onboarding not complete, redirecting to personal info');
        router.push('/sign-up/personal');
      }
    }
  }, [session, status, isGoogleCallback, onboardingData, isLoading, router]);

  // Invisible component
  return null;
} 