'use client';

import {DEFAULT_SCHEDULE} from '@/lib/availability';
import {TimeRange} from '@/types/scheadule';
import {zodResolver} from '@hookform/resolvers/zod';
import {useQuery} from '@tanstack/react-query';
import {inferRouterOutputs} from '@trpc/server';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {FormProvider, useForm, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import {useTRPC} from '@/utils/trpc';
import {AppRouter} from '~/trpc/server';
import useMeQuery from '@/hooks/use-me-query';
import { useSessionStore } from '@/providers/session-store-provider';
import { Me } from '@/app/settings/page';
import { usePathname } from 'next/navigation';

const updateAvailabilityDetailsFormSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  schedule: z.array(z.array(z.custom<TimeRange>())),
  timeZone: z.string().optional(),
  isDefault: z.boolean()
});

export type UpdateAvailabilityDetailsFormData = z.infer<
  typeof updateAvailabilityDetailsFormSchema
>;

type AvailabilityById =
  inferRouterOutputs<AppRouter>['availability']['findDetailedScheduleById'];

type AvailabilityDetailsContextType = {
  state: {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  };
  queries: {
    availabilityDetails: AvailabilityById | null;
    initialMe: Me | null;
  };
  availabilityDetailsForm: UseFormReturn<UpdateAvailabilityDetailsFormData>;
};

const AvailabilityDetailsContext = createContext<AvailabilityDetailsContextType | null>(null);

type AvailabilityDetailsProviderProps = {
  children: React.ReactNode;
  initialAvailabilityDetails: AvailabilityById | null;
  initialMe: Me | null;
};

export function AvailabilityDetailsProvider({
  children,
  initialAvailabilityDetails,
  initialMe
}: AvailabilityDetailsProviderProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pathname = usePathname();

  // Schedule form for availability scheduling
  const scheduleForm = useForm<UpdateAvailabilityDetailsFormData>({
    resolver: zodResolver(updateAvailabilityDetailsFormSchema),
    defaultValues: {
      id: initialAvailabilityDetails?.id || 0,
      name: initialAvailabilityDetails?.name || '',
      schedule: initialAvailabilityDetails?.availability,
      timeZone: initialAvailabilityDetails?.timeZone || '',
      isDefault:
        initialMe?.defaultScheduleId === initialAvailabilityDetails?.id
    },
  });

  const value = useMemo<AvailabilityDetailsContextType>(
    () => ({
      state: {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isEditing,
        setIsEditing
      },
      queries: {
        initialMe,
        availabilityDetails: initialAvailabilityDetails
      },
      availabilityDetailsForm: scheduleForm
    }),
    [
      pathname,
      scheduleForm,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isEditing,
      setIsEditing,
      initialAvailabilityDetails,
      initialMe
    ]
  );

  return (
    <AvailabilityDetailsContext.Provider value={value}>
      <FormProvider {...value.availabilityDetailsForm}>{children}</FormProvider>
    </AvailabilityDetailsContext.Provider>
  );
}

export function useAvailabilityDetails() {
  const context = useContext(AvailabilityDetailsContext);
  if (!context) {
    throw new Error(
      'useAvailabilityDetails must be used within a AvailabilityDetailsProvider'
    );
  }
  return context;
}
