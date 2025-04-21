import React, { useState, useEffect } from 'react';
import { Root as ButtonRoot } from '@/components/align-ui/ui/button';
import { Root as ModalRoot, Content as ModalContent, Header as ModalHeader, Title as ModalTitle, Body as ModalBody, Footer as ModalFooter } from '@/components/align-ui/ui/modal';
import { Root as InputRoot } from '@/components/align-ui/ui/input';
import { RiGoogleFill, RiCalendarCheckLine, RiCalendarCloseLine } from '@remixicon/react';

// Add type declaration for gapi
declare global {
  interface Window {
    gapi: {
      client: {
        init: (config: any) => Promise<void>;
        calendar: {
          calendarList: {
            list: () => Promise<any>;
          };
          events: {
            list: (params: any) => Promise<any>;
            insert: (params: any) => Promise<any>;
            update: (params: any) => Promise<any>;
            delete: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<void>;
          signOut: () => Promise<void>;
        };
      };
    };
  }
}

// Google Calendar API types
interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  timeZone: string;
  colorId?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole: string;
  primary?: boolean;
}

interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
    optional?: boolean;
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: string;
      minutes: number;
    }[];
  };
  status: string;
}

// Google Calendar Integration Component
const GoogleCalendarIntegration: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Google API client
  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        // Load the Google API client library
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        // Initialize the client
        await window.gapi.client.init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        });

        // Check if user is already signed in
        const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        setIsAuthenticated(isSignedIn);
        
        if (isSignedIn) {
          fetchCalendars();
        }
      } catch (err) {
        console.error('Error initializing Google API:', err);
        setError('Failed to initialize Google Calendar integration');
      }
    };

    initGoogleApi();
  }, []);

  // Handle Google Sign In
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsAuthenticated(true);
      
      // Fetch calendars after successful authentication
      await fetchCalendars();
    } catch (err) {
      console.error('Error signing in to Google:', err);
      setError('Failed to sign in to Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign Out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsAuthenticated(false);
      setCalendars([]);
      setEvents([]);
      setSyncToken(null);
    } catch (err) {
      console.error('Error signing out from Google:', err);
      setError('Failed to sign out from Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's calendars
  const fetchCalendars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await window.gapi.client.calendar.calendarList.list();
      const calendarList = response.result.items;
      setCalendars(calendarList);
      
      // If there are calendars, fetch events from the primary calendar
      if (calendarList.length > 0) {
        const primaryCalendar = calendarList.find((cal: GoogleCalendar) => cal.primary) || calendarList[0];
        await fetchEvents(primaryCalendar.id);
      }
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to fetch calendars');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events from a specific calendar
  const fetchEvents = async (calendarId: string, useSyncToken = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      };
      
      // Use sync token for incremental sync if available
      if (useSyncToken && syncToken) {
        params.syncToken = syncToken;
      }
      
      const response = await window.gapi.client.calendar.events.list(params);
      
      // Update events and sync token
      setEvents(response.result.items);
      if (response.result.nextSyncToken) {
        setSyncToken(response.result.nextSyncToken);
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      
      // Handle sync token expiration
      if (err.code === 410) {
        setSyncToken(null);
        // Retry without sync token
        await fetchEvents(calendarId, false);
      } else {
        setError('Failed to fetch events');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new event
  const createEvent = async (eventDetails: Partial<GoogleEvent>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      if (!primaryCalendar) {
        throw new Error('No calendar available');
      }
      
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: primaryCalendar.id,
        resource: eventDetails,
      });
      
      // Refresh events list
      await fetchEvents(primaryCalendar.id);
      
      return response.result;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (calendarId: string, eventId: string, eventDetails: Partial<GoogleEvent>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await window.gapi.client.calendar.events.update({
        calendarId,
        eventId,
        resource: eventDetails,
      });
      
      // Refresh events list
      await fetchEvents(calendarId);
      
      return response.result;
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (calendarId: string, eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await window.gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      });
      
      // Refresh events list
      await fetchEvents(calendarId);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="google-calendar-integration">
      <div className="integration-header">
        <h2>Google Calendar Integration</h2>
        {isAuthenticated ? (
          <ButtonRoot 
            variant="neutral" 
            mode="stroke" 
            size="small" 
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <RiCalendarCloseLine className="w-4 h-4" />
            Disconnect Google Calendar
          </ButtonRoot>
        ) : (
          <ButtonRoot 
            variant="primary" 
            mode="filled" 
            size="small" 
            onClick={handleSignIn}
            disabled={isLoading}
          >
            <RiGoogleFill className="w-4 h-4" />
            Connect Google Calendar
          </ButtonRoot>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isAuthenticated && (
        <div className="calendar-content">
          <div className="calendar-list">
            <h3>Your Calendars</h3>
            {calendars.length > 0 ? (
              <ul>
                {calendars.map(calendar => (
                  <li key={calendar.id} className={calendar.primary ? 'primary' : ''}>
                    <span 
                      className="calendar-color" 
                      style={{ backgroundColor: calendar.backgroundColor || '#4285F4' }}
                    />
                    {calendar.summary}
                    {calendar.primary && <span className="primary-badge">Primary</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No calendars found</p>
            )}
          </div>

          <div className="events-list">
            <h3>Upcoming Events</h3>
            {events.length > 0 ? (
              <ul>
                {events.map(event => (
                  <li key={event.id}>
                    <div className="event-time">
                      {event.start.dateTime 
                        ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'All Day'}
                    </div>
                    <div className="event-details">
                      <div className="event-title">{event.summary}</div>
                      {event.location && (
                        <div className="event-location">{event.location}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming events</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .google-calendar-integration {
          padding: 1rem;
          border-radius: 8px;
          background-color: var(--color-background-secondary);
        }

        .integration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          background-color: var(--color-error-light);
          color: var(--color-error);
        }

        .calendar-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
        }

        .calendar-list ul, .events-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .calendar-list li, .events-list li {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border-radius: 4px;
          background-color: var(--color-background-primary);
        }

        .calendar-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .primary-badge {
          margin-left: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          font-size: 0.75rem;
        }

        .event-time {
          min-width: 60px;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .event-details {
          flex: 1;
        }

        .event-title {
          font-weight: 500;
        }

        .event-location {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
};

export default GoogleCalendarIntegration; 