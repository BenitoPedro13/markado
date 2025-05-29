'use client';

import {DEFAULT_SCHEDULE} from '@/lib/availability';
import {TimeRange} from '@/types/scheadule';
import {zodResolver} from '@hookform/resolvers/zod';
import {useQuery} from '@tanstack/react-query';
import {inferRouterOutputs} from '@trpc/server';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState
} from 'react';
import {FormProvider, useForm, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import {useTRPC} from '@/utils/trpc';
import {AppRouter} from '~/trpc/server';
import useMeQuery from '@/hooks/use-me-query';
import {useSessionStore} from '@/providers/session-store-provider';

import {usePathname} from 'next/navigation';
import {
  groupAvailabilitiesBySchedule,
  TFormatedAvailabilitiesBySchedule
} from '@/utils/formatAvailability';
import { Me } from '~/trpc/server/handlers/user.handler';

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
export type TAvailabilityList =
  inferRouterOutputs<AppRouter>['availability']['getAll'];

export type TAvailabilityListItem = TAvailabilityList[number];

type AvailabilityContextType = {
  state: {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    newName: string;
    setNewName: React.Dispatch<React.SetStateAction<string>>;
  };
  queries: {
    allAvailability: TFormatedAvailabilitiesBySchedule[] | null;
    initialMe: Me | null;
  };
  optimistic: {
    optimisticAvailabilityList: TFormatedAvailabilitiesBySchedule[];
    addOptimisticAvailabilityList: (
      action: TFormatedAvailabilitiesBySchedule
    ) => void;
  };
};

const AvailabilityContext = createContext<AvailabilityContextType | null>(null);

type AvailabilityProviderProps = {
  children: React.ReactNode;
  initialAllAvailability: TAvailabilityList | null;
  initialMe: Me | null;
};

export function AvailabilityProvider({
  children,
  initialAllAvailability,
  initialMe
}: AvailabilityProviderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState<string>('');

  const [optimisticAvailabilityList, addOptimisticAvailabilityList] =
    useOptimistic(
      groupAvailabilitiesBySchedule(initialAllAvailability ?? []),
      (
        state: TFormatedAvailabilitiesBySchedule[] | null,
        newAvailability: TFormatedAvailabilitiesBySchedule
      ) => {
        if (!state) return [] as TFormatedAvailabilitiesBySchedule[];

        return [...state, newAvailability];
      }
    );

  const value = useMemo<AvailabilityContextType>(() => {
    let formattedSchedules: TFormatedAvailabilitiesBySchedule[] | null = null;

    if (!initialAllAvailability || !initialAllAvailability.length) {
      formattedSchedules = [];
    } else {
      formattedSchedules = groupAvailabilitiesBySchedule(
        initialAllAvailability
      );
    }

    return {
      state: {
        isCreateModalOpen,
        setIsCreateModalOpen,
        newName,
        setNewName
      },
      queries: {
        initialMe,
        allAvailability: formattedSchedules
      },
      optimistic: {
        optimisticAvailabilityList,
        addOptimisticAvailabilityList
      }
    };
  }, [
    isCreateModalOpen,
    setIsCreateModalOpen,
    initialAllAvailability,
    initialMe,
    newName,
    setNewName
  ]);

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
