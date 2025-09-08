'use client';

import * as Input from '@/components/align-ui/ui/input';
import debounce from '@/utils/debounce';
import {RiSearch2Line} from '@remixicon/react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

interface BookingSearchProps {
  search?: string;
}

export default function BookingSearch({search = ''}: BookingSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const handleSearch = (value: string) => {
    // Start from the latest URL params to preserve existing keys like `view`
    const params = new URLSearchParams(currentParams?.toString() || '');
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    const newUrl = `${pathname}?${params.toString()}`;
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
