'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {useTRPC} from '@/utils/trpc';


/**
 * Hook to check if a user is signed in and redirect to sign-up if not
 * @returns {Object} Object containing loading state and session data
 */
export function useRequireAuth() {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: session, isLoading, error } = useQuery(trpc.getSession.queryOptions());

  useEffect(() => {
    // Only redirect if we're sure there's no session (not loading)
    if (!isLoading && !session) {
      router.push('/sign-up');
    }
  }, [isLoading, session, router]);

  return { session, isLoading, error };
}

/**
 * Component wrapper to require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render if authenticated
 * @param {React.ReactNode} props.fallback - Optional fallback to render while loading
 * @returns {React.ReactNode} The children if authenticated, or redirects to sign-up
 */
export function RequireAuth({ 
  children, 
  fallback = <div>Loading...</div> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, session } = useRequireAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  // If not loading and no session, don't render children (redirect will happen in the hook)
  if (!session) {
    return null;
  }

  return <>{children}</>;
} 