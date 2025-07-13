import type {TFunction} from 'next-i18next';
import {useEffect, useRef} from 'react';

// import { useIsPlatform } from "@/atoms/monorepo";
// import { useIsEmbed } from "@/embed-core/embed-iframe";
import {useBookerStore} from '@/packages/features/bookings/Booker/store';
import type {BookerEvent} from '@/packages/features/bookings/types';
import {cn as classNames} from '@/utils/cn';
import {useLocaleI18} from '@/hooks/use-locale';
import {
  useShouldShowArrows
} from '@/packages/lib/hooks/useShouldShowArrows';
import {RiArrowLeftSLine, RiArrowRightLine} from '@remixicon/react';

/** Render X mins as X hours or X hours Y mins instead of in minutes once >= 60 minutes */
export const getDurationFormatted = (
  mins: number | undefined,
  t: TFunction
) => {
  if (!mins) return null;

  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  // Formato atual: simples e universal (funciona em português e inglês)
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;

  // TODO: Implementar tradução para outros idiomas
  /*
  let minStr = '';
  if (minutes > 0) {
    minStr =
      minutes === 1
        ? t('minute_one_short', {count: 1})
        : t('multiple_duration_timeUnit_short', {count: minutes, unit: 'minute'});
  }
  
  let hourStr = '';
  if (hours > 0) {
    hourStr =
      hours === 1
        ? t('hour_one_short', {count: 1})
        : t('multiple_duration_timeUnit_short', {count: hours, unit: 'hour'});
  }

  return hourStr && minStr ? `${hourStr} ${minStr}` : hourStr || minStr;
  */
};

export const EventDuration = ({
  event
}: {
  event: Pick<BookerEvent, 'length' | 'metadata' | 'isDynamic'>;
}) => {
  const {t} = useLocaleI18();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // const isPlatform = useIsPlatform();
  const selectedDuration = useBookerStore((state) => state.selectedDuration);
  const setSelectedDuration = useBookerStore((state) => state.setSelectedDuration);
  const state = useBookerStore((state) => state.state);

  const {ref, calculateScroll, leftVisible, rightVisible} =
    useShouldShowArrows();

  const handleLeft = () => {
    if (ref.current) {
      ref.current.scrollLeft -= 100;
    }
  };

  const handleRight = () => {
    if (ref.current) {
      ref.current.scrollLeft += 100;
    }
  };

  const isDynamicEvent = 'isDynamic' in event && event.isDynamic;
  // const isEmbed = useIsEmbed();
  // Sets initial value of selected duration to the default duration.
  useEffect(() => {
    // Only store event duration in url if event has multiple durations.
    if (
      !selectedDuration &&
      (event.metadata?.multipleDuration || isDynamicEvent)
    )
      setSelectedDuration(event.length);
  }, [
    event.metadata?.multipleDuration,
    event.length,
    isDynamicEvent
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // if (isEmbed) return;
      if (selectedDuration && itemRefs.current[selectedDuration]) {
        // eslint-disable-next-line @/eslint/no-scroll-into-view-embed -- Called on !isEmbed case
        itemRefs.current[selectedDuration]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [
    selectedDuration
    // , isEmbed
  ]);

  if (!event?.metadata?.multipleDuration && !isDynamicEvent)
    return <>{getDurationFormatted(event.length, t)}</>;

  const durations = event?.metadata?.multipleDuration || [15, 30, 60, 90];

  return selectedDuration ? (
    <div className="border-default relative mr-5 flex flex-row items-center justify-between rounded-md border">
      {leftVisible && (
        <button onClick={handleLeft} className="absolute bottom-0 left-0 flex">
          <div className="bg-default flex h-9 w-5 items-center justify-end rounded-md">
            {/* <Icon name="chevron-left" className="text-subtle h-4 w-4" /> */}
            <RiArrowLeftSLine className="text-soft-600 h-4 w-4" />
          </div>
          <div className="to-default flex h-9 w-5 bg-gradient-to-l from-transparent" />
        </button>
      )}
      <ul
        className="bg-default no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto rounded-md p-1"
        onScroll={(e) => calculateScroll(e)}
        ref={ref}
      >
        {durations
          .filter((dur) => state !== 'booking' || dur === selectedDuration)
          .map((duration, index) => (
            <li
              // data-testId={`multiple-choice-${duration}mins`}
              data-active={selectedDuration === duration ? 'true' : 'false'}
              key={index}
              onClick={() => setSelectedDuration(duration)}
              ref={(el) => {
                itemRefs.current[duration] = el;
              }}
              className={classNames(
                selectedDuration === duration
                  ? 'bg-emphasis'
                  : 'hover:text-emphasis',
                'text-default cursor-pointer rounded-[4px] px-3 py-1.5 text-sm leading-tight transition'
              )}
            >
              <div className="w-max">{getDurationFormatted(duration, t)}</div>
            </li>
          ))}
      </ul>
      {rightVisible && (
        <button
          onClick={handleRight}
          className="absolute bottom-0 right-0 flex"
        >
          <div className="to-default flex h-9 w-5 bg-gradient-to-r from-transparent" />
          <div className="bg-default flex h-9 w-5 items-center justify-end rounded-md">
            <RiArrowLeftSLine className="text-soft-600 h-4 w-4" />
          </div>
        </button>
      )}
    </div>
  ) : null;
};
