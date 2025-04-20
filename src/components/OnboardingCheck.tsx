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
  const { data: onboardingData } = useQuery(
    trpc.auth.checkOnboardingStatus.queryOptions(undefined, {
      enabled: !!session?.user,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      retryDelay: 1000,
    })
  );
  
  useEffect(() => {
    // When data is received and onboarding is complete, set the cookie
    if (onboardingData?.isComplete) {
      Cookies.set('onboarding_complete', 'true', { expires: 7 });
    }
  }, [onboardingData]);
  
  // This is an invisible component that just performs the check
  return null;
} 