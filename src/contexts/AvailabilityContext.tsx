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

const updateAvailabilityFormSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  schedule: z.array(z.array(z.custom<TimeRange>())),
  timeZone: z.string().optional(),
  isDefault: z.boolean()
});

export type UpdateAvailabilityFormData = z.infer<
  typeof updateAvailabilityFormSchema
>;

type AvailabilityById =
  inferRouterOutputs<AppRouter>['availability']['findDetailedScheduleById'];
type AvailabilityList = inferRouterOutputs<AppRouter>['availability']['getAll'];

type AvailabilityContextType = {
  state: {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  };
  queries: {
    availabilityDetails: AvailabilityById | null;
    allAvailability: AvailabilityList | null;
    initialMe: Me | null;
  };
  availabilityDetailsForm: UseFormReturn<UpdateAvailabilityFormData>;
};

const AvailabilityContext = createContext<AvailabilityContextType | null>(null);

type AvailabilityProviderProps = {
  children: React.ReactNode;
  initialAvailabilityDetails: AvailabilityById | null;
  initialAllAvailability: AvailabilityList | null;
  initialMe: Me | null;
};

export function AvailabilityProvider({
  children,
  initialAvailabilityDetails,
  initialAllAvailability,
  initialMe
}: AvailabilityProviderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  const {data: availability, isPending: isFetchingPending} = useQuery(
    trpc.availability.findDetailedScheduleById.queryOptions(
      {
        scheduleId: initialAvailabilityDetails?.id || 0,
        timeZone: initialAvailabilityDetails?.timeZone || 'America/Sao_Paulo'
      },
      {
        enabled: !!initialAvailabilityDetails?.id && !initialAvailabilityDetails
      }
    )
  );

  const {data: allAvailability, isPending: isFetchingAllAvailability} =
    useQuery(
      trpc.availability.getAll.queryOptions()
    );

  // Schedule form for availability scheduling
  const scheduleForm = useForm<UpdateAvailabilityFormData>({
    resolver: zodResolver(updateAvailabilityFormSchema),
    defaultValues: {
      id: initialAvailabilityDetails?.id || 0,
      name: initialAvailabilityDetails?.name || '',
      schedule: initialAvailabilityDetails?.availability,
      timeZone: initialAvailabilityDetails?.timeZone || '',
      isDefault:
        initialMe?.defaultScheduleId === initialAvailabilityDetails?.id
    },
  });

  const value = useMemo<AvailabilityContextType>(
    () => ({
      state: {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isEditing,
        setIsEditing,
      },
      queries: {
        initialMe,
        availabilityDetails: availability ?? initialAvailabilityDetails,
        allAvailability: allAvailability ?? initialAllAvailability
      },
      availabilityDetailsForm: scheduleForm
    }),
    [
      availability,
      scheduleForm,
      isCreateModalOpen,
      setIsCreateModalOpen,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isEditing,
      setIsEditing,
      initialAvailabilityDetails,
      initialAllAvailability,
      initialMe
    ]
  );

  return (
    <AvailabilityContext.Provider value={value}>
      <FormProvider {...value.availabilityDetailsForm}>{children}</FormProvider>
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error(
      'useAvailability must be used within a AvailabilityProvider'
    );
  }
  return context;
}
