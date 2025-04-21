import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { CalendarEvent } from './types';
import { GoogleCalendar, GoogleEvent } from '@/types/googleCalendar';
import { GOOGLE_CALENDAR_CONFIG } from '@/config/googleCalendar';

// Define the context type
interface GoogleCalendarContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  calendars: GoogleCalendar[];
  events: CalendarEvent[];
  selectedCalendarId: string | null;
  syncToken: string | null;
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => Promise<void>;
  selectCalendar: (calendarId: string) => void;
  fetchEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  createEvent: (event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string) => Promise<void>;
}

// Create the context with default values
const GoogleCalendarContext = createContext<GoogleCalendarContextType>({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  calendars: [],
  events: [],
  selectedCalendarId: null,
  syncToken: null,
  connectGoogleCalendar: async () => {},
  disconnectGoogleCalendar: async () => {},
  selectCalendar: () => {},
  fetchEvents: async () => {},
  createEvent: async () => ({ id: '', title: '', start: new Date(), end: new Date() }),
  updateEvent: async () => ({ id: '', title: '', start: new Date(), end: new Date() }),
  deleteEvent: async () => {},
});

// Custom hook to use the Google Calendar context
export const useGoogleCalendar = () => useContext(GoogleCalendarContext);

// Provider component
interface GoogleCalendarProviderProps {
  children: ReactNode;
}

