'use client';

import React, {useState, useEffect} from 'react';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Input from '@/components/align-ui/ui/input';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import {availabilities, DaySchedule} from '@/data/availability';
import {RiDeleteBinLine, RiAddLine} from '@remixicon/react';
import * as Divider from '@/components/align-ui/ui/divider';

import {AppRouter} from '~/trpc/server';
import {inferRouterOutputs} from '@trpc/server';
import {useRouter} from 'next/navigation';
import {FormProvider, useForm} from 'react-hook-form';
import {SignUpScheduleFormData} from '@/contexts/SignUpContext';
import {DEFAULT_SCHEDULE} from '@/lib/availability';
import type {Schedule as ScheduleType, TimeRange} from '@/types/scheadule';
import Schedule from '../schedules/components/Schedule';
import {useTRPC} from '@/utils/trpc';
import {useQuery} from '@tanstack/react-query';
import { useAvailability } from '@/contexts/AvailabilityContext';

type AvailabilityById =
  inferRouterOutputs<AppRouter>['availability']['findDetailedScheduleById'];

type AvailabilityDetailsProps = {
  title: string;
  // availability: AvailabilityById;
};

export type AvailabilityFormValues = {
  name: string;
  schedule: ScheduleType;
  dateOverrides: {ranges: TimeRange[]}[];
  timeZone: string;
  isDefault: boolean;
};

export default function AvailabilityDetails({
  title,
  // availability
}: AvailabilityDetailsProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const {queries: {availability}, availabilityDetailsForm} = useAvailability();

  if (!availability) {
    router.back();
    return null;
  }



  // const schedule = scheduleData ?? availability;

  // const form = useForm<AvailabilityFormValues>({
  //   defaultValues: {
  //     ...schedule,
  //     schedule: schedule.availability || []
  //   }
  // });

  if (!availability) {
    router.back();
    return null;
  }

  // if (isFetchingPending) return null;

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="text-title-h6">Horários</div>

        <FormProvider {...availabilityDetailsForm}>
          <Schedule control={availabilityDetailsForm.control} name="schedule" weekStart={1} />
        </FormProvider>
      </div>

      <Divider.Root />

      <div className="space-y-4">
        <div className="text-title-h6">Avançado</div>
        <div className="space-y-2">
          <div className="text-sm text-text-sub-600">Fuso Horário</div>
          <Select.Root defaultValue="America/São_Paulo">
            <Select.Trigger className="w-64">
              <Select.Value placeholder="Selecione um fuso horário" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="America/São_Paulo">
                América/São Paulo
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </form>
  );
}
