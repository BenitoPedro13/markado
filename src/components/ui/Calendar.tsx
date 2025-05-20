import { cn } from '@/lib/utils';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { ptBR } from 'date-fns/locale';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn('md:px-5 w-full h-full', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full h-full',
        month: 'capitalize space-y-4 flex-1 w-full',
        caption: 'flex justify-between relative items-center w-full',

        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          'h-6 w-6 bg-transparent p-0 hover:bg-transparent border border-bg-soft-200 rounded-md flex justify-center items-center',
          'text-gray-600 hover:text-gray-900'
        ),
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex w-full',
        head_cell: 'text-gray-500 rounded-md w-full font-medium text-[0.8rem] uppercase text-center',
        row: 'flex w-full mt-2',
        tbody: 'w-full',
        
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent flex-1 flex justify-center items-center',
          'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        ),
        day: cn(
          'h-10 w-10 p-0 font-normal rounded-[10px] transition-colors flex items-center justify-center',
          'hover:bg-gray-100 focus:bg-gray-100'
        ),
        day_range_end: 'day-range-end',
        day_selected: cn(
          'bg-gray-700 text-white hover:bg-gray-600',
          'hover:text-white focus:bg-gray-700 focus:text-white'
        ),
        day_today: 'text-gray-900 font-semibold',
        day_outside: 'text-gray-400 opacity-50',
        day_disabled: 'text-gray-400 opacity-50',
        day_range_middle: 'aria-selected:bg-gray-100',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: ({...props}) => <RiArrowLeftSLine className="h-4 w-4" />,
        IconRight: ({...props}) => <RiArrowRightSLine className="h-4 w-4" />
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

