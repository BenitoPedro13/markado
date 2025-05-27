import ServicesDetailsSidebar from '@/components/services/service-details/ServicesDetailsSidebar'
import ServicesDetailsHeader from '@/components/services/ServicesDetailsHeader'
import React from 'react'
import * as Divider from '@/components/align-ui/ui/divider';

function ServiceDetailsPage({slug}: {slug: string}) {
  return (
    <>
      <ServicesDetailsHeader />
      <div className="px-8">
        <Divider.Root />
      </div>
      <ServicesDetailsSidebar slug={slug} />
    </>
  );
}

export default ServiceDetailsPage;