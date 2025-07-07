import {useShallow} from 'zustand/shallow';

import type {Dayjs} from '@/lib/dayjs';
import dayjs from '@/lib/dayjs';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import {nameOfDay} from '@/lib/weekday';
import {BookerLayouts} from '~/prisma/zod-utils';

import {useBookerStore} from '../Booker/store';
// import {TimeFormatToggle} from './TimeFormatToggle';

type AvailableTimesHeaderProps = {
  date: Dayjs;
  showTimeFormatToggle?: boolean;
  availableMonth?: string | undefined;
  customClassNames?: {
    availableTimeSlotsHeaderContainer?: string;
    availableTimeSlotsTitle?: string;
    availableTimeSlotsTimeFormatToggle?: string;
  };
};

export const AvailableTimesHeader = ({
  date,
  showTimeFormatToggle = false,
  availableMonth,
  customClassNames
}: AvailableTimesHeaderProps) => {
  const {locale, t} = useLocale();
  const [layout] = useBookerStore(useShallow((state) => [state.layout]));
  const isColumnView = layout === BookerLayouts.COLUMN_VIEW;
  const isMonthView = layout === BookerLayouts.MONTH_VIEW;
  const isToday = dayjs().isSame(date, 'day');

  return (
    <header
      className={classNames(
        `mb-3 flex w-full flex-row items-center font-medium`,
        customClassNames?.availableTimeSlotsHeaderContainer
      )}
    >
      <span
        className={classNames(
          isColumnView && 'w-full text-center',
          isColumnView
            ? 'text-subtle text-base uppercase'
            : 'text-default font-medium'
        )}
      >
        <span
          className={classNames(
            isToday &&
              !customClassNames?.availableTimeSlotsTitle &&
              '!text-default',
            customClassNames?.availableTimeSlotsTitle,
            'capitalize'
          )}
        >
          {nameOfDay(locale, Number(date.format('d')), 'short')}
        </span>
        <span
          className={classNames(
            isColumnView && isToday && 'bg-brand-default',
            'inline-flex items-center justify-center rounded-3xl px-1 pt-0.5 font-medium',
            isMonthView
              ? `text-default text-sm ${customClassNames?.availableTimeSlotsTitle}`
              : `text-xs ${customClassNames?.availableTimeSlotsTitle}`
          )}
        >
          {date.format('DD')}
          {availableMonth && `, ${availableMonth}`}
        </span>
      </span>

      {/* {showTimeFormatToggle && (
        <div className="ml-auto rtl:mr-auto">
          <TimeFormatToggle
            customClassName={
              customClassNames?.availableTimeSlotsTimeFormatToggle
            }
          />
        </div>
      )} */}
    </header>
  );
};
