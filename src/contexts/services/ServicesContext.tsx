'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useOptimistic
} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

import {TInitialServices} from '@/app/services/page';
import { Me } from '~/trpc/server/handlers/user.handler';

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

type ServicesContextType = {
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  setSearch: (search: string) => void;
  searchValue: string;
  state: {
    initialMe: Me | null;
    isCreateServiceModalOpen: boolean;
    setIsCreateServiceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  optimistic: {
    optimisticServicesList: TInitialServices;
    addOptimisticServicesList: (action: TInitialServices[number]) => void;
  };
};

const ServicesContext = createContext<ServicesContextType | null>(null);

export function ServicesProvider({
  children,
  initialServices = [],
  initialMe
}: {
  children: ReactNode;
  initialServices?: TInitialServices;
  initialMe: Me | null;
}) {
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] =
    useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL
  const searchValue = searchParams.get('search') || '';
  const currentFilter =
    (searchParams.get('filter') as FilterType) || FilterType.ALL;

  const [optimisticServicesList, addOptimisticServicesList] = useOptimistic(
    initialServices,
    (state: TInitialServices | [], newServices: TInitialServices[number]) => {
      if (!state) return [] as TInitialServices;

      return [...state, newServices];
    }
  );


  // Update filter in URL
  const setFilter = (filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === FilterType.ALL) {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.replace(`?${params.toString()}`);
  };

  // Update search in URL
  const setSearch = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!search) {
      params.delete('search');
    } else {
      params.set('search', search);
    }
    router.replace(`?${params.toString()}`);
  };

  const value = useMemo<
    ServicesContextType & {
      setSearch: (search: string) => void;
      searchValue: string;
    }
  >(
    () => ({
      // filteredServices,
      // updateServiceStatus,
      currentFilter,
      setFilter,
      setSearch,
      searchValue,
      state: {
        initialMe: initialMe ?? null,
        isCreateServiceModalOpen,
        setIsCreateServiceModalOpen
      },
      optimistic: {
        optimisticServicesList,
        addOptimisticServicesList
      }
    }),
    [
      // filteredServices,
      // updateServiceStatus,
      // deleteService,
      // createService,
      currentFilter,
      setFilter,
      isCreateServiceModalOpen,
      setSearch,
      searchValue
    ]
  );

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
