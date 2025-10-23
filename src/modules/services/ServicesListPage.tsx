'use client';

import React from 'react';
import * as Divider from '@/components/align-ui/ui/divider';
import ServicesHeader from '@/components/services/ServicesHeader';
import ServicesFilter from '@/components/services/ServicesFilter';
import ServicesSearch from '@/components/services/ServicesSearch';
import ServicesList from '@/components/services/ServicesList';
import ServicesEmpty from '@/components/services/ServicesEmpty';
import { useServices } from '@/contexts/services/ServicesContext';


export default function ServicesListPage() {
  const {
    optimistic: {optimisticServicesList}
  } = useServices();

  // const {t} = useLocale('Availability');

  return (
    <>
      <ServicesHeader />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="gap-8 p-8 ">
        <div className="flex justify-between">
          <ServicesFilter />
          <ServicesSearch />
        </div>
      </div>
      {
        optimisticServicesList.length > 0 ? 
          <ServicesList initialAllServices={optimisticServicesList} /> :
          <ServicesEmpty/>
      }
    </>
  );
}
