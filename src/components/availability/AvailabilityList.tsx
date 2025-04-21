'use client';

import React from 'react';
import Availability from './Availability';
import { availabilities } from '@/data/availability';
import * as Divider from '@/components/align-ui/ui/divider';
export default function AvailabilityList() {
  return (
    
      <div className="rounded-lg w-full border border-stroke-soft-200">
        {availabilities.map((availability) => (
          <div key={availability.id}>
            <Availability
            key={availability.id}
            title={availability.title}
            schedule={availability.schedule}
            timezone={availability.timezone}
            isDefault={availability.isDefault}
          />
            <Divider.Root />
          </div>
        ))}
      </div>
    
  );
} 