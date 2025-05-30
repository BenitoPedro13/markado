'use client';

import { TInitialServices } from '@/app/services/page';
import * as Divider from '@/components/align-ui/ui/divider';
import Service from '@/components/services/Service';
import {useServices} from '@/contexts/services/ServicesContext';

interface ServicesListProps {
  initialAllServices: TInitialServices;
}

export default function ServicesList({initialAllServices}: ServicesListProps) {
  return (
    <div className="px-8">
      <div className="rounded-lg w-full border border-stroke-soft-200">
        {initialAllServices.map((service, idx) => (
          <div key={service.slug}>
            <Service
              id={service.id}
              title={service.title}
              slug={service.slug}
              duration={service.length}
              price={service.price}
              hidden={service.hidden}
              badgeColor={service.badgeColor}
            />
            {idx !== initialAllServices.length - 1 && <Divider.Root />}
          </div>
        ))}
      </div>
    </div>
  );
}
