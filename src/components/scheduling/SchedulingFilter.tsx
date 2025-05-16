'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import { useScheduling } from '@/contexts/SchedulingContext';

export default function SchedulingFilter() {
  const { currentFilter, setFilter } = useScheduling();

  return (
    <SegmentedControl.Root 
      value={currentFilter} 
      onValueChange={(value) => setFilter(value as 'todas' | 'confirmadas' | 'canceladas')}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="todas">
          Todas
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="confirmadas">
          Confirmadas
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="canceladas">
          Canceladas
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
} 