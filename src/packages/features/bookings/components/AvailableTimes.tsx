// We do not need to worry about importing framer-motion here as it is lazy imported in Booker.
import * as HoverCard from '@radix-ui/react-hover-card';
// import {AnimatePresence, m} from 'framer-motion';
import {useCallback, useState, useMemo} from 'react';
import {useShallow} from 'zustand/shallow';

// import {useIsPlatform} from '@/atoms/monorepo';
// import type {IOutOfOfficeData} from '@/core/getUserAvailability';
import dayjs from '@/lib/dayjs';
// import {OutOfOfficeInSlots} from '@/packages/features/bookings/Booker/components/OutOfOfficeInSlots';
import type {BookerEvent} from '@/packages/features/bookings/types';
import type {Slots} from '@/packages/features/schedules';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import {localStorage} from '@/packages/lib/webstorage';
import type {IGetAvailableSlots} from '~/trpc/server/handlers/public/util';
import {Text as SkeletonText} from '@/components/align-ui/ui/skeleton';
import {RiCalendar2Line} from '@remixicon/react';

import * as Button from '@/components/align-ui/ui/button';

import {useBookerStore} from '../Booker/store';
import {getQueryParam} from '../Booker/utils/query-param';
import {useTimePreferences} from '../lib';
import {useCheckOverlapWithOverlay} from '@/packages/features/bookings/lib/useCheckOverlapWithOverlay';
import {SeatsAvailabilityText} from './SeatsAvailabilityText';

type TOnTimeSelect = (
  time: string,
  attendees: number,
  seatsPerTimeSlot?: number | null,
  bookingUid?: string
) => void;

type AvailableTimesProps = {
  slots: IGetAvailableSlots['slots'][string];
  onTimeSelect: TOnTimeSelect;
  seatsPerTimeSlot?: number | null;
  showAvailableSeatsCount?: boolean | null;
  showTimeFormatToggle?: boolean;
  className?: string;
  selectedSlots?: string[];
  event: {
    data?: Pick<BookerEvent, 'length'> | null;
  };
  customClassNames?: string;
  disabled?: boolean;
};

