'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { services as initialServices, ServicesProps } from '@/data/services';

type SearchFormData = {
  search: string;
};

type Service = ServicesProps;

type FilterType = 'all' | 'active' | 'disabled';

type ServicesContextType = {
  filteredServices: Service[];
  register: any;
  updateServiceStatus: (slug: string, status: 'active' | 'disabled') => void;
  deleteService: (slug: string) => void;
  createService: (service: Omit<Service, 'status'>) => void;
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const { register, watch } = useForm<SearchFormData>({
    defaultValues: {
      search: ''
    }
  });

  const searchValue = watch('search');

  useEffect(() => {
    let filtered = services;

    // Aplicar filtro de busca
    if (searchValue) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (currentFilter !== 'all') {
      filtered = filtered.filter(service => service.status === currentFilter);
    }

    setFilteredServices(filtered);
  }, [searchValue, currentFilter, services]);

  const updateServiceStatus = (slug: string, status: 'active' | 'disabled') => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.slug === slug ? { ...service, status } : service
      )
    );
  };

  const deleteService = (slug: string) => {
    setServices(prevServices => 
      prevServices.filter(service => service.slug !== slug)
    );
  };

  const createService = (newService: Omit<Service, 'status'>) => {
    setServices(prevServices => [
      ...prevServices,
      { ...newService, status: 'active' }
    ]);
  };

  const setFilter = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  return (
    <ServicesContext.Provider value={{ 
      filteredServices, 
      register, 
      updateServiceStatus,
      deleteService,
      createService,
      currentFilter,
      setFilter
    }}>
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