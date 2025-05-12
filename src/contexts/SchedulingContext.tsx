'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

type FilterType = 'todas' | 'confirmadas' | 'canceladas';
type ViewType = 'list' | 'calendar';

type SchedulingContextType = {
  filteredSchedulings: Scheduling[];
  register: any;
  updateSchedulingStatus: (id: string, status: 'confirmed' | 'canceled') => void;
  deleteScheduling: (id: string) => void;
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  schedulings: Scheduling[];
  setSchedulings: React.Dispatch<React.SetStateAction<Scheduling[]>>;
  updateSchedulingType: (id: string, type: 'online' | 'presential', location?: string) => void;
};

const initialSchedulings: Scheduling[] = [
  {
    id: '1',
    title: 'Reunião de 30 min',
    duration: 30,
    startTime: new Date('2024-03-18T09:50:00'),
    endTime: new Date('2024-03-18T10:20:00'),
    organizer: 'João',
    type: 'online',
    participants: ['Você', 'João'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    id: '2',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-18T09:30:00'),
    endTime: new Date('2024-03-18T09:45:00'),
    organizer: 'Marcus Dutra',
    type: 'online',
    participants: ['com Marcus Dutra'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    id: '3',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-14T09:30:00'),
    endTime: new Date('2024-03-14T09:45:00'),
    organizer: 'Lucas',
    type: 'online',
    participants: ['Você', 'Lucas'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    id: '4',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-14T09:50:00'),
    endTime: new Date('2024-03-14T10:05:00'),
    organizer: 'Mário',
    type: 'online',
    participants: ['Você', 'Mário'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    id: '5',
    title: 'Consulta Odontológica',
    duration: 60,
    startTime: new Date('2024-03-15T14:00:00'),
    endTime: new Date('2024-03-15T15:00:00'),
    organizer: 'Dr. Silva',
    type: 'presential',
    participants: ['Dr. Silva'],
    status: 'confirmed',
    location: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ, 20040-007'
  },
  {
    id: '6',
    title: 'Sessão de Fisioterapia',
    duration: 45,
    startTime: new Date('2024-03-18T16:00:00'),
    endTime: new Date('2024-03-18T16:45:00'),
    organizer: 'Dra. Ana',
    type: 'presential',
    participants: ['Dra. Ana'],
    status: 'canceled',
    location: 'Rua do Ouvidor, 60 - Centro, Rio de Janeiro - RJ, 20040-030'
  },
  {
    id: '7',
    title: 'Avaliação Nutricional',
    duration: 30,
    startTime: new Date('2024-03-19T10:00:00'),
    endTime: new Date('2024-03-19T10:30:00'),
    organizer: 'Nutricionista Paula',
    type: 'presential',
    participants: ['Nutricionista Paula'],
    status: 'confirmed',
    location: 'Rua da Quitanda, 86 - Centro, Rio de Janeiro - RJ, 20011-030'
  }
];

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export function SchedulingProvider({ children }: { children: ReactNode }) {
  const [schedulings, setSchedulings] = useState<Scheduling[]>(initialSchedulings);
  const [filteredSchedulings, setFilteredSchedulings] = useState<Scheduling[]>(initialSchedulings);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('todas');
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const { register, watch } = useForm<SearchFormData>({
    defaultValues: {
      search: ''
    }
  });

  const searchValue = watch('search');

  useEffect(() => {
    let filtered = schedulings;

    if (searchValue) {
      filtered = filtered.filter(scheduling => 
        scheduling.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (currentFilter !== 'todas') {
      filtered = filtered.filter(scheduling => 
        scheduling.status === (currentFilter === 'confirmadas' ? 'confirmed' : 'canceled')
      );
    }

    setFilteredSchedulings(filtered);
  }, [searchValue, currentFilter, schedulings]);

  const updateSchedulingStatus = (id: string, status: 'confirmed' | 'canceled') => {
    setSchedulings(prevSchedulings => 
      prevSchedulings.map(scheduling => 
        scheduling.id === id ? { ...scheduling, status } : scheduling
      )
    );
  };

  const deleteScheduling = (id: string) => {
    setSchedulings(prevSchedulings => 
      prevSchedulings.filter(scheduling => scheduling.id !== id)
    );
  };

  const setFilter = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  const setView = (view: ViewType) => {
    setCurrentView(view);
  };

  const updateSchedulingType = (id: string, type: 'online' | 'presential', location?: string) => {
    setSchedulings(prevSchedulings => 
      prevSchedulings.map(scheduling => 
        scheduling.id === id ? { 
          ...scheduling, 
          type,
          location: location || (type === 'online' ? 'Google Meet' : scheduling.location)
        } : scheduling
      )
    );
  };

  return (
    <SchedulingContext.Provider value={{ 
      filteredSchedulings, 
      register, 
      updateSchedulingStatus,
      deleteScheduling,
      currentFilter,
      setFilter,
      currentView,
      setView,
      schedulings,
      setSchedulings,
      updateSchedulingType
    }}>
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
