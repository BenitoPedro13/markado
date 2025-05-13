'use client';

import { DEFAULT_SCHEDULE } from '@/lib/availability';
import {TimeRange} from '@/types/scheadule';
import {zodResolver} from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {inferRouterOutputs} from '@trpc/server';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import { useTRPC } from '@/utils/trpc';
import {AppRouter} from '~/trpc/server';

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

type AvailabilityContextType = {
  state: {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    newName: string;
    setNewName: React.Dispatch<React.SetStateAction<string>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  };
  queries: {
    availability: AvailabilityById | null;
  };
  availabilityDetailsForm: UseFormReturn<UpdateAvailabilityFormData>;
};

const AvailabilityContext = createContext<AvailabilityContextType | null>(null);

type AvailabilityProviderProps = {
  children: React.ReactNode;
  initialAvailability: AvailabilityById | null;
};

export function AvailabilityProvider({
  children,
  initialAvailability
}: AvailabilityProviderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  const {data: availability, isPending: isFetchingPending} = useQuery(
    trpc.availability.findDetailedScheduleById.queryOptions(
      {
        scheduleId: initialAvailability?.id || 0,
        timeZone: initialAvailability?.timeZone || 'America/Sao_Paulo'
      },
      {
        enabled: !!initialAvailability?.id && !initialAvailability
      }
    )
  );

  // Schedule form for availability scheduling
  const scheduleForm = useForm<UpdateAvailabilityFormData>({
    resolver: zodResolver(updateAvailabilityFormSchema),
    defaultValues: {
      id: initialAvailability?.id || 0,
      name: initialAvailability?.name || '',
      schedule: initialAvailability?.availability,
      timeZone: initialAvailability?.timeZone || '',
      isDefault: initialAvailability?.isLastSchedule || false
    }
  });

  const value = useMemo<AvailabilityContextType>(
    () => ({
      state: {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        newName,
        setNewName,
        isEditing,
        setIsEditing
      },
      queries: {
        availability: initialAvailability ?? (availability ?? null),
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
      newName,
      setNewName,
      isEditing,
      setIsEditing
    ]
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
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
