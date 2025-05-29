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
import { usePathname } from 'next/navigation';
import { EventType } from '@/packages/event-types/getEventTypeBySlug';
import { ServiceBadgeColor } from '~/prisma/enums';
import { LocationObject } from '@/core/locations';
import { TSchedulesList } from '~/trpc/server/handlers/availability.handler';
import {eventTypeBookingFields, EventTypeMetaDataSchema, EventTypeMetadata} from '~/prisma/zod-utils';
import { Me } from '~/trpc/server/handlers/user.handler';

const updateServicesDetailsFormSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string(),
  badgeColor: z.nativeEnum(ServiceBadgeColor),
  isHidden: z.boolean().optional(),
  duration: z.number().positive().int(),
  price: z.number().nonnegative(),
  locations: z.array(z.custom<LocationObject>()).optional(),
  schedule: z.number().int().gte(0).optional(),
  bookingFields: eventTypeBookingFields,
  seatsPerTimeSlotEnabled: z.boolean(),
  seatsPerTimeSlot: z.number().int().nullable(),
  requiresConfirmation: z.boolean(),
  requiresConfirmationWillBlockSlot: z.boolean(),
  metadata: EventTypeMetaDataSchema,
  lockTimeZoneToggleOnBookingPage: z.boolean(),
  successRedirectUrl: z.string(),
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
    initialMe: Me;
    initialScheduleList: TSchedulesList['schedules'];
  };
  ServicesDetailsForm: UseFormReturn<UpdateServicesDetailsFormData>;
};

const ServicesDetailsContext = createContext<ServicesDetailsContextType | null>(null);

type ServicesDetailsProviderProps = {
  children: React.ReactNode;
  initialServiceDetails: EventType['eventType'];
  initialMe: Me;
  initialScheduleList: TSchedulesList['schedules'];
};

export function ServicesDetailsProvider({
  children,
  initialServiceDetails,
  initialMe,
  initialScheduleList
}: ServicesDetailsProviderProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pathname = usePathname();

  // Service form for service details
  const serviceForm = useForm<UpdateServicesDetailsFormData>({
    resolver: zodResolver(updateServicesDetailsFormSchema),
    defaultValues: {
      id: initialServiceDetails?.id || 0,
      name: initialServiceDetails?.title || '',
      description: initialServiceDetails?.description || '',
      slug: initialServiceDetails?.slug || '',
      badgeColor: initialServiceDetails?.badgeColor || ServiceBadgeColor.faded,
      duration: initialServiceDetails?.length || 15,
      price: initialServiceDetails?.price || 0,
      locations: initialServiceDetails?.locations || [],
      isHidden: initialServiceDetails?.hidden || false,
      schedule: initialServiceDetails?.schedule || 0,
      bookingFields: initialServiceDetails?.bookingFields,
      seatsPerTimeSlotEnabled: !initialServiceDetails?.seatsPerTimeSlot
        ? false
        : true,
      seatsPerTimeSlot: initialServiceDetails?.seatsPerTimeSlot,
      requiresConfirmation:
        initialServiceDetails?.requiresConfirmation || false,
      requiresConfirmationWillBlockSlot:
        initialServiceDetails?.requiresConfirmationWillBlockSlot || false,
      metadata: initialServiceDetails?.metadata || ({} as EventTypeMetadata),
      lockTimeZoneToggleOnBookingPage:
        initialServiceDetails?.lockTimeZoneToggleOnBookingPage || false,
      successRedirectUrl: initialServiceDetails?.successRedirectUrl || ''
    }
  });

  const scheduleId = serviceForm.watch('schedule');

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
        serviceDetails: initialServiceDetails,
        initialScheduleList
      },
      ServicesDetailsForm: serviceForm
    }),
    [
      scheduleId,
      pathname,
      serviceForm,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isEditing,
      setIsEditing,
      initialServiceDetails,
      initialMe,
      initialScheduleList
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
