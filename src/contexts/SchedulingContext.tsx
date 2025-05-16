'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '~/prisma/app/generated/prisma/client';
import { trpc } from '~/trpc/client';

type SearchFormData = {
  search: string;
};

type Scheduling = {
  id: string;
  title: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  organizer: string;
  type: 'online' | 'presential';
  participants: string[];
  status: 'confirmed' | 'canceled';
  location?: string;
};

interface SchedulingContextData {
  profileUser: User | null;
  isLoading: boolean;
  error: Error | null;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  service: string | null;
  setService: (service: string | null) => void;
}

// type SchedulingContextType = {
//   filteredSchedulings: Scheduling[];
//   register: any;
//   updateSchedulingStatus: (id: string, status: 'confirmed' | 'canceled') => void;
//   deleteScheduling: (id: string) => void;
//   currentFilter: FilterType;
//   setFilter: (filter: FilterType) => void;
//   currentView: ViewType;
//   setView: (view: ViewType) => void;
//   schedulings: Scheduling[];
//   setSchedulings: React.Dispatch<React.SetStateAction<Scheduling[]>>;
//   updateSchedulingType: (id: string, type: 'online' | 'presential', location?: string) => void;
// };

interface SchedulingProviderProps extends React.PropsWithChildren {
  username:string;
}

const SchedulingContext = createContext<SchedulingContextData>(
  {} as SchedulingContextData
);

// const initialSchedulings: Scheduling[] = [
//   {
//     id: '1',
//     title: 'Reunião de 30 min',
//     duration: 30,
//     startTime: new Date('2024-03-18T09:50:00'),
//     endTime: new Date('2024-03-18T10:20:00'),
//     organizer: 'João',
//     type: 'online',
//     participants: ['Você', 'João'],
//     status: 'confirmed',
//     location: 'Google Meet'
//   },
//   {
//     id: '2',
//     title: 'Reunião de 15 min',
//     duration: 15,
//     startTime: new Date('2024-03-18T09:30:00'),
//     endTime: new Date('2024-03-18T09:45:00'),
//     organizer: 'Marcus Dutra',
//     type: 'online',
//     participants: ['com Marcus Dutra'],
//     status: 'confirmed',
//     location: 'Google Meet'
//   },
//   {
//     id: '3',
//     title: 'Reunião de 15 min',
//     duration: 15,
//     startTime: new Date('2024-03-14T09:30:00'),
//     endTime: new Date('2024-03-14T09:45:00'),
//     organizer: 'Lucas',
//     type: 'online',
//     participants: ['Você', 'Lucas'],
//     status: 'confirmed',
//     location: 'Google Meet'
//   },
//   {
//     id: '4',
//     title: 'Reunião de 15 min',
//     duration: 15,
//     startTime: new Date('2024-03-14T09:50:00'),
//     endTime: new Date('2024-03-14T10:05:00'),
//     organizer: 'Mário',
//     type: 'online',
//     participants: ['Você', 'Mário'],
//     status: 'confirmed',
//     location: 'Google Meet'
//   },
//   {
//     id: '5',
//     title: 'Consulta Odontológica',
//     duration: 60,
//     startTime: new Date('2024-03-15T14:00:00'),
//     endTime: new Date('2024-03-15T15:00:00'),
//     organizer: 'Dr. Silva',
//     type: 'presential',
//     participants: ['Dr. Silva'],
//     status: 'confirmed',
//     location: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ, 20040-007'
//   },
//   {
//     id: '6',
//     title: 'Sessão de Fisioterapia',
//     duration: 45,
//     startTime: new Date('2024-03-18T16:00:00'),
//     endTime: new Date('2024-03-18T16:45:00'),
//     organizer: 'Dra. Ana',
//     type: 'presential',
//     participants: ['Dra. Ana'],
//     status: 'canceled',
//     location: 'Rua do Ouvidor, 60 - Centro, Rio de Janeiro - RJ, 20040-030'
//   },
//   {
//     id: '7',
//     title: 'Avaliação Nutricional',
//     duration: 30,
//     startTime: new Date('2024-03-19T10:00:00'),
//     endTime: new Date('2024-03-19T10:30:00'),
//     organizer: 'Nutricionista Paula',
//     type: 'presential',
//     participants: ['Nutricionista Paula'],
//     status: 'confirmed',
//     location: 'Rua da Quitanda, 86 - Centro, Rio de Janeiro - RJ, 20011-030'
//   }
// ];

export function SchedulingProvider({ children, username }: SchedulingProviderProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [service, setService] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await trpc.user.getUserByUsername.query(username);
        setProfileUser(user);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  

  // useEffect(() => {
  //   let filtered = schedulings;

  //   if (searchValue) {
  //     filtered = filtered.filter(scheduling => 
  //       scheduling.title.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   }

  //   if (currentFilter !== 'todas') {
  //     filtered = filtered.filter(scheduling => 
  //       scheduling.status === (currentFilter === 'confirmadas' ? 'confirmed' : 'canceled')
  //     );
  //   }

  //   setFilteredSchedulings(filtered);
  // }, [searchValue, currentFilter, schedulings]);

  // const updateSchedulingStatus = (id: string, status: 'confirmed' | 'canceled') => {
  //   setSchedulings(prevSchedulings => 
  //     prevSchedulings.map(scheduling => 
  //       scheduling.id === id ? { ...scheduling, status } : scheduling
  //     )
  //   );
  // };

  // const deleteScheduling = (id: string) => {
  //   setSchedulings(prevSchedulings => 
  //     prevSchedulings.filter(scheduling => scheduling.id !== id)
  //   );
  // };

  // const setFilter = (filter: FilterType) => {
  //   setCurrentFilter(filter);
  // };

  // const setView = (view: ViewType) => {
  //   setCurrentView(view);
  // };

  // const updateSchedulingType = (id: string, type: 'online' | 'presential', location?: string) => {
  //   setSchedulings(prevSchedulings => 
  //     prevSchedulings.map(scheduling => 
  //       scheduling.id === id ? { 
  //         ...scheduling, 
  //         type,
  //         location: location || (type === 'online' ? 'Google Meet' : scheduling.location)
  //       } : scheduling
  //     )
  //   );
  // };

return (
  <SchedulingContext.Provider
    value={{
      profileUser,
      isLoading,
      error,
      selectedDate,
      setSelectedDate,
      service,
      setService
    }}
  >
    {children}
  </SchedulingContext.Provider>
);
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
}
