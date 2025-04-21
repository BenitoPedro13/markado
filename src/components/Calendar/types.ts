export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  isDragging?: boolean;
  allDay?: boolean;
}

export interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export interface NavigationProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  view: CalendarView;
}

export interface ViewSwitcherProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export interface EventDropResult {
  eventId: string;
  start: Date;
  end: Date;
}

export interface DraggableEventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  className?: string;
  index: number;
} 