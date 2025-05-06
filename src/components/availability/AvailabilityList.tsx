'use client';

import React from 'react';
import Availability from './Availability';
import {availabilities} from '@/data/availability';
import * as Divider from '@/components/align-ui/ui/divider';
import {groupAvailabilitiesBySchedule, ServerAvailabilityResponse} from '@/utils/formatAvailability';

import {inferRouterOutputs} from '@trpc/server';
import {AppRouter} from '~/trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface AvailabilityListProps {
  allAvailability: RouterOutput['availability']['getAll'];
}

export default function AvailabilityList({
  allAvailability
}: AvailabilityListProps) {
  // Format and group the server data by schedule
  const formattedSchedules = React.useMemo(() => {
    if (!allAvailability || !allAvailability.length) return [];
    // Use type assertion to handle type compatibility
    return groupAvailabilitiesBySchedule(allAvailability);
  }, [allAvailability]);

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {/* {availabilities.map((availability) => (
        <div key={availability.id}>
          <Availability
            key={availability.id}
            title={availability.title}
            schedule={availability.schedule}
            timezone={availability.timezone}
            isDefault={availability.isDefault}
          />
          {availability.id !== availabilities[availabilities.length - 1].id && (
            <Divider.Root />
          )}
        </div>
      ))} */}

      {formattedSchedules.map((data) => (
        <div key={data.scheduleId}>
          <Availability
            key={data.scheduleId}
            title={data.scheduleName}
            schedule={data.availability}
            timezone={data.timeZone}
            isDefault={data.isDefault}
          />
          {data !== formattedSchedules[formattedSchedules.length - 1] && (
            <Divider.Root />
          )}
        </div>
      ))}
    </div>
  );
}
