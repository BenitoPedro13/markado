'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import { useServices } from '@/contexts/services/ServicesContext';

export default function ServicesFilter() {
  const { currentFilter, setFilter } = useServices();

  return (
    <SegmentedControl.Root 
      value={currentFilter} 
      onValueChange={(value) => setFilter(value as 'all' | 'active' | 'disabled')}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="all">
          Todos
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="active">
          Ativos
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="disabled">
          Desativados
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
} 