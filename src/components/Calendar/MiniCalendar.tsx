import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';

interface MiniCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export function MiniCalendar({ currentDate, onDateSelect, className = '' }: MiniCalendarProps) {
  // Get the start and end of the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the start and end of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days in the calendar view
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Get the previous and next month dates
  const prevMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);
  
  // Get the day names for the header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 ${className}`}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => onDateSelect(prevMonth)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          ←
        </button>
        <div className="text-sm font-medium">
          {format(currentDate, 'MMMM yyyy')}
        </div>
        <button 
          onClick={() => onDateSelect(nextMonth)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          →
        </button>
      </div>
      
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-xs text-center text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                p-1 text-xs rounded
                ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}
                ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isCurrentDay && !isSelected ? 'border border-blue-500' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
} 