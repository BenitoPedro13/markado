'use client';

import * as Select from '@/components/align-ui/ui/select';
import { RiSortAsc } from '@remixicon/react';
import { useScheduling } from '@/contexts/SchedulingContext';

type SortOption = {
  value: 'az' | 'za' | 'newest' | 'oldest';
  label: string;
};

const sortOptions: SortOption[] = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
];

export function SchedulingSort() {
  const { schedulings, setSchedulings } = useScheduling();

  const handleSort = (value: string) => {
    const sortedSchedulings = [...schedulings];

    switch (value) {
      case 'az':
        sortedSchedulings.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sortedSchedulings.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sortedSchedulings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        sortedSchedulings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }

    setSchedulings(sortedSchedulings);
  };

  return (
    <Select.Root  onValueChange={handleSort} defaultValue="az">
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