'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { services } from '@/data/services';

type SearchFormData = {
  search: string;
};

type Service = {
  title: string;
  slug: string;
  duration: number;
  price: number;
  status: 'active' | 'disabled';
};

type ServicesContextType = {
  filteredServices: Service[];
  register: any;
  updateServiceStatus: (slug: string, status: 'active' | 'disabled') => void;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const { register, watch } = useForm<SearchFormData>({
    defaultValues: {
      search: ''
    }
  });

  const searchValue = watch('search');

  useEffect(() => {
    const filtered = services.filter(service => 
      service.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchValue]);

  const updateServiceStatus = (slug: string, status: 'active' | 'disabled') => {
    setFilteredServices(prevServices => 
      prevServices.map(service => 
        service.slug === slug ? { ...service, status } : service
      )
    );
  };

  return (
    <ServicesContext.Provider value={{ filteredServices, register, updateServiceStatus }}>
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