export const GoogleCalendarProvider: React.FC<GoogleCalendarProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState<number | null>(null);
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds

  // Add a ref to track the last fetch time and date range
  const lastFetchRef = useRef<{
    startDate?: Date;
    endDate?: Date;
    timestamp: number;
  }>({ timestamp: 0 });

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/integrations/googlecalendar/status');
        const data = await response.json();
        
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          await fetchCalendars();
          
          // If user has a selected calendar and we don't have events yet, fetch events for it
          if (data.selectedCalendarId && events.length === 0) {
            setSelectedCalendarId(data.selectedCalendarId);
            await fetchEvents();
          }
        }
      } catch (err) {
        console.error('Error checking Google Calendar authentication status:', err);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch user's calendars
  const fetchCalendars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/integrations/googlecalendar/calendars');
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendars');
      }
      
      const data = await response.json();
      setCalendars(data.calendars);
      
      // If no calendar is selected yet, select the primary calendar
      if (!selectedCalendarId && data.calendars.length > 0) {
        const primaryCalendar = data.calendars.find((cal: GoogleCalendar) => cal.primary);
        if (primaryCalendar) {
          setSelectedCalendarId(primaryCalendar.id);
          await fetchEvents();
        }
      }
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to fetch calendars');
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the fetchEvents function to include date range checks
  const fetchEvents = async (startDate?: Date, endDate?: Date) => {
    if (!selectedCalendarId) {
      console.log('No calendar selected, skipping event fetch');
      return;
    }
    
    // Check if we should retry based on error timing
    if (lastErrorTime && retryCount > 0) {
      const timeSinceLastError = Date.now() - lastErrorTime;
      if (timeSinceLastError < retryDelay * Math.pow(2, retryCount - 1)) {
        console.log(`Waiting before retry (${retryCount}/${maxRetries})...`);
        return;
      }
    }

    // Check if we've recently fetched for this date range (within 5 seconds)
    const now = Date.now();
    const lastFetch = lastFetchRef.current;
    const isSameDateRange = 
      startDate?.getTime() === lastFetch.startDate?.getTime() &&
      endDate?.getTime() === lastFetch.endDate?.getTime();
    
    if (isSameDateRange && now - lastFetch.timestamp < 5000) {
      console.log('Skipping fetch - same date range fetched recently');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (syncToken) params.append('syncToken', syncToken);
      
      console.log(`Fetching events for calendar: ${selectedCalendarId}`);
      const response = await fetch(`/api/integrations/googlecalendar/events/${selectedCalendarId}?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        
        if (response.status === 404) {
          setError(`Calendar not found or access denied. Please select a different calendar.`);
          // Clear the selected calendar ID to force re-selection
          setSelectedCalendarId(null);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Convert Google events to Calendar events
      const calendarEvents = data.events.map((event: GoogleEvent) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date || ''),
        end: new Date(event.end.dateTime || event.end.date || ''),
        description: event.description,
        color: event.colorId ? `#${getColorFromId(event.colorId)}` : undefined,
        allDay: !event.start.dateTime,
      }));
      
      setEvents(calendarEvents);
      
      // Update last fetch info
      lastFetchRef.current = {
        startDate,
        endDate,
        timestamp: now
      };
      
      // Reset retry count on success
      setRetryCount(0);
      setLastErrorTime(null);
      
      // Update sync token if available
      if (data.nextSyncToken) {
        setSyncToken(data.nextSyncToken);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      
      // Handle connection errors with retry mechanism
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setLastErrorTime(Date.now());
        
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setError(`Connection error. Retrying (${retryCount + 1}/${maxRetries})...`);
          console.log(`Connection error. Will retry in ${retryDelay * Math.pow(2, retryCount)}ms`);
        } else {
          setError('Connection error. Please check your internet connection and try again later.');
          setRetryCount(0); // Reset for future attempts
        }
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    console.log('Connecting Google Calendar...: connectGoogleCalendar');
    try {
      console.log('Starting Google Calendar connection process...');
      setIsLoading(true);
      setError(null);
      
      // Use fetch to initiate the auth flow
      console.log('Fetching auth URL from server...');
      const response = await fetch('/api/integrations/googlecalendar/auth');
      console.log('Auth response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to get auth URL:', response.status, response.statusText);
        throw new Error('Failed to initiate Google Calendar authentication');
      }
      
      // Get the redirect URL from the response
      const data = await response.json();
      console.log('Received auth data:', data);
      
      if (data.url) {
        console.log('Redirecting to Google OAuth URL:', data.url);
        // Use direct window.location.href for redirection
        window.location.href = data.url;
      } else {
        console.error('No URL in response data');
        throw new Error('No authentication URL received');
      }
    } catch (err) {
      console.error('Error in connectGoogleCalendar:', err);
      setError('Failed to connect to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect from Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/integrations/googlecalendar/disconnect', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect from Google Calendar');
      }
      
      setIsAuthenticated(false);
      setCalendars([]);
      setEvents([]);
      setSelectedCalendarId(null);
      setSyncToken(null);
    } catch (err) {
      console.error('Error disconnecting from Google Calendar:', err);
      setError('Failed to disconnect from Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  // Select a calendar
  const selectCalendar = async (calendarId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/integrations/googlecalendar/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendarId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to select calendar');
      }
      
      setSelectedCalendarId(calendarId);
      await fetchEvents();
    } catch (err) {
      console.error('Error selecting calendar:', err);
      setError('Failed to select calendar');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new event
  const createEvent = async (event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    if (!selectedCalendarId) {
      throw new Error('No calendar selected');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert Calendar event to Google event
      const googleEvent: Partial<GoogleEvent> = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start?.toISOString(),
          timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end?.toISOString(),
          timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        colorId: event.color ? getColorIdFromHex(event.color) : undefined,
      };

      // If it's an all-day event, use date instead of dateTime
      if (event.allDay) {
        googleEvent.start = {
          date: event.start?.toISOString().split('T')[0],
        };
        googleEvent.end = {
          date: event.end?.toISOString().split('T')[0],
        };
      }
      
      const response = await fetch(`/api/integrations/googlecalendar/events/${selectedCalendarId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const data = await response.json();
      
      // Convert Google event to Calendar event
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.summary,
        start: new Date(data.start.dateTime || data.start.date || ''),
        end: new Date(data.end.dateTime || data.end.date || ''),
        description: data.description,
        color: data.colorId ? `#${getColorFromId(data.colorId)}` : undefined,
        allDay: !data.start.dateTime,
        timeZone: data.start.timeZone || event.timeZone,
      };
      
      // Update events list
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    if (!selectedCalendarId) {
      throw new Error('No calendar selected');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert Calendar event to Google event
      const googleEvent: Partial<GoogleEvent> = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start?.toISOString(),
          timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end?.toISOString(),
          timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        colorId: event.color ? getColorIdFromHex(event.color) : undefined,
      };

      // If it's an all-day event, use date instead of dateTime
      if (event.allDay) {
        googleEvent.start = {
          date: event.start?.toISOString().split('T')[0],
        };
        googleEvent.end = {
          date: event.end?.toISOString().split('T')[0],
        };
      }
      
      const response = await fetch(`/api/integrations/googlecalendar/events/${selectedCalendarId}/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      const data = await response.json();
      
      // Convert Google event to Calendar event
      const updatedEvent: CalendarEvent = {
        id: data.id,
        title: data.summary,
        start: new Date(data.start.dateTime || data.start.date || ''),
        end: new Date(data.end.dateTime || data.end.date || ''),
        description: data.description,
        color: data.colorId ? `#${getColorFromId(data.colorId)}` : undefined,
        allDay: !data.start.dateTime,
        timeZone: data.start.timeZone || event.timeZone,
      };
      
      // Update events list
      setEvents(prevEvents =>
        prevEvents.map(e => (e.id === eventId ? updatedEvent : e))
      );
      
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string): Promise<void> => {
    if (!selectedCalendarId) {
      throw new Error('No calendar selected');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/integrations/googlecalendar/events/${selectedCalendarId}/${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      // Update events list
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert Google Calendar color ID to hex color
  const getColorFromId = (colorId: string): string => {
    const colorMap: Record<string, string> = {
      '1': '7986CB', // Blue
      '2': '33B679', // Green
      '3': '8E24AA', // Purple
      '4': 'E67C73', // Red
      '5': 'F6C026', // Yellow
      '6': 'F5511D', // Orange
      '7': '039BE5', // Light Blue
      '8': '616161', // Grey
      '9': '3F51B5', // Dark Blue
      '10': '0B8043', // Dark Green
      '11': 'D50000', // Dark Red
    };
    
    return colorMap[colorId] || '7986CB'; // Default to blue
  };

  // Helper function to convert hex color to Google Calendar color ID
  const getColorIdFromHex = (hexColor: string): string => {
    const colorMap: Record<string, string> = {
      '#7986CB': '1', // Blue
      '#33B679': '2', // Green
      '#8E24AA': '3', // Purple
      '#E67C73': '4', // Red
      '#F6C026': '5', // Yellow
      '#F5511D': '6', // Orange
      '#039BE5': '7', // Light Blue
      '#616161': '8', // Grey
      '#3F51B5': '9', // Dark Blue
      '#0B8043': '10', // Dark Green
      '#D50000': '11', // Dark Red
    };
    
    return colorMap[hexColor.toUpperCase()] || '1'; // Default to blue
  };

  // Context value
  const contextValue: GoogleCalendarContextType = {
    isAuthenticated,
    isLoading,
    error,
    calendars,
    events,
    selectedCalendarId,
    syncToken,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    selectCalendar,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <GoogleCalendarContext.Provider value={contextValue}>
      {children}
    </GoogleCalendarContext.Provider>
  );
};

export default GoogleCalendarProvider; 