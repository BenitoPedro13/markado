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
import { EventType } from '@/packages/event-types/getEventTypeBySlug';

const updateServicesDetailsFormSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  schedule: z.array(z.array(z.custom<TimeRange>())),
  timeZone: z.string().optional(),
  isDefault: z.boolean()
});

export type UpdateServicesDetailsFormData = z.infer<
  typeof updateServicesDetailsFormSchema
>;

type ServicesDetailsContextType = {
  state: {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  };
  queries: {
    serviceDetails: EventType['eventType'];
    initialMe: Me | null;
  };
  ServicesDetailsForm: UseFormReturn<UpdateServicesDetailsFormData>;
};

const ServicesDetailsContext = createContext<ServicesDetailsContextType | null>(null);

type ServicesDetailsProviderProps = {
  children: React.ReactNode;
  initialServiceDetails: EventType['eventType'];
  initialMe: Me | null;
};

export function ServicesDetailsProvider({
  children,
  initialServiceDetails,
  initialMe
}: ServicesDetailsProviderProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pathname = usePathname();

  // Schedule form for availability scheduling
  const scheduleForm = useForm<UpdateServicesDetailsFormData>({
    resolver: zodResolver(updateServicesDetailsFormSchema),
    defaultValues: {
      id: initialServiceDetails?.id || 0,
      name: initialServiceDetails?.title || '',
      // schedule: initialServiceDetails?.availability,
      timeZone: initialServiceDetails?.timeZone || '',
      // isHidden: initialServiceDetails?.hidden || false,
      // isDefault: initialMe?.defaultScheduleId === initialServiceDetails?.id
    },
  });

  const value = useMemo<ServicesDetailsContextType>(
    () => ({
      state: {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isEditing,
        setIsEditing
      },
      queries: {
        initialMe,
        serviceDetails: initialServiceDetails
      },
      ServicesDetailsForm: scheduleForm
    }),
    [
      pathname,
      scheduleForm,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isEditing,
      setIsEditing,
      initialServiceDetails,
      initialMe
    ]
  );

  return (
    <ServicesDetailsContext.Provider value={value}>
      <FormProvider {...value.ServicesDetailsForm}>{children}</FormProvider>
    </ServicesDetailsContext.Provider>
  );
}

export function useServicesDetails() {
  const context = useContext(ServicesDetailsContext);
  if (!context) {
    throw new Error(
      'useServicesDetails must be used within a ServicesDetailsProvider'
    );
  }
  return context;
}
