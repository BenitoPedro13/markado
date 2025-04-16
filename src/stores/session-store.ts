import { getSession } from 'next-auth/react';
import { createStore } from 'zustand/vanilla';
import type { User } from '~/prisma/app/generated/prisma/client';

export type SessionState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type SessionActions = {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  signOut: () => void;
};

export type SessionStore = SessionState & SessionActions;

export const defaultInitState: SessionState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// This function can be used to initialize the store with data from auth.js
export const initSessionStore = async (): Promise<SessionState> => {
  // You would typically get the session from auth.js here
  // Example:
  const session = await getSession();
  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: false,
  };
}

export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setIsLoading: (isLoading) => set({ isLoading }),
    signOut: () => set({ user: null, isAuthenticated: false }),
  }));
}; 