'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import Service from '@/components/services/Service';
import { useServices } from '@/contexts/services/ServicesContext';

export default function ServicesList() {
  const {filteredServices} = useServices();

  return (
    <div className="px-8">
      <div className="rounded-lg w-full border border-stroke-soft-200">
        {filteredServices.map((service, idx) => (
          <div key={service.slug}>
            <Service
              title={service.title}
              slug={service.slug}
              duration={service.length}
              price={Math.trunc(Math.random() * 100)}
              status={service.hidden ? 'disabled' : 'active'}
              badgeColor={'faded'}
            />
            {idx !== filteredServices.length - 1 && <Divider.Root />}
          </div>
        ))}
      </div>
    </div>
  );
}
