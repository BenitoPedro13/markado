import { GoogleEvent } from '@/types/googleCalendar';

// Google Calendar API endpoints
const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALENDARS_ENDPOINT = `${GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`;
const EVENTS_ENDPOINT = (calendarId: string) => `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`;

// Interface for API response
interface ApiResponse<T> {
  data: T | null;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Fetches the list of calendars for the authenticated user
 */
export const fetchCalendars = async (accessToken: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(CALENDARS_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to fetch calendars',
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('Error fetching calendars:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Fetches events for a specific calendar
 */
export const fetchEvents = async (
  accessToken: string,
  calendarId: string,
  timeMin?: string,
  timeMax?: string,
  maxResults: number = 100
): Promise<ApiResponse<any>> => {
  try {
    let url = EVENTS_ENDPOINT(calendarId);
    
    // Add query parameters
    const params = new URLSearchParams();
    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);
    params.append('maxResults', maxResults.toString());
    params.append('singleEvents', 'true');
    params.append('orderBy', 'startTime');
    
    url += `?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to fetch events',
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Creates a new event in the specified calendar
 */
export const createEvent = async (
  accessToken: string,
  calendarId: string,
  event: Partial<GoogleEvent>
): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(EVENTS_ENDPOINT(calendarId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to create event',
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('Error creating event:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Updates an existing event in the specified calendar
 */
export const updateEvent = async (
  accessToken: string,
  calendarId: string,
  eventId: string,
  event: Partial<GoogleEvent>
): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${EVENTS_ENDPOINT(calendarId)}/${eventId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to update event',
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('Error updating event:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Deletes an event from the specified calendar
 */
export const deleteEvent = async (
  accessToken: string,
  calendarId: string,
  eventId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${EVENTS_ENDPOINT(calendarId)}/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to delete event',
        },
      };
    }

    return { data: null };
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Refreshes the access token using the refresh token
 */
export const refreshAccessToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<ApiResponse<{ access_token: string; expires_in: number } | null>> => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          code: response.status,
          message: errorData.error?.message || 'Failed to refresh access token',
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('Error refreshing access token:', error);
    return {
      data: null,
      error: {
        code: 500,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
}; 