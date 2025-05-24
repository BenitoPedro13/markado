'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

interface BookingFilterProps {
  status: string;
}

export default function BookingFilter({status}: BookingFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }

  return (
    <SegmentedControl.Root value={status} onValueChange={handleFilterChange}>
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="all">Todas</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="confirmed">
          Confirmadas
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="canceled">
          Canceladas
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
