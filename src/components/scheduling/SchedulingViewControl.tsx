'use client';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import { RiListUnordered, RiCalendarLine } from '@remixicon/react';
import { useScheduling } from '@/contexts/SchedulingContext';

export default function SchedulingViewControl() {
  const { currentView, setView } = useScheduling();

  return (
    <SegmentedControl.Root 
      value={currentView} 
      onValueChange={(value) => setView(value as 'list' | 'calendar')}
      className='min-w-[70px]'
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list" className="gap-1">
          <RiListUnordered className="size-8" />
          
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="calendar" className="gap-1">
          <RiCalendarLine className="size-8" />
          
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
} 