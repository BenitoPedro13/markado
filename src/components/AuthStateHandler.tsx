'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

/**
 * Component that handles auth state changes globally
 * - Clears localStorage when session changes
 * - Resets onboarding cookie when needed
 */
export default function AuthStateHandler() {
  const { data: session, status } = useSession();

  // Keep track of user ID to detect sign-in/sign-out
  useEffect(() => {
    // Store previous user ID for comparison
    const prevUserId = localStorage.getItem('prev_user_id');
    const currentUserId = session?.user?.id;
    
    // On auth state change (sign in, sign out, or user change)
    if (status === 'authenticated' && currentUserId) {
      // If no previous user or different user
      if (!prevUserId || prevUserId !== currentUserId) {
        console.log('[AuthStateHandler] New sign-in detected, clearing localStorage');
        
        // Save important values before clearing
        const savedItems: Record<string, string> = {};
        const keysToSave = ['NEXT_LOCALE']; // Add any keys you want to preserve
        
        keysToSave.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) savedItems[key] = value;
        });
        
        // Clear localStorage
        localStorage.clear();
        
        // Restore saved items
        Object.entries(savedItems).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        
        // Store new user ID
        localStorage.setItem('prev_user_id', currentUserId);
        
        // Force a check of onboarding status
        const onboardingComplete = Cookies.get('onboarding_complete');
        if (onboardingComplete === 'true') {
          console.log('[AuthStateHandler] Verifying onboarding status with DB');
          // The OnboardingCheck component will handle the status check
        }
      }
    } else if (status === 'unauthenticated') {
      // On sign out
      if (prevUserId) {
        console.log('[AuthStateHandler] Sign-out detected, clearing localStorage');
        
        // Save important values before clearing
        const savedItems: Record<string, string> = {};
        const keysToSave = ['NEXT_LOCALE']; // Add any keys you want to preserve
        
        keysToSave.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) savedItems[key] = value;
        });
        
        // Clear localStorage
        localStorage.clear();
        
        // Restore saved items
        Object.entries(savedItems).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        
        // Remove onboarding cookie on sign out
        Cookies.remove('onboarding_complete', { path: '/' });
      }
    }
  }, [session, status]);

  return null;
} 