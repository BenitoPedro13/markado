'use client';

import React from 'react';
import Availability from './Availability';
import { availabilities } from '@/data/availability';

export default function AvailabilityList() {
  return (
    <div className="flex flex-col">
      {availabilities.map((availability) => (
        <Availability
          key={availability.id}
          title={availability.title}
          schedule={availability.schedule}
          timezone={availability.timezone}
          isDefault={availability.isDefault}
        />
      ))}
    </div>
  );
} 