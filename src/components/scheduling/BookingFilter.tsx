'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import {useBooking} from '@/contexts/bookings/BookingContext';

export default function BookingFilter() {
  const {filter, setFilter} = useBooking();

  return (
    <SegmentedControl.Root
      value={filter}
      onValueChange={(value) =>
        setFilter(value as 'all' | 'confirmed' | 'canceled')
      }
    >
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
