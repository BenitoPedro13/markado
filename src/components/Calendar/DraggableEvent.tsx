import React, { CSSProperties } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { DraggableEventProps } from './types';
import { format } from 'date-fns';
import { 
  Root as TooltipRoot, 
  Trigger as TooltipTrigger, 
  Content as TooltipContent 
} from '@/components/align-ui/ui/tooltip';
import { RiDragMoveLine } from '@remixicon/react';

export function DraggableEvent({ event, onClick, className, index }: DraggableEventProps) {
  const isAllDay = event.allDay;
  
  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <TooltipRoot>
          <TooltipTrigger asChild>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style as CSSProperties,
                boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0, 0, 0, 0.1)' : undefined,
              }}
              className={`
                group relative flex flex-col justify-start gap-0.5
                rounded-[3px] px-1.5 py-0.5
                ${isAllDay ? 'min-h-[22px]' : 'min-h-[24px]'}
                ${event.color || 'bg-[#007AFF]/90 hover:bg-[#007AFF] text-white'}
                ${snapshot.isDragging ? 'opacity-70 scale-[1.02] z-50' : ''}
                ${className}
                transition-all duration-100
              `}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(event);
              }}
            >
              <div className="flex items-center gap-1 min-w-0">
                <RiDragMoveLine className="flex-none size-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                <span className="flex-1 truncate text-[13px] font-medium leading-none">
                  {event.title}
                </span>
              </div>
              {!isAllDay && event.end && (
                <span className="text-[11px] opacity-80 leading-none">
                  {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            <div className="space-y-1.5 p-2 max-w-[300px]">
              <div className="font-medium">{event.title}</div>
              {event.description && (
                <div className="text-sm text-muted-foreground">{event.description}</div>
              )}
              <div className="text-xs text-muted-foreground">
                {format(event.start, isAllDay ? 'PPP' : 'PPp')}
                {!isAllDay && event.end && ` – ${format(event.end, 'p')}`}
              </div>
            </div>
          </TooltipContent>
        </TooltipRoot>
      )}
    </Draggable>
  );
} 