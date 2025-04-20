'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from 'react';
import {StoreApi, useStore} from 'zustand';

import {
  type SessionStore,
  createSessionStore,
  defaultInitState
} from '@/stores/session-store';

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

  // if (storeRef.current === null) {
  //   storeRef.current = createSessionStore();
  // }

  // // Initialize the store with the session from auth.js
  // useEffect(() => {
  //   const initStore = async () => {
  //     const store = storeRef.current;
  //     if (store) {
  //       const initState = await initSessionStore();
  //       store.setState(initState);
  //     }
  //   };

  //   initStore();
  // }, []);

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
