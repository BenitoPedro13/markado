import React, { useMemo } from 'react';
import { CalendarEvent } from './types';
import {
  eachHourOfInterval,
  format,
  startOfDay,
  endOfDay,
  addHours,
  isSameDay,
  isWithinInterval,
  differenceInMinutes,
  setHours,
  setMinutes,
  addMinutes,
  isAfter,
  isBefore
} from 'date-fns';
import { DraggableEvent } from './DraggableEvent';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';

interface DayViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export function DayView({
  events,
  currentDate,
  onEventClick,
  onDateSelect,
  onEventUpdate
}: DayViewProps) {
  const hours = eachHourOfInterval({
    start: setHours(startOfDay(currentDate), 0),
    end: setHours(endOfDay(currentDate), 23)
  });

  const allDayEvents = events.filter(event => event.allDay && isSameDay(event.start, currentDate));
  const timedEvents = events.filter(event => !event.allDay && isSameDay(event.start, currentDate));

  // Group overlapping events
  const groupedEvents = useMemo(() => {
    // Sort events by start time
    const sortedEvents = [...timedEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Group overlapping events
    const groups: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [];
    
    sortedEvents.forEach(event => {
      if (currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        const lastEvent = currentGroup[currentGroup.length - 1];
        
        // Check if this event overlaps with any event in the current group
        const overlaps = currentGroup.some(groupEvent => 
          (isAfter(event.start, groupEvent.start) && isBefore(event.start, groupEvent.end)) ||
          (isAfter(event.end, groupEvent.start) && isBefore(event.end, groupEvent.end)) ||
          (isBefore(event.start, groupEvent.start) && isAfter(event.end, groupEvent.end))
        );
        
        if (overlaps) {
          currentGroup.push(event);
        } else {
          groups.push([...currentGroup]);
          currentGroup = [event];
        }
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  }, [timedEvents]);

  // Calculate event position and width
  const calculateEventPosition = (event: CalendarEvent, group: CalendarEvent[]) => {
    const dayStart = startOfDay(currentDate);
    const startMinutes = differenceInMinutes(event.start, dayStart);
    const duration = differenceInMinutes(event.end, event.start);
    const top = (startMinutes / 60) * 48;
    const height = (duration / 60) * 48;
    
    // Calculate width and left position based on group
    const groupIndex = group.indexOf(event);
    const groupSize = group.length;
    const width = `${100 / groupSize}%`;
    const left = `${(groupIndex / groupSize) * 100}%`;
    
    return { top, height, width, left };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const eventId = result.draggableId;
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const sourceMinutes = parseInt(result.source.droppableId);
    const destinationMinutes = parseInt(result.destination.droppableId);
    const minutesDifference = destinationMinutes - sourceMinutes;

    const newStart = addMinutes(event.start, minutesDifference);
    const newEnd = addMinutes(event.end, minutesDifference);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-auto bg-white dark:bg-gray-900">
        {/* All-day events section */}
        {allDayEvents.length > 0 && (
          <div className="border-b border-gray-200/20 dark:border-white/10">
            <div className="flex">
              <div className="w-[60px] flex-none text-[11px] text-gray-500 dark:text-gray-400 py-1 px-2 text-right border-r border-gray-200/20 dark:border-white/10">
                all-day
              </div>
              <Droppable droppableId="all-day" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 min-h-[22px] p-1 bg-gray-50/30 dark:bg-white/[0.02]"
                  >
                    {allDayEvents.map((event, index) => (
                      <DraggableEvent
                        key={event.id}
                        event={event}
                        onClick={onEventClick}
                        className="mb-1"
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        )}

        {/* Timed events grid */}
        <div className="flex flex-1">
          {/* Time column */}
          <div className="w-[60px] flex-none border-r border-gray-200/20 dark:border-white/10">
            {hours.map(hour => (
              <div
                key={hour.toISOString()}
                className="h-[48px] relative group"
              >
                <span className="absolute -top-2 right-2 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                  {format(hour, 'HH:mm')}
                </span>
                {/* Half-hour marker */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-200/20 dark:border-white/5" />
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="flex-1 relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {hours.map(hour => (
                <React.Fragment key={hour.toISOString()}>
                  <div className="h-[48px] border-b border-gray-200/20 dark:border-white/10" />
                  {/* Half-hour marker */}
                  <div className="h-[24px] border-b border-dashed border-gray-200/10 dark:border-white/5" />
                </React.Fragment>
              ))}
            </div>

            {/* Current time indicator */}
            {isSameDay(currentDate, new Date()) && (
              <CurrentTimeIndicator />
            )}

            {/* Click capture layer */}
            <div className="absolute inset-0">
              {hours.map(hour => (
                <div
                  key={hour.toISOString()}
                  className="h-[48px] hover:bg-gray-50/40 dark:hover:bg-white/[0.02] transition-colors"
                  onClick={() => onDateSelect?.(hour)}
                />
              ))}
            </div>

            {/* Events */}
            <Droppable droppableId="timed-events" type="TIMED_EVENT">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="absolute inset-0 pointer-events-none"
                >
                  {groupedEvents.flatMap((group, groupIndex) => 
                    group.map((event, index) => {
                      const { top, height, width, left } = calculateEventPosition(event, group);
                    const minutesSinceMidnight = differenceInMinutes(event.start, startOfDay(event.start));
                    
                    return (
                      <Droppable
                        key={event.id}
                        droppableId={String(minutesSinceMidnight)}
                        type="TIMED_EVENT"
                      >
                        {(dropProvided) => (
                          <div
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                              className="absolute pointer-events-auto"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                                width,
                                left,
                            }}
                          >
                            <DraggableEvent
                              event={event}
                              onClick={onEventClick}
                              className="h-full"
                              index={index}
                            />
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                    })
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
} 