'use client';

import * as Select from '@/components/align-ui/ui/select';
import {RiSortAsc} from '@remixicon/react';
import {useBooking} from '@/contexts/bookings/BookingContext';

type SortOption = {
  value: 'az' | 'za' | 'newest' | 'oldest';
  label: string;
};

const sortOptions: SortOption[] = [
  {value: 'az', label: 'A-Z'},
  {value: 'za', label: 'Z-A'},
  {value: 'newest', label: 'Mais recentes'},
  {value: 'oldest', label: 'Mais antigos'}
];

export function BookingSort() {
  const {bookings, setBookings} = useBooking();

  const handleSort = (value: string) => {
    const sortedSchedulings = [...bookings];

    switch (value) {
      case 'az':
        sortedSchedulings.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sortedSchedulings.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sortedSchedulings.sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        );
        break;
      case 'oldest':
        sortedSchedulings.sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime()
        );
        break;
    }

    setBookings(sortedSchedulings);
  };

  return (
    <Select.Root onValueChange={handleSort} defaultValue="az">
      <Select.Trigger className="w-full max-w-[180px]">
        <Select.TriggerIcon as={RiSortAsc} />
        <Select.Value placeholder="Ordenar por" />
      </Select.Trigger>
      <Select.Content>
        {sortOptions.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
