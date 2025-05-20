'use client';

import {createContext, useContext, ReactNode, useState, useEffect, useMemo} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {services as initialServices, ServicesProps} from '@/data/services';

type SearchFormData = {
  search: string;
};

type Service = ServicesProps;

type FilterType = 'all' | 'active' | 'disabled';

type ServicesContextType = {
  filteredServices: Service[];
  updateServiceStatus: (slug: string, status: 'active' | 'disabled') => void;
  deleteService: (slug: string) => void;
  createService: (service: Omit<Service, 'status'>) => void;
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  setSearch: (search: string) => void;
  searchValue: string;
  state: {
    isCreateServiceModalOpen: boolean;
    setIsCreateServiceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export function ServicesProvider({children}: {children: ReactNode}) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL
  const searchValue = searchParams.get('search') || '';
  const currentFilter = (searchParams.get('filter') as FilterType) || 'all';

  useEffect(() => {
    let filtered = services;
    if (searchValue) {
      filtered = filtered.filter((service) =>
        service.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (currentFilter !== 'all') {
      filtered = filtered.filter((service) => service.status === currentFilter);
    }
    setFilteredServices(filtered);
  }, [searchValue, currentFilter, services]);

  const updateServiceStatus = (slug: string, status: 'active' | 'disabled') => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.slug === slug ? {...service, status} : service
      )
    );
  };

  const deleteService = (slug: string) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.slug !== slug)
    );
  };

  const createService = (newService: Omit<Service, 'status'>) => {
    setServices((prevServices) => [
      ...prevServices,
      {...newService, status: 'active'}
    ]);
  };

  // Update filter in URL
  const setFilter = (filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === 'all') {
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

  const value = useMemo<ServicesContextType & { setSearch: (search: string) => void; searchValue: string }>(() => ({
    filteredServices,
    updateServiceStatus,
    deleteService,
    createService,
    currentFilter,
    setFilter,
    setSearch,
    searchValue,
    state: {
      isCreateServiceModalOpen,
      setIsCreateServiceModalOpen
    }
  }), [filteredServices, updateServiceStatus, deleteService, createService, currentFilter, setFilter, isCreateServiceModalOpen, setSearch, searchValue]);

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
