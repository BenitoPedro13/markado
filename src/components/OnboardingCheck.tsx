'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useTRPC } from '@/utils/trpc';

export default function OnboardingCheck() {
  const { data: session } = useSession();
  const trpc = useTRPC();
  
  // Use the tanstack query with queryOptions pattern used elsewhere in the codebase
  const { data: onboardingData, isLoading, error } = useQuery(
    trpc.auth.checkOnboardingStatus.queryOptions(undefined, {
      enabled: !!session?.user,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 2,
      retryDelay: 1000,
    })
  );
  
  useEffect(() => {
    if (session?.user) {
      console.log(`[OnboardingCheck] Session detected for: ${session.user.email}`);
      
      // Get the current cookie value
      const currentCookieValue = Cookies.get('onboarding_complete') === 'true';
      
      // If we have data from the database
      if (onboardingData && !isLoading) {
        console.log(`[OnboardingCheck] DB onboarding status: ${onboardingData.isComplete}, Cookie status: ${currentCookieValue}`);
        
        // If there's a mismatch between cookie and database
        if (currentCookieValue !== onboardingData.isComplete) {
          console.log(`[OnboardingCheck] Mismatch detected! Updating cookie to match DB: ${onboardingData.isComplete}`);
          
          if (onboardingData.isComplete) {
            // Set cookie if onboarding is complete in DB
            Cookies.set('onboarding_complete', 'true', { expires: 7 });
          } else {
            // Remove cookie if onboarding is not complete in DB
            Cookies.remove('onboarding_complete', { path: '/' });
          }
        }
      }
    }
    
    if (isLoading) {
      console.log('[OnboardingCheck] Loading onboarding status...');
    }
    
    if (error) {
      console.error('[OnboardingCheck] Error fetching onboarding status:', error);
      // On error, clear the cookie to be safe
      Cookies.remove('onboarding_complete', { path: '/' });
    }
  }, [onboardingData, session, isLoading, error]);
  
  // This is an invisible component that just performs the check
  return null;
} 