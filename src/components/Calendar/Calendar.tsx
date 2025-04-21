'use client';

import {useState, useRef, useEffect} from 'react';
import {CalendarEvent, CalendarProps, CalendarView} from './types';
import {Navigation} from '@/components/Calendar/Navigation';
import {ViewSwitcher} from '@/components/Calendar/ViewSwitcher';
import {MonthView} from '@/components/Calendar/MonthView';
import {WeekView} from '@/components/Calendar/WeekView';
import {DayView} from '@/components/Calendar/DayView';
import {SearchBar} from '@/components/Calendar/SearchBar';
import {format} from 'date-fns';
import {MiniCalendar} from '@/components/Calendar/MiniCalendar';
import {useKeyboardShortcuts} from '@/components/Calendar/hooks/useKeyboardShortcuts';
import {CalendarSharing} from '@/components/Calendar/CalendarSharing';
import {ExternalCalendar} from '@/components/Calendar/ExternalCalendar';
import {useGoogleCalendar} from '@/components/Calendar/GoogleCalendarProvider';

import ThemeSwitch from '@/components/align-ui/theme-switch';
import { 
  Root as ButtonRoot, 
  Icon as ButtonIcon 
} from '@/components/align-ui/ui/button';
import {
  RiAddLine,
  RiShareLine,
  RiDownloadLine,
  RiGoogleFill,
  RiCalendarCheckLine
} from '@remixicon/react';
import {EventCreationDrawer} from './EventCreationDrawer';

