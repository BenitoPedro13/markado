'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
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
  // filteredServices: TInitialServices;
  // updateServiceStatus: (slug: string, status: 'active' | 'disabled') => void;
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

  // useEffect(() => {
  //   let filtered = services;
  //   if (searchValue) {
  //     filtered = filtered.filter((service) =>
  //       service.title.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   }
  //   if (currentFilter === FilterType.ALL) {
  //     filtered = filtered
  //   } else if (currentFilter === FilterType.DISABLED) {
  //     filtered = filtered.filter(service => service.hidden === true)
  //   } else if (currentFilter === FilterType.ACTIVE) {
  //     filtered = filtered.filter((service) => service.hidden === false);
  //   }
  //   setFilteredServices(filtered);
  // }, [currentFilter, services]);

  // const updateServiceStatus = (slug: string, status: 'active' | 'disabled') => {
  //   setServices((prevServices) =>
  //     prevServices.map((service) =>
  //       service.slug === slug ? {...service, status} : service
  //     )
  //   );
  // };

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
