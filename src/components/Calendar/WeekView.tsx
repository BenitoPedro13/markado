import React from 'react';
import { CalendarEvent } from './types';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  isSameDay,
  isToday,
  addHours,
  startOfDay,
  endOfDay
} from 'date-fns';

interface WeekViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export function WeekView({
  events,
  currentDate,
  onEventClick,
  onDateSelect
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = eachHourOfInterval({
    start: startOfDay(weekStart),
    end: endOfDay(weekStart)
  });

  const getEventsForDayAndHour = (day: Date, hour: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return (
        isSameDay(day, eventStart) &&
        eventStart.getHours() === hour.getHours()
      );
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="flex">
        {/* Time column */}
        <div className="w-20 flex-none border-r border-gray-200">
          <div className="h-12 border-b border-gray-200" /> {/* Empty corner */}
          {hours.map(hour => (
            <div
              key={hour.toISOString()}
              className="h-12 border-b border-gray-200 text-sm text-gray-500 text-right pr-2"
            >
              {format(hour, 'ha')}
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 grid grid-cols-7">
          {/* Day headers */}
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`
                h-12 border-b border-r border-gray-200 text-center
                ${isToday(day) ? 'bg-blue-50' : ''}
              `}
            >
              <div className="text-sm font-medium text-gray-500">
                {format(day, 'EEE')}
              </div>
              <div
                className={`
                  text-lg
                  ${isToday(day) ? 'text-blue-600 font-semibold' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}

          {/* Time grid */}
          {hours.map(hour => (
            <React.Fragment key={hour.toISOString()}>
              {days.map(day => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour.toISOString()}`}
                    onClick={() => onDateSelect?.(addHours(day, hour.getHours()))}
                    className="h-12 border-b border-r border-gray-200 relative group"
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className={`
                          absolute inset-x-0 mx-1 rounded px-1 text-sm truncate
                          ${event.color || 'bg-blue-100 text-blue-700'}
                          hover:opacity-75
                        `}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 