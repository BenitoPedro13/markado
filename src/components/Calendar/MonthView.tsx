import { CalendarEvent } from './types';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  differenceInDays
} from 'date-fns';
import { DragDropContext, Droppable, DropResult, DroppableProvided } from '@hello-pangea/dnd';
import { DraggableEvent } from './DraggableEvent';

interface MonthViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export function MonthView({
  events,
  currentDate,
  onEventClick,
  onDateSelect,
  onEventUpdate
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(date, new Date(event.start)));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const eventId = result.draggableId;
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const sourceDate = new Date(result.source.droppableId);
    const destinationDate = new Date(result.destination.droppableId);
    const daysDifference = differenceInDays(destinationDate, sourceDate);

    const newStart = addDays(event.start, daysDifference);
    const newEnd = addDays(event.end, daysDifference);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800">
          {weekDays.map(day => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-900 p-2 text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 flex-1">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);

            return (
              <Droppable
                key={day.toISOString()}
                droppableId={day.toISOString()}
                type="event"
              >
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    onClick={() => onDateSelect?.(day)}
                    className={`
                      min-h-[100px] bg-white dark:bg-gray-900 p-2 relative
                      ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer
                    `}
                  >
                    <span
                      className={`
                        inline-flex h-6 w-6 items-center justify-center rounded-full
                        text-sm
                        ${isDayToday
                          ? 'bg-blue-500 text-white'
                          : isCurrentMonth
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-400 dark:text-gray-600'
                        }
                      `}
                    >
                      {format(day, 'd')}
                    </span>

                    <div className="mt-2 space-y-1">
                      {dayEvents.map((event, eventIndex) => (
                        <DraggableEvent
                          key={event.id}
                          event={event}
                          index={eventIndex}
                          onClick={onEventClick}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
} 