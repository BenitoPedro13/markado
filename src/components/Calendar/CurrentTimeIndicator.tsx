import React, { useEffect, useState } from 'react';
import { differenceInMinutes, startOfDay } from 'date-fns';

interface CurrentTimeIndicatorProps {
  columnStart?: number;
  columnEnd?: number;
}

export function CurrentTimeIndicator({ columnStart = 0, columnEnd = 1 }: CurrentTimeIndicatorProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const dayStart = startOfDay(now);
  const minutesSinceMidnight = differenceInMinutes(now, dayStart);
  const top = (minutesSinceMidnight / 60) * 48; // 48px per hour

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      {/* Circle indicator in time column */}
      <div
        className="absolute left-[54px] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
        style={{ gridColumn: columnStart }}
      />
      
      {/* Line across the day */}
      <div
        className="absolute left-[60px] right-0 border-t-2 border-red-500"
        style={{
          gridColumn: `${columnStart + 1} / ${columnEnd + 1}`,
        }}
      />
    </div>
  );
} 