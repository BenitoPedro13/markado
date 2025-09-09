'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import {RiListUnordered, RiCalendarLine} from '@remixicon/react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

interface BookingViewControlProps {
  view: 'list' | 'calendar' | undefined;
}

export default function BookingViewControl({
  view = 'list'
}: BookingViewControlProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleChangeView = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <SegmentedControl.Root
      value={view}
      onValueChange={handleChangeView}
      className="min-w-[70px]"
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="calendar" className="gap-1">
          <RiCalendarLine className="size-8" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="list" className="gap-1">
          <RiListUnordered className="size-8" />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
