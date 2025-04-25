'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect
} from 'react';
import {StoreApi, useStore} from 'zustand';

import {
  type SessionStore,
  createSessionStore,
  defaultInitState
} from '@/stores/session-store';
import {getSession} from 'next-auth/react';
import {useTRPC} from '@/utils/trpc';
import {useQuery} from '@tanstack/react-query';

export type SessionStoreApi = ReturnType<typeof createSessionStore>;

export const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

export interface SessionStoreProviderProps {
  children: ReactNode;
  initialSession: StoreApi<SessionStore> | null;
}

export const SessionStoreProvider = ({
  children,
  initialSession
}: SessionStoreProviderProps) => {
  // const storeRef = useRef<SessionStoreApi | null>(null);
  // Use the passed store or create a new one

  const storeRef = useRef(
    initialSession || createSessionStore(defaultInitState)
  );

  const trpc = useTRPC();
  const {data: user, isLoading: isUserLoading} = useQuery(trpc.user.me.queryOptions());


  // if (storeRef.current === null) {
  //   storeRef.current = createSessionStore();
  // }

  // Initialize the store with the session from auth.js
  useEffect(() => {
    const initStore = async () => {
      const store = storeRef.current;
      if (store && initialSession?.getState().user === null && !isUserLoading) {
        const session = await getSession();

        console.log('user', user);

        const initState = {
          session: session,
          user: user || null,
          isAuthenticated: !!session,
          isLoading: false
        };

        store.setState(initState);
      }
    };

    initStore();
  }, [isUserLoading]);

  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSessionStore = <T,>(
  selector: (store: SessionStore) => T
): T => {
  const sessionStoreContext = useContext(SessionStoreContext);

  if (!sessionStoreContext) {
    throw new Error(`useSessionStore must be used within SessionStoreProvider`);
  }

  return useStore(sessionStoreContext, selector);
};
