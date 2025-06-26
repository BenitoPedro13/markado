import { useMemo } from 'react';
import dayjs from '@/lib/dayjs';
import type { Dayjs } from '@/lib/dayjs';

interface UseCheckOverlapWithOverlayProps {
  start: Dayjs;
  selectedDuration: number;
  offset: number;
}

export const useCheckOverlapWithOverlay = ({
  start,
  selectedDuration,
  offset
}: UseCheckOverlapWithOverlayProps) => {
  const { isOverlapping, overlappingTimeEnd, overlappingTimeStart } = useMemo(() => {
    // For now, we'll return a simple implementation
    // This would normally check against calendar overlay data
    const endTime = start.add(selectedDuration, 'minutes');
    
    return {
      isOverlapping: false, // Simplified - no overlapping for now
      overlappingTimeStart: start.format('HH:mm'),
      overlappingTimeEnd: endTime.format('HH:mm')
    };
  }, [start, selectedDuration, offset]);

  return {
    isOverlapping,
    overlappingTimeStart,
    overlappingTimeEnd
  };
}; 