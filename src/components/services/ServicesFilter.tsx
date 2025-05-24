'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import { FilterType, useServices } from '@/contexts/services/ServicesContext';

export default function ServicesFilter() {
  const { currentFilter, setFilter } = useServices();

  return (
    <SegmentedControl.Root 
      value={currentFilter}
      defaultValue={FilterType.ALL}
      onValueChange={(value) => setFilter(value as FilterType)}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value={FilterType.ALL}>
          Todos
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value={FilterType.ACTIVE}>
          Ativos
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value={FilterType.DISABLED}>
          Desativados
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
} 