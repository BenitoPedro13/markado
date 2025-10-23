'use client';

import * as Select from '@/components/align-ui/ui/select';
import {RiSortAsc} from '@remixicon/react';
import {useRouter, useSearchParams} from 'next/navigation';

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

interface BookingSortProps {
  sort: SortOption['value'] | undefined;
}

export function BookingSort({sort = 'az'}: BookingSortProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('sort', value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <Select.Root onValueChange={handleSort} defaultValue="az" value={sort}>
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
