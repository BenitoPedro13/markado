import { GoogleAuthState, GoogleCalendar, GoogleEvent, GoogleCalendarError } from '@/types/googleCalendar';
import { GOOGLE_CALENDAR_CONFIG, GOOGLE_CALENDAR_ENDPOINTS, DEFAULT_CALENDAR_SETTINGS } from '@/config/googleCalendar';

/**
 * Google Calendar API service
 */
export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private authState: GoogleAuthState | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  /**
   * Initialize authentication state
   */
  public setAuthState(state: GoogleAuthState): void {
    this.authState = state;
  }

  /**
   * Get authentication state
   */
  public getAuthState(): GoogleAuthState | null {
    return this.authState;
  }

  /**
   * Get authorization URL
   */
  public getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CALENDAR_CONFIG.clientId,
      redirect_uri: GOOGLE_CALENDAR_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${GOOGLE_CALENDAR_ENDPOINTS.AUTH}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  public async exchangeCode(code: string): Promise<GoogleAuthState> {
    const response = await fetch(GOOGLE_CALENDAR_ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CALENDAR_CONFIG.clientId,
        client_secret: GOOGLE_CALENDAR_CONFIG.clientSecret,
        redirect_uri: GOOGLE_CALENDAR_CONFIG.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();
    this.authState = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      scope: data.scope,
    };

    return this.authState;
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(): Promise<void> {
    if (!this.authState?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(GOOGLE_CALENDAR_ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CALENDAR_CONFIG.clientId,
        client_secret: GOOGLE_CALENDAR_CONFIG.clientSecret,
        refresh_token: this.authState.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    this.authState = {
      ...this.authState,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
  }

  /**
   * Get list of calendars
   */
  public async getCalendars(): Promise<GoogleCalendar[]> {
    if (!this.authState?.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(GOOGLE_CALENDAR_ENDPOINTS.CALENDARS, {
      headers: {
        Authorization: `Bearer ${this.authState.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendars');
    }

    const data = await response.json();
    return data.items;
  }

  /**
   * Get events for a calendar
   */
  public async getEvents(calendarId: string, timeMin: string, timeMax: string): Promise<GoogleEvent[]> {
    if (!this.authState?.accessToken) {
      throw new Error('Not authenticated');
    }

    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.authState.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.items;
  }

  /**
   * Create a new event
   */
  public async createEvent(calendarId: string, event: Partial<GoogleEvent>): Promise<GoogleEvent> {
    if (!this.authState?.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authState.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        reminders: event.reminders || DEFAULT_CALENDAR_SETTINGS.reminders,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    return response.json();
  }

  /**
   * Update an existing event
   */
  public async updateEvent(calendarId: string, eventId: string, event: Partial<GoogleEvent>): Promise<GoogleEvent> {
    if (!this.authState?.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events/${eventId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.authState.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update event');
    }

    return response.json();
  }

  /**
   * Delete an event
   */
  public async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.authState?.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.authState.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }
} 