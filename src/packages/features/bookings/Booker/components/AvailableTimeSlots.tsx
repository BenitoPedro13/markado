import {useRef} from 'react';
import {useShallow} from 'zustand/shallow';

import dayjs from '@/lib/dayjs';
import {
  AvailableTimes,
  AvailableTimesSkeleton
} from '@/packages/features/bookings/components/AvailableTimes';
import type {BookerEvent} from '@/packages/features/bookings/types';
import {useNonEmptyScheduleDays} from '@/packages/features/schedules';
import {useSlotsForAvailableDates} from '@/packages/features/schedules/lib/use-schedule/useSlotsForDate';
import {cn as classNames} from '@/utils/cn';
import {BookerLayouts} from '~/prisma/zod-utils';

import {AvailableTimesHeader} from '../../components/AvailableTimesHeader';
import {useBookerStore} from '../store';
import type {useScheduleForEventReturnType} from '../utils/event';

type AvailableTimeSlotsProps = {
  extraDays?: number;
  limitHeight?: boolean;
  schedule?: useScheduleForEventReturnType['data'];
  isLoading: boolean;
  seatsPerTimeSlot?: number | null;
  showAvailableSeatsCount?: boolean | null;
  event: {
    data?: Pick<BookerEvent, 'length'> | null;
  };
  customClassNames?: {
    availableTimeSlotsContainer?: string;
    availableTimeSlotsTitle?: string;
    availableTimeSlotsHeaderContainer?: string;
    availableTimeSlotsTimeFormatToggle?: string;
    availableTimes?: string;
  };
};

/**
 * Renders available time slots for a given date.
 * It will extract the date from the booker store.
 * Next to that you can also pass in the `extraDays` prop, this
 * will also fetch the next `extraDays` days and show multiple days
 * in columns next to each other.
 */
export const AvailableTimeSlots = ({
  extraDays,
  limitHeight,
  seatsPerTimeSlot,
  showAvailableSeatsCount,
  schedule,
  isLoading,
  event,
  customClassNames
}: AvailableTimeSlotsProps) => {
  const [selectedDate, setSelectedTimeslot, setSeatedEventData, layout] = useBookerStore(
    useShallow((state) => [
      state.selectedDate,
      state.setSelectedTimeslot,
      state.setSeatedEventData,
      state.layout
    ])
  );
  const isColumnView = layout === BookerLayouts.COLUMN_VIEW;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onTimeSelect = (
    time: string,
    attendees: number,
    seatsPerTimeSlot?: number | null,
    bookingUid?: string
  ) => {
    setSelectedTimeslot(time);
    if (seatsPerTimeSlot) {
      setSeatedEventData({
        seatsPerTimeSlot,
        attendees,
        bookingUid,
        showAvailableSeatsCount
      });
    }
    return;
  };

  const slots = (schedule && typeof schedule === 'object' && schedule !== null && 'slots' in schedule) ? (schedule as any).slots : undefined;
  
  const nonEmptyScheduleDays = useNonEmptyScheduleDays(slots);
  const nonEmptyScheduleDaysFromSelectedDate = selectedDate ? nonEmptyScheduleDays.filter(
    (slot) => dayjs(selectedDate).diff(slot, 'day') <= 0
  ) : [];

  // Creates an array of dates to fetch slots for.
  // If `extraDays` is passed in, we will extend the array with the next `extraDays` days.
  const dates = !extraDays
    ? (selectedDate ? [selectedDate] : [])
    : nonEmptyScheduleDaysFromSelectedDate.length > 0
      ? nonEmptyScheduleDaysFromSelectedDate.slice(0, extraDays)
      : [];

  const slotsPerDay = useSlotsForAvailableDates(dates, slots);

  const hasSelectedDate = !!selectedDate;

  const mockSlots = hasSelectedDate ? [] : [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45'
  ].map(time => ({
    time: dayjs().format('YYYY-MM-DD') + 'T' + time + ':00.000Z',
    attendees: 0,
    bookingUid: undefined,
    away: false
  }));

  return (
    <>
      <div
        className={classNames(
          `flex`,
          `${customClassNames?.availableTimeSlotsContainer}`,
          '!py-0'
        )}
      >
        {isLoading ? (
          <div className="mb-3 h-8" />
        ) : (
          slotsPerDay.length > 0 &&
          slotsPerDay.map((slots) => (
            <AvailableTimesHeader
              customClassNames={{
                availableTimeSlotsHeaderContainer:
                  customClassNames?.availableTimeSlotsHeaderContainer,
                availableTimeSlotsTitle:
                  customClassNames?.availableTimeSlotsTitle,
                availableTimeSlotsTimeFormatToggle:
                  customClassNames?.availableTimeSlotsTimeFormatToggle
              }}
              key={slots.date}
              date={dayjs(slots.date)}
              showTimeFormatToggle={!isColumnView}
              availableMonth={
                dayjs(selectedDate).format('MM') !==
                dayjs(slots.date).format('MM')
                  ? dayjs(slots.date).format('MMM')
                  : undefined
              }
            />
          ))
        )}
      </div>

      <div
        ref={containerRef}
        className={classNames(
          limitHeight && 'scrollbar-none flex-grow overflow-auto md:h-[400px]',
          !limitHeight && 'flex h-full w-full flex-row gap-4 ',
          `${customClassNames?.availableTimeSlotsContainer}`
        )}
      >
        {isLoading && // Shows exact amount of days as skeleton.
          Array.from({length: 1 + (extraDays ?? 0)}).map((_, i) => (
            <AvailableTimesSkeleton key={i} />
          ))}
        {!isLoading && hasSelectedDate &&
          slotsPerDay.length > 0 &&
          slotsPerDay.map((slots) => (
            <div
              key={slots.date}
              className="scrollbar-none h-full w-full overflow-y-auto overflow-x-hidden"
            >
              <AvailableTimes
                className={customClassNames?.availableTimeSlotsContainer}
                customClassNames={customClassNames?.availableTimes}
                showTimeFormatToggle={!isColumnView}
                onTimeSelect={onTimeSelect}
                slots={slots.slots}
                seatsPerTimeSlot={seatsPerTimeSlot}
                showAvailableSeatsCount={showAvailableSeatsCount}
                event={event}
                selectedSlots={[]}
              />
            </div>
          ))}
        {!isLoading && !hasSelectedDate && (
          <div className="scrollbar-none h-full w-full overflow-y-auto overflow-x-hidden">
            <AvailableTimes
              className={customClassNames?.availableTimeSlotsContainer}
              customClassNames={customClassNames?.availableTimes}
              showTimeFormatToggle={!isColumnView}
              onTimeSelect={() => {}} // Função vazia para slots desabilitados
              slots={mockSlots}
              seatsPerTimeSlot={seatsPerTimeSlot}
              showAvailableSeatsCount={showAvailableSeatsCount}
              event={event}
              selectedSlots={[]}
              disabled={true}
            />
          </div>
        )}
      </div>
    </>
  );
};
