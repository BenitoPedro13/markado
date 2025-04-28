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
  date: string;
  time: string;
  participants: string[];
  status: 'confirmed' | 'canceled';
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
};

const initialSchedulings: Scheduling[] = [
  {
    id: '1',
    title: 'Reunião de 30 min',
    duration: 30,
    date: 'Segunda-feira, 18 de Nov',
    time: '9:50h até 10:20h',
    participants: ['Você', 'João'],
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Reunião de 15 min',
    duration: 15,
    date: 'Segunda-feira, 18 de Nov',
    time: '9:30h até 9:45h',
    participants: ['com Marcus Dutra'],
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Reunião de 15 min',
    duration: 15,
    date: 'Quinta-feira, 14 de Nov',
    time: '9:30h até 9:45h',
    participants: ['Você', 'Lucas'],
    status: 'confirmed'
  },
  {
    id: '4',
    title: 'Reunião de 15 min',
    duration: 15,
    date: 'Quinta-feira, 14 de Nov',
    time: '9:50h até 10:05h',
    participants: ['Você', 'Mário'],
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Consulta Odontológica',
    duration: 60,
    date: 'Sexta-feira, 15 de Nov',
    time: '14:00h até 15:00h',
    participants: ['Dr. Silva'],
    status: 'confirmed'
  },
  {
    id: '6',
    title: 'Sessão de Fisioterapia',
    duration: 45,
    date: 'Segunda-feira, 18 de Nov',
    time: '16:00h até 16:45h',
    participants: ['Dra. Ana'],
    status: 'canceled'
  },
  {
    id: '7',
    title: 'Avaliação Nutricional',
    duration: 30,
    date: 'Terça-feira, 19 de Nov',
    time: '10:00h até 10:30h',
    participants: ['Nutricionista Paula'],
    status: 'confirmed'
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

  return (
    <SchedulingContext.Provider value={{ 
      filteredSchedulings, 
      register, 
      updateSchedulingStatus,
      deleteScheduling,
      currentFilter,
      setFilter,
      currentView,
      setView
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