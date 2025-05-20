'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {trpc} from '~/trpc/client';

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  biography: string | null;
  username: string | null;
  accounts: Array<{
    provider: string;
    providerAccountId: string;
  }>;
  emailMd5?: string;
}

interface SchedulingContextData {
  profileUser: User | null;
  isLoading: boolean;
  error: Error | null;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

interface SchedulingProviderProps {
  children: ReactNode;
  username: string;
}

const SchedulingContext = createContext<SchedulingContextData>(
  {} as SchedulingContextData
);

export function SchedulingProvider({
  children,
  username
}: SchedulingProviderProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await trpc.user.getUserByUsername.query(username);
        setProfileUser(user);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return (
    <SchedulingContext.Provider
      value={{
        profileUser,
        isLoading,
        error,
        selectedDate,
        setSelectedDate
      }}
    >
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling(): SchedulingContextData {
  const context = useContext(SchedulingContext);

  if (!context) {
    throw new Error(
      'useScheduling deve ser usado dentro de um SchedulingProvider'
    );
  }

  return context;
}
