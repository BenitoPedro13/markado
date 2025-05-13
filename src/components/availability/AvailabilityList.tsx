'use client';

// import React, { useState } from 'react';
import Availability from '@/components/availability/Availability';
// import { availabilities as initialAvailabilities } from '@/data/availability';
// import * as Divider from '@/components/align-ui/ui/divider';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
// import { useRouter } from 'next/navigation';

import * as Divider from '@/components/align-ui/ui/divider';
import {
  groupAvailabilitiesBySchedule,
  ServerAvailabilityResponse
} from '@/utils/formatAvailability';

import {inferRouterOutputs} from '@trpc/server';
import {AppRouter} from '~/trpc/server';
import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePageContext} from '@/contexts/PageContext';
import {useTRPC} from '@/utils/trpc';
import {useQuery} from '@tanstack/react-query';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface AvailabilityListProps {
  initialAllAvailability: RouterOutput['availability']['getAll'];
}

interface FormattedSchedule {
  scheduleId: number;
  scheduleName: string;
  timeZone: string;
  availability: string;
  isDefault: boolean;
}

export default function AvailabilityList({
  initialAllAvailability
}: AvailabilityListProps) {
  const {isCreateModalOpen, setIsCreateModalOpen} = usePageContext();
  const [availabilities, setAvailabilities] = useState<FormattedSchedule[]>([
    {
      // schedule: 'seg. - sex., 9:00 até 17:00', // valor padrão
      timeZone: 'America/São_Paulo', // valor padrão
      availability: 'new availability',

      scheduleId: Math.trunc(Math.random() * 1000),
      scheduleName: 'Default Scheadule',
      isDefault: true
    }
  ]);
  // const [newName, setNewName] = useState('');
  const router = useRouter();
  const trpc = useTRPC();

  // Get the prefetched data using tRPC query
  const {data: allAvailability, isPending: isFetchingAllAvailability} =
    useQuery(trpc.availability.getAll.queryOptions());

  const handleDuplicate = (id: number) => {
    const availabilityToDuplicate = availabilities.find(
      (a) => a.scheduleId === id
    );
    if (!availabilityToDuplicate) return;

    const newAvailability = {
      ...availabilityToDuplicate,
      scheduleId: (availabilities.length + 1) * Math.random(),
      scheduleName: `${availabilityToDuplicate.scheduleName} (Cópia)`,
      isDefault: false
    };

    setAvailabilities((oldState) => {
      return [...oldState, newAvailability];
    });
  };

  const handleDelete = (id: number) => {
    setAvailabilities(availabilities.filter((a) => a.scheduleId !== id));
  };

  // const handleCreate = () => {
  //   if (!newName.trim()) return;
  //   const newScheadule = {
  //     schedule: 'seg. - sex., 9:00 até 17:00', // valor padrão
  //     timeZone: 'America/São_Paulo', // valor padrão
  //     availability: 'new availability',
  //     scheduleId: (availabilities.length + 1) * Math.random() * 1000,
  //     scheduleName: newName.trim(),
  //     isDefault: false
  //   };
  //   setAvailabilities((oldState) => {
  //     return [...oldState, newScheadule];
  //   });
  //   console.log('newScheadule', newScheadule);

  //   setIsCreateModalOpen(false);
  //   setNewName('');
  //   // router.push(`/availability/${slug}`);
  // };

  // Format and group the server data by schedule
  const formattedSchedules = useMemo(() => {
    if (!initialAllAvailability || !initialAllAvailability.length) {
      return [];
    }

    if (isFetchingAllAvailability || !allAvailability) {
      return groupAvailabilitiesBySchedule(initialAllAvailability);
    }

    return groupAvailabilitiesBySchedule(allAvailability);
  }, [initialAllAvailability, allAvailability, isFetchingAllAvailability]);

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {/* {availabilities.map((data) => (
          <div key={data.scheduleId}>
            <Availability
              id={data.scheduleId}
              key={data.scheduleId}
              title={data.scheduleName}
              schedule={data.availability}
              timezone={data.timeZone}
              isDefault={data.isDefault}
              onDelete={() => handleDelete(data.scheduleId)}
              onDuplicate={() => handleDuplicate(data.scheduleId)}
            />
            {data.scheduleId !==
              availabilities[availabilities.length - 1].scheduleId && (
              <Divider.Root />
            )}
          </div>
        ))} */}

      {formattedSchedules.map((data) => (
        <div key={data.scheduleId}>
          <Availability
            id={data.scheduleId}
            key={data.scheduleId}
            title={data.scheduleName}
            schedule={data.availability}
            timezone={data.timeZone}
            isDefault={data.isDefault}
            onDelete={() => handleDelete(data.scheduleId)}
            onDuplicate={() => handleDuplicate(data.scheduleId)}
          />
          {data !== formattedSchedules[formattedSchedules.length - 1] && (
            <Divider.Root />
          )}
        </div>
      ))}
    </div>
  );
}