const SlotItem = ({
  slot,
  seatsPerTimeSlot,
  selectedSlots,
  onTimeSelect,
  showAvailableSeatsCount,
  event,
  customClassNames,
  disabled
}: {
  slot: Slots[string][number];
  seatsPerTimeSlot?: number | null;
  selectedSlots?: string[];
  onTimeSelect: TOnTimeSelect;
  showAvailableSeatsCount?: boolean | null;
  event: {
    data?: Pick<BookerEvent, 'length'> | null;
  };
  customClassNames?: string;
  disabled?: boolean;
}) => {
  const {t} = useLocale();

  const overlayCalendarToggled = useMemo(() => {
    return (
      getQueryParam('overlayCalendar') === 'true' ||
      (typeof window !== 'undefined' ? localStorage.getItem('overlayCalendarSwitchDefault') : null)
    );
  }, []);
  const [timeFormat, timezone] = useTimePreferences(
    useShallow((state) => [state.timeFormat, state.timezone])
  );
  const [bookingData, layout] = useBookerStore(
    useShallow((state) => [state.bookingData, state.layout])
  );
  const {data: eventData} = event;
  const hasTimeSlots = !!seatsPerTimeSlot;
  
  const computedDateWithUsersTimezone = useMemo(() => 
    dayjs.utc(slot.time).tz(timezone), [slot.time, timezone]
  );

  const bookingFull = useMemo(() => !!(
    hasTimeSlots &&
    slot.attendees &&
    slot.attendees >= seatsPerTimeSlot
  ), [hasTimeSlots, slot.attendees, seatsPerTimeSlot]);
  
  const isHalfFull = useMemo(() =>
    slot.attendees &&
    seatsPerTimeSlot &&
    slot.attendees / seatsPerTimeSlot >= 0.5, [slot.attendees, seatsPerTimeSlot]
  );
  
  const isNearlyFull = useMemo(() =>
    slot.attendees &&
    seatsPerTimeSlot &&
    slot.attendees / seatsPerTimeSlot >= 0.83, [slot.attendees, seatsPerTimeSlot]
  );
  
  const colorClass = useMemo(() => isNearlyFull
    ? 'bg-rose-600'
    : isHalfFull
      ? 'bg-yellow-500'
      : 'bg-emerald-400', [isNearlyFull, isHalfFull]
  );

  const offset = useMemo(() => {
    const nowDate = dayjs();
    const usersTimezoneDate = nowDate.tz(timezone);
    return (usersTimezoneDate.utcOffset() - nowDate.utcOffset()) / 60;
  }, [timezone]);

  const {isOverlapping, overlappingTimeEnd, overlappingTimeStart} =
    useCheckOverlapWithOverlay({
      start: computedDateWithUsersTimezone,
      selectedDuration: eventData?.length ?? 0,
      offset
    });

  const [overlapConfirm, setOverlapConfirm] = useState(false);

  const onButtonClick = useCallback(() => {
    if (!overlayCalendarToggled) {
      onTimeSelect(
        slot.time,
        slot?.attendees || 0,
        seatsPerTimeSlot,
        slot.bookingUid
      );
      return;
    }
    if (isOverlapping && overlapConfirm) {
      setOverlapConfirm(false);
      return;
    }

    if (isOverlapping && !overlapConfirm) {
      setOverlapConfirm(true);
      return;
    }
    if (!overlapConfirm) {
      onTimeSelect(
        slot.time,
        slot?.attendees || 0,
        seatsPerTimeSlot,
        slot.bookingUid
      );
    }
  }, [
    overlayCalendarToggled,
    isOverlapping,
    overlapConfirm,
    onTimeSelect,
    slot.time,
    slot?.attendees,
    slot.bookingUid,
    seatsPerTimeSlot
  ]);

  return (
    // <AnimatePresence>
    <div className="flex gap-2">
      <Button.Root
        key={slot.time}
        variant="neutral"
        mode="stroke"
        disabled={
          bookingFull ||
          !!(slot.bookingUid && slot.bookingUid === bookingData?.uid) ||
          disabled
        }
        //   data-testid="time"
        //   data-disabled={bookingFull}
        //   data-time={slot.time}
        onClick={onButtonClick}
        className={classNames(
          `hover:border-brand-default min-h-9 mb-2 flex h-auto w-full flex-grow flex-col justify-center py-2`,
          selectedSlots &&
            selectedSlots.length > 0 &&
            selectedSlots.includes(slot.time) &&
            'border-brand-default',
          `${customClassNames}`
        )}
        // color="secondary"
      >
        <div className="flex items-center gap-2">
          {!hasTimeSlots && overlayCalendarToggled && (
            <span
              className={classNames(
                'inline-block h-2 w-2 rounded-full',
                isOverlapping ? 'bg-rose-600' : 'bg-emerald-400'
              )}
            />
          )}
          {computedDateWithUsersTimezone.format(timeFormat)}
        </div>
        {bookingFull && <p className="text-sm">{t('booking_full')}</p>}
        {hasTimeSlots && !bookingFull && (
          <p className="flex items-center text-sm">
            <span
              className={classNames(
                colorClass,
                'mr-1 inline-block h-2 w-2 rounded-full'
              )}
              aria-hidden
            />
            <SeatsAvailabilityText
              showExact={!!showAvailableSeatsCount}
              totalSeats={seatsPerTimeSlot}
              bookedSeats={slot.attendees || 0}
            />
          </p>
        )}
      </Button.Root>
      {overlapConfirm && isOverlapping && (
        <HoverCard.Root>
          <HoverCard.Trigger asChild>
            {/* <m.div
                initial={{width: 0}}
                animate={{width: 'auto'}}
                exit={{width: 0}}
              > */}
            <Button.Root
              variant="neutral"
              // StartIcon={
              //   layout === 'column_view' ? 'chevron-right' : undefined
              // }
              onClick={() =>
                onTimeSelect(
                  slot.time,
                  slot?.attendees || 0,
                  seatsPerTimeSlot,
                  slot.bookingUid
                )
              }
            >
              {layout !== 'column_view' && t('confirm')}
            </Button.Root>
            {/* </m.div> */}
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content side="top" align="end" sideOffset={2}>
              <div className="text-emphasis bg-inverted w-[var(--booker-timeslots-width)] rounded-md p-3">
                <div className="flex items-center gap-2">
                  <p>Busy</p>
                </div>
                <p className="text-muted">
                  {overlappingTimeStart} - {overlappingTimeEnd}
                </p>
              </div>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      )}
    </div>
    // </AnimatePresence>
  );
};

export const AvailableTimes = ({
  slots,
  onTimeSelect,
  seatsPerTimeSlot,
  showAvailableSeatsCount,
  showTimeFormatToggle = true,
  className,
  selectedSlots,
  event,
  customClassNames,
  disabled
}: AvailableTimesProps) => {
  const {t} = useLocale();

//   const oooAllDay = slots.every((slot) => slot.away);
//   if (oooAllDay) {
//     return <OOOSlot {...slots[0]} />;
//   }

  // Display ooo in slots once but after or before slots
//   const oooBeforeSlots = slots[0] && slots[0].away;
//   const oooAfterSlots = slots[slots.length - 1] && slots[slots.length - 1].away;

  return (
    <div className={classNames('text-default flex flex-col', className)}>
      <div className="h-full pb-4">
        {!slots.length && (
          <div
            data-testid="no-slots-available"
            className="bg-subtle border-subtle flex h-full flex-col items-center rounded-md border p-6 dark:bg-transparent"
          >
            <RiCalendar2Line className="text-muted mb-2 h-4 w-4" />
            <p
              className={classNames(
                'text-muted',
                showTimeFormatToggle ? '-mt-1 text-lg' : 'text-sm'
              )}
            >
              {t('all_booked_today')}
            </p>
          </div>
        )}
        {/* {oooBeforeSlots && !oooAfterSlots && <OOOSlot {...slots[0]} />} */}
        {slots.map((slot) => {
          if (slot.away) return null;
          return (
            <SlotItem
              customClassNames={customClassNames}
              key={slot.time}
              onTimeSelect={onTimeSelect}
              slot={slot}
              selectedSlots={selectedSlots}
              seatsPerTimeSlot={seatsPerTimeSlot}
              showAvailableSeatsCount={showAvailableSeatsCount}
              event={event}
              disabled={disabled}
            />
          );
        })}
        {/* {oooAfterSlots && !oooBeforeSlots && (
          <OOOSlot {...slots[slots.length - 1]} className="pb-0" />
        )} */}
      </div>
    </div>
  );
};

// interface IOOOSlotProps {
//   fromUser?: IOutOfOfficeData['anyDate']['fromUser'];
//   toUser?: IOutOfOfficeData['anyDate']['toUser'];
//   reason?: string;
//   emoji?: string;
//   time?: string;
//   className?: string;
// }

// const OOOSlot: React.FC<IOOOSlotProps> = (props) => {
//   const isPlatform = useIsPlatform();
//   const {fromUser, toUser, reason, emoji, time, className = ''} = props;

//   if (isPlatform) return <></>;
//   return (
//     <OutOfOfficeInSlots
//       fromUser={fromUser}
//       toUser={toUser}
//       date={dayjs(time).format('YYYY-MM-DD')}
//       reason={reason}
//       emoji={emoji}
//       borderDashed
//       className={className}
//     />
//   );
// };

export const AvailableTimesSkeleton = () => (
  <div className="flex w-[20%] flex-col only:w-full">
    {/* Random number of elements between 1 and 6. */}
    {Array.from({length: Math.floor(Math.random() * 6) + 1}).map((_, i) => (
      <SkeletonText className="mb-4 h-6 w-full" key={i} />
    ))}
  </div>
);
