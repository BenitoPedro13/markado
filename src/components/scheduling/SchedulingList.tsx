'use client';

import { useScheduling } from '@/contexts/SchedulingContext';
import Scheduling from './Scheduling';
import * as Divider from '@/components/align-ui/ui/divider';

export default function SchedulingList() {
  const { filteredSchedulings } = useScheduling();

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {filteredSchedulings.map((scheduling) => (
        <div key={scheduling.id}>
          <Scheduling
            key={scheduling.id}
            {...scheduling}
          />
          <Divider.Root />  
        </div>
      ))}
      
    </div>
  );
} 