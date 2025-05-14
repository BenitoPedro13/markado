'use client';

import React from 'react';
// import * as Switch from '@/components/align-ui/ui/switch';
// import * as Input from '@/components/align-ui/ui/input';
// import * as Button from '@/components/align-ui/ui/button';
// import * as Select from '@/components/align-ui/ui/select';
// import {availabilities, DaySchedule} from '@/data/availability';
// import {RiDeleteBinLine, RiAddLine} from '@remixicon/react';
import * as Divider from '@/components/align-ui/ui/divider';

import {AppRouter} from '~/trpc/server';
import {inferRouterOutputs} from '@trpc/server';
import {useRouter} from 'next/navigation';
import {FormProvider, useForm} from 'react-hook-form';
// import {SignUpScheduleFormData} from '@/contexts/SignUpContext';
// import {DEFAULT_SCHEDULE} from '@/lib/availability';
import type {Schedule as ScheduleType, TimeRange} from '@/types/scheadule';
import Schedule from '../schedules/components/Schedule';
// import {useTRPC} from '@/utils/trpc';
// import {useQuery} from '@tanstack/react-query';
// import {useAvailability} from '@/contexts/availability/AvailabilityContext';
import TimezoneSelectWithStyle from '@/components/TimezoneSelectWithStyle';
import { useAvailabilityDetails } from '@/contexts/availability/availabilityDetails/AvailabilityContext';

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
  title
  // availability
}: AvailabilityDetailsProps) {
  const router = useRouter();
  const {
    queries: {availabilityDetails},
    availabilityDetailsForm
  } = useAvailabilityDetails();

  if (!availabilityDetails) {
    router.back();
    return null;
  }

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="text-title-h6">Horários</div>

        <FormProvider {...availabilityDetailsForm}>
          <Schedule
            control={availabilityDetailsForm.control}
            name="schedule"
            weekStart={1}
            timezone={availabilityDetails.timeZone}
          />
        </FormProvider>
      </div>

      <Divider.Root />

      <div className="space-y-4">
        <div className="text-title-h6">Avançado</div>
        <div className="space-y-2">
          <div className="text-sm text-text-sub-600">Fuso Horário</div>
          {/* <Select.Root defaultValue="America/São_Paulo">
            <Select.Trigger className="w-64">
              <Select.Value placeholder="Selecione um fuso horário" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="America/São_Paulo">
                América/São Paulo
              </Select.Item>
            </Select.Content>
          </Select.Root> */}
          <TimezoneSelectWithStyle
            value={availabilityDetailsForm.watch('timeZone')}
            onChange={(value) => {
              availabilityDetailsForm.setValue('timeZone', value);
              // availabilityDetailsForm.trigger();
            }}
            className="max-w-64"
            hint={false}
            autoDetect={!availabilityDetails?.timeZone}
            defaultValue={availabilityDetails?.timeZone || 'America/Sao_Paulo'}
          />
        </div>
      </div>
    </form>
  );
}
