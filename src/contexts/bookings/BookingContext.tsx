'use client';

import {Booking, bookings as mockBokings} from '@/data/bookings';
import {createContext, ReactNode, useContext, useMemo, useState} from 'react';

type BookingStatusFilter = Booking['status'] | 'all';

interface BookingContextData {
  filteredBookings: Booking[];
  register: (_: any) => {};

  currentView: 'list' | 'calendar';
  setView: (view: 'list' | 'calendar') => void;

  filter: BookingStatusFilter;
  setFilter: (filter: BookingStatusFilter) => void;

  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;

  updateBookingStatus: (id: string, status: string) => void;
  deleteBooking: (id: string) => void;
  updateBookingType: (id: string, type: string, location?: string) => void;
}

interface BookingProviderProps {
  children: ReactNode;
}

const BookingContext = createContext<BookingContextData>(
  {} as BookingContextData
);

export function BookingProvider({children}: BookingProviderProps) {
  const [bookings, setBookings] = useState<Booking[]>(mockBokings);
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<BookingStatusFilter>('all');

  const filteredBookings: Booking[] = useMemo(() => {
    if (filter === 'all') {
      return bookings;
    }
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const register = (name: string) => {
    return [];
  };

  const updateSchedulingStatus = (id: string, status: string) => {
    // Implement the logic to update scheduling status
  };

  const deleteScheduling = (id: string) => {
    // Implement the logic to delete scheduling
  };

  const updateSchedulingType = (
    id: string,
    type: string,
    location?: string
  ) => {
    // Implement the logic to update scheduling type
  };

  return (
    <BookingContext.Provider
      value={{
        filteredBookings,
        register,
        currentView,
        setView: setCurrentView,
        filter,
        setFilter,
        bookings: bookings,
        setBookings: setBookings,
        updateBookingStatus: updateSchedulingStatus,
        deleteBooking: deleteScheduling,
        updateBookingType: updateSchedulingType
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextData {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error('useBoking deve ser usado dentro de um BookingProvider');
  }

  return context;
}