export function Calendar({
  events: initialEvents,
  onEventClick,
  onDateSelect,
  onEventUpdate,
  onEventCreate,
  onEventDelete
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [isExternalOpen, setIsExternalOpen] = useState(false);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);

  // Use Google Calendar integration
  const {
    isAuthenticated,
    isLoading,
    error,
    calendars,
    events: googleEvents,
    selectedCalendarId,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    selectCalendar,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  } = useGoogleCalendar();

  // Update events when Google Calendar events change
  useEffect(() => {
    if (isAuthenticated && googleEvents.length > 0) {
      // Only update if the events are actually different
      const currentEventsStr = JSON.stringify(events);
      const newEventsStr = JSON.stringify(googleEvents);
      if (currentEventsStr !== newEventsStr) {
        setEvents(googleEvents);
      }
    } else if (!isAuthenticated && events !== initialEvents) {
      setEvents(initialEvents);
    }
  }, [isAuthenticated, googleEvents, initialEvents, events]);

  // Fetch events when date changes
  useEffect(() => {
    if (isAuthenticated && selectedCalendarId) {
      // Calculate date range based on current view
      let startDate = new Date(currentDate);
      let endDate = new Date(currentDate);

      switch (currentView) {
        case 'month':
          // First day of the month
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          // Last day of the month
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );
          break;
        case 'week':
          // First day of the week (Sunday)
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          // Last day of the week (Saturday)
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'day':
          // Same day
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
          break;
      }

      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      // Only fetch events if we're not already in an error state
      if (!error) {
        fetchEvents(startDate, endDate).catch(err => {
          console.error('Error fetching events:', err);
          // Don't set error state here as it's already handled in the provider
        });
      }
    }
  }, [
    currentDate,
    currentView,
    isAuthenticated,
    selectedCalendarId,
    fetchEvents,
    error
  ]);

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
    setIsEventDrawerOpen(true);
    onEventClick?.(event);
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    if (isAuthenticated && selectedCalendarId) {
      try {
        // Update event in Google Calendar
        await updateEvent(updatedEvent.id, updatedEvent);
      } catch (error) {
        console.error('Error updating event in Google Calendar:', error);
        // Fall back to local update
        setEvents((currentEvents) =>
          currentEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
      }
    } else {
      // Local update only
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    }

    onEventUpdate?.(updatedEvent);
  };

  const handleEventCreate = async (newEvent: CalendarEvent) => {
    if (isAuthenticated && selectedCalendarId) {
      try {
        // Create event in Google Calendar
        const createdEvent = await createEvent(newEvent);
        setEvents((currentEvents) => [...currentEvents, createdEvent]);
      } catch (error) {
        console.error('Error creating event in Google Calendar:', error);
        // Fall back to local creation
        setEvents((currentEvents) => [...currentEvents, newEvent]);
      }
    } else {
      // Local creation only
      setEvents((currentEvents) => [...currentEvents, newEvent]);
    }

    onEventCreate?.(newEvent);
  };

  const handleEventDelete = async (eventId: string) => {
    if (isAuthenticated && selectedCalendarId) {
      try {
        // Delete event from Google Calendar
        await deleteEvent(eventId);
      } catch (error) {
        console.error('Error deleting event from Google Calendar:', error);
        // Fall back to local deletion
        setEvents((currentEvents) =>
          currentEvents.filter((event) => event.id !== eventId)
    );
      }
    } else {
      // Local deletion only
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      );
    }

    onEventDelete?.(eventId);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    const viewProps = {
      events: filteredEvents,
      currentDate,
      onEventClick: handleEventClick,
      onDateSelect,
      onEventUpdate: handleEventUpdate
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
              {format(
                currentDate,
                currentView === 'day' ? 'd MMMM yyyy' : 'MMMM yyyy'
              )}
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
              setIsEventDrawerOpen(true);
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
          {isAuthenticated ? (
            <ButtonRoot
              variant="neutral"
              onClick={disconnectGoogleCalendar}
              className="gap-1.5"
              disabled={isLoading}
            >
              <ButtonIcon>
                <RiCalendarCheckLine className="size-4" />
              </ButtonIcon>
              Disconnect Google
            </ButtonRoot>
          ) : (
            <ButtonRoot
              variant="neutral"
              onClick={async () => {
                console.log('Connecting Google Calendar from Calendar component');
                // Call the function directly and handle any errors
                try {
                  await connectGoogleCalendar();
                } catch (error) {
                  console.error('Error calling connectGoogleCalendar:', error);
                }
              }}
              className="gap-1.5"
              disabled={isLoading}
            >
              <ButtonIcon>
                <RiGoogleFill className="size-4" />
              </ButtonIcon>
              Connect Google
            </ButtonRoot>
          )}
          <div className="w-px h-5 bg-gray-200/60" />
          <ThemeSwitch />
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">Google Calendar Error:</p>
          <p>{error}</p>
          {error.includes('Calendar not found') && (
            <div className="mt-2">
              <p className="font-medium">Available Calendars:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {calendars.map((calendar) => (
                  <button
                    key={calendar.id}
                    className={`px-2 py-1 rounded-md text-sm ${
                      selectedCalendarId === calendar.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => selectCalendar(calendar.id)}
                  >
                    {calendar.summary}
                  </button>
                ))}
              </div>
            </div>
          )}
          {error.includes('Connection error') && (
            <div className="mt-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  // Reset error state and retry fetching events
                  if (selectedCalendarId) {
                    const startDate = new Date(currentDate);
                    const endDate = new Date(currentDate);
                    
                    // Set date range based on current view
                    switch (currentView) {
                      case 'month':
                        startDate.setDate(1);
                        endDate.setMonth(endDate.getMonth() + 1);
                        endDate.setDate(0);
                        break;
                      case 'week':
                        startDate.setDate(startDate.getDate() - startDate.getDay());
                        endDate.setDate(startDate.getDate() + 6);
                        break;
                      case 'day':
                        // Same day
                        break;
                    }
                    
                    // Set end date to end of day
                    endDate.setHours(23, 59, 59, 999);
                    
                    fetchEvents(startDate, endDate);
                  }
                }}
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1">{renderView()}</div>
        <div className="w-64 p-4 border-l border-gray-200/40">
          <MiniCalendar 
            currentDate={currentDate} 
            onDateSelect={setCurrentDate} 
          />
          {isAuthenticated && calendars.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Calendars</h3>
              <div className="space-y-1">
                {calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className={`flex items-center p-2 rounded cursor-pointer ${selectedCalendarId === calendar.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onClick={() => selectCalendar(calendar.id)}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: calendar.backgroundColor || '#4285F4'
                      }}
                    />
                    <span className="text-sm truncate">{calendar.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <EventCreationDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => {
          setIsEventDrawerOpen(false);
          setSelectedEvent(null);
        }}
        onSave={(event) => {
          if (selectedEvent) {
            handleEventUpdate(event);
          } else {
            handleEventCreate(event);
          }
          setIsEventDrawerOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={selectedEvent ? handleEventDelete : undefined}
        initialDate={currentDate}
        event={selectedEvent ?? undefined}
      />
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
