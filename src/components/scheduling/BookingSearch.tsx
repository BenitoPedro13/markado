'use client';

import * as Input from '@/components/align-ui/ui/input';
import debounce from '@/utils/debounce';
import {RiSearch2Line} from '@remixicon/react';
import {usePathname, useRouter} from 'next/navigation';

interface BookingSearchProps {
  search?: string;
}

export default function BookingSearch({search = ''}: BookingSearchProps) {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    if (value) {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    const newUrl = `${pathname}?${searchParams.toString()}`;
    router.push(newUrl);
  };

  const debouncedHandleSearch = debounce(handleSearch, 200);

  return (
    <div className="w-full min-w-[250px]">
      <Input.Root>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder="Pesquisar Agendamento..."
            defaultValue={search}
            onChange={(e) => debouncedHandleSearch(e.target.value)}
          />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
