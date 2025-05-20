"use client"

import PageLayout from '@/components/PageLayout';
import {useTranslations} from 'next-intl';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import { ServicesProvider } from '@/contexts/services/ServicesContext';
import ServicesList from '@/components/services/ServicesList';
import ServicesSearch from '@/components/services/ServicesSearch';
import ServicesFilter from '@/components/services/ServicesFilter';
import ServicesHeader from '@/components/services/ServicesHeader';

/** Services page of the website. */
export default function ServicesPage() {
  
  return (
    <PageLayout title="Home">
      <ServicesProvider>
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

        <ServicesList />
      </ServicesProvider>
    </PageLayout>
  );
} 