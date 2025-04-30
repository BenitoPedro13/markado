'use client';

import { useScheduling } from '@/contexts/SchedulingContext';
import Scheduling from './Scheduling';

export default function SchedulingList() {
  const { filteredSchedulings } = useScheduling();

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {filteredSchedulings.map((scheduling) => (
        <Scheduling
          key={scheduling.id}
          {...scheduling}
        />
      ))}
    </div>
  );
} 