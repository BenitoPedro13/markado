'use client';

import { useState, useRef } from 'react';
import { CalendarEvent, CalendarProps, CalendarView } from './types';
import { Navigation } from '@/components/Calendar/Navigation';
import { ViewSwitcher } from '@/components/Calendar/ViewSwitcher';
import { MonthView } from '@/components/Calendar/MonthView';
import { WeekView } from '@/components/Calendar/WeekView';
import { DayView } from '@/components/Calendar/DayView';
import { SearchBar } from '@/components/Calendar/SearchBar';
import { format } from 'date-fns';
import { MiniCalendar } from '@/components/Calendar/MiniCalendar';
import { useKeyboardShortcuts } from '@/components/Calendar/hooks/useKeyboardShortcuts';
import { CalendarSharing } from '@/components/Calendar/CalendarSharing';
import { ExternalCalendar } from '@/components/Calendar/ExternalCalendar';

import ThemeSwitch from '@/components/align-ui/theme-switch';
import { 
  Root as ButtonRoot, 
  Icon as ButtonIcon 
} from '@/components/align-ui/ui/button';
import { RiAddLine, RiShareLine, RiDownloadLine } from '@remixicon/react';
import { EventCreationModal } from './EventCreationModal';

export function Calendar({ events: initialEvents, onEventClick, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [isExternalOpen, setIsExternalOpen] = useState(false);

  // Use keyboard shortcuts
  useKeyboardShortcuts({
    currentDate,
    currentView,
    onDateChange: setCurrentDate,
    onViewChange: setCurrentView,
    onNewEvent: () => {
      setSelectedEvent(null);
      setIsCreatingEvent(true);
    },
    onSearch: () => {
      searchInputRef.current?.focus();
    }
  });

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsCreatingEvent(true);
    onEventClick?.(event);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(currentEvents =>
      currentEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleEventCreate = (newEvent: CalendarEvent) => {
    setEvents(currentEvents => [...currentEvents, newEvent]);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(currentEvents =>
      currentEvents.filter(event => event.id !== eventId)
    );
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    const viewProps = {
      events: filteredEvents,
      currentDate,
      onEventClick: handleEventClick,
      onDateSelect,
      onEventUpdate: handleEventUpdate,
    };

    switch (currentView) {
      case 'month':
        return <MonthView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'day':
        return <DayView {...viewProps} />;
    }
  };

  const handleShare = (email: string, permission: string) => {
    // Here you would implement the actual sharing logic
    console.log(`Sharing calendar with ${email} with ${permission} permission`);
  };

  const handleGenerateLink = (permission: string) => {
    // Here you would implement the actual link generation logic
    const link = `https://example.com/calendar/share?permission=${permission}`;
    console.log(`Generated sharing link: ${link}`);
  };

  const handleImport = (file: File) => {
    // Here you would implement the actual import logic
    console.log(`Importing calendar from file: ${file.name}`);
  };

  const handleExport = () => {
    // Here you would implement the actual export logic
    console.log('Exporting calendar');
  };

  const handleSubscribe = (url: string) => {
    // Here you would implement the actual subscription logic
    console.log(`Subscribing to calendar: ${url}`);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Navigation
              currentDate={currentDate}
              onNavigate={handleNavigate}
              view={currentView}
            />
            <h1 className="text-2xl font-semibold">
              {format(currentDate, currentView === 'day' ? 'd MMMM yyyy' : 'MMMM yyyy')}
              <span className="ml-2 text-base font-normal text-gray-500">
                {format(currentDate, 'EEEE')}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gray-100/80 p-0.5">
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            ref={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events..."
            className="max-w-[200px]"
          />
          <ButtonRoot
            variant="neutral"
            onClick={() => {
              setSelectedEvent(null);
              setIsCreatingEvent(true);
            }}
            className="gap-1.5"
          >
            <ButtonIcon>
              <RiAddLine className="size-4" />
            </ButtonIcon>
            New Event
          </ButtonRoot>
          <ButtonRoot
            variant="neutral"
            onClick={() => setIsSharingOpen(true)}
            className="gap-1.5"
          >
            <ButtonIcon>
              <RiShareLine className="size-4" />
            </ButtonIcon>
            Share
          </ButtonRoot>
          <ButtonRoot
            variant="neutral"
            onClick={() => setIsExternalOpen(true)}
            className="gap-1.5"
          >
            <ButtonIcon>
              <RiDownloadLine className="size-4" />
            </ButtonIcon>
            External
          </ButtonRoot>
          <div className="w-px h-5 bg-gray-200/60" />
          <ThemeSwitch />
        </div>
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1">
          {renderView()}
        </div>
        <div className="w-64 p-4 border-l border-gray-200/40">
          <MiniCalendar 
            currentDate={currentDate} 
            onDateSelect={setCurrentDate} 
          />
        </div>
      </div>
      {isCreatingEvent && (
        <EventCreationModal
          onClose={() => {
            setIsCreatingEvent(false);
            setSelectedEvent(null);
          }}
          onSave={(event) => {
            if (selectedEvent) {
              handleEventUpdate(event);
            } else {
              handleEventCreate(event);
            }
            setIsCreatingEvent(false);
            setSelectedEvent(null);
          }}
          onDelete={selectedEvent ? handleEventDelete : undefined}
          initialDate={currentDate}
          event={selectedEvent ?? undefined}
        />
      )}
      <CalendarSharing
        isOpen={isSharingOpen}
        onClose={() => setIsSharingOpen(false)}
        onShare={handleShare}
        onGenerateLink={handleGenerateLink}
      />
      <ExternalCalendar
        isOpen={isExternalOpen}
        onClose={() => setIsExternalOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
} 