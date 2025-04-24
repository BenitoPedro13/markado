import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/utils/trpc";
import { format, parseISO, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export type UseScheduleWithCacheArgs = {
  scheduleId?: number | null;
  month?: string | null;
  timezone?: string | null;
  selectedDate?: string | null;
  prefetchNextMonth?: boolean;
  duration?: number | null;
  monthCount?: number | null;
  dayCount?: number | null;
};

// Helper function to get start and end times for a month
function useTimesForSchedule({
  month,
  monthCount = 1,
  dayCount,
  prefetchNextMonth,
  selectedDate,
}: {
  month?: string | null;
  monthCount?: number | null;
  dayCount?: number | null;
  prefetchNextMonth?: boolean;
  selectedDate?: string | null;
}) {
  let startDate: Date;
  let endDate: Date;

  if (selectedDate) {
    // If a specific date is selected, use that date
    startDate = parseISO(selectedDate);
    endDate = parseISO(selectedDate);
  } else if (month) {
    // If a month is specified, use the start and end of that month
    startDate = startOfMonth(parseISO(month));
    endDate = endOfMonth(parseISO(month));
    
    // If prefetchNextMonth is true, extend the end date to include the next month
    if (prefetchNextMonth) {
      endDate = endOfMonth(addMonths(startDate, 1));
    }
  } else {
    // Default to current month
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
  }

  // Format dates as ISO strings
  const startTime = format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  return [startTime, endTime];
}

export const useSchedule = ({
  scheduleId,
  month,
  timezone,
  selectedDate,
  prefetchNextMonth,
  duration,
  monthCount,
  dayCount,
}: UseScheduleWithCacheArgs) => {
  const [startTime, endTime] = useTimesForSchedule({
    month,
    monthCount,
    dayCount,
    prefetchNextMonth,
    selectedDate,
  });
  
  const trpc = useTRPC();

  const input = {
    scheduleId: scheduleId ?? 0,
    startTime,
    endTime,
    timeZone: timezone || 'America/Sao_Paulo',
  };

  return useQuery(trpc.slots.getSchedule.queryOptions(input));
};
