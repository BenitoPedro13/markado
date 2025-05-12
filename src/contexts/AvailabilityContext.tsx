'use client';

import {TimeRange} from '@/types/scheadule';
import {zodResolver} from '@hookform/resolvers/zod';
import {inferRouterOutputs} from '@trpc/server';
import {createContext, useContext, useMemo, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import {create} from 'zustand';
import {AppRouter} from '~/trpc/server';

const updateAvailabilityFormSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  schedule: z.array(z.array(z.custom<TimeRange>())).optional(),
  timeZone: z.string().optional(),
  isDefault: z.boolean()
});

export type UpdateAvailabilityFormData = z.infer<
  typeof updateAvailabilityFormSchema
>;

type AvailabilityById =
  inferRouterOutputs<AppRouter>['availability']['findDetailedScheduleById'];

type AvailabilityContextType = {
  queries: {
    availability: AvailabilityById | null;
    // Add other query states here as needed
    // example: profile: QueryState<Profile>;
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
  const [availability, setAvailability] = useState<AvailabilityById | null>(
    initialAvailability
  );

  // Schedule form for availability scheduling
  const scheduleForm = useForm<UpdateAvailabilityFormData>({
    resolver: zodResolver(updateAvailabilityFormSchema)
  });

  const value = useMemo<AvailabilityContextType>(
    () => ({
      queries: {
        availability: availability
      },
      availabilityDetailsForm: scheduleForm
    }),
    [availability, scheduleForm]
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
    throw new Error('useAvailability must be used within a AvailabilityProvider');
  }
  return context;
}