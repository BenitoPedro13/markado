import { GoogleCalendarService } from '@/services/googleCalendar';
import { GoogleAuthState, GoogleCalendar, GoogleEvent } from '@/types/googleCalendar';
import { GOOGLE_CALENDAR_CONFIG, GOOGLE_CALENDAR_ENDPOINTS } from '@/config/googleCalendar';

// Mock fetch function
global.fetch = jest.fn();

describe('Google Calendar Integration', () => {
  let googleCalendarService: GoogleCalendarService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get singleton instance
    googleCalendarService = GoogleCalendarService.getInstance();
  });
  
  describe('Authentication', () => {
    it('should generate correct authorization URL', () => {
      const authUrl = googleCalendarService.getAuthUrl();
      
      // Check that the URL contains the required parameters
      expect(authUrl).toContain(GOOGLE_CALENDAR_ENDPOINTS.AUTH);
      expect(authUrl).toContain(`client_id=${GOOGLE_CALENDAR_CONFIG.clientId}`);
      expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.redirectUri)}`);
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain('access_type=offline');
      expect(authUrl).toContain('prompt=consent');
      
      // Check that all scopes are included
      GOOGLE_CALENDAR_CONFIG.scopes.forEach(scope => {
        expect(authUrl).toContain(encodeURIComponent(scope));
      });
    });
    
    it('should exchange authorization code for tokens', async () => {
      // Mock successful token exchange response
      (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_in: 3600,
            scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
          }),
        });
      });
      
      const authState = await googleCalendarService.exchangeCode('test-auth-code');
      
      // Check that the auth state was set correctly
      expect(authState).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: expect.any(Number),
        scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
      });
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        GOOGLE_CALENDAR_ENDPOINTS.TOKEN,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
      
      // Check the body parameters separately
      const body = (global.fetch as jest.Mock).mock.calls[0][1].body;
      expect(body).toContain('code=test-auth-code');
      expect(body).toContain(`client_id=${GOOGLE_CALENDAR_CONFIG.clientId}`);
      expect(body).toContain(`client_secret=${GOOGLE_CALENDAR_CONFIG.clientSecret}`);
      expect(body).toContain(`redirect_uri=${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.redirectUri)}`);
      expect(body).toContain('grant_type=authorization_code');
    });
    
    it('should refresh access token', async () => {
      // Set initial auth state
      const initialAuthState: GoogleAuthState = {
        accessToken: 'old-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 3600000,
        scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
      };
      googleCalendarService.setAuthState(initialAuthState);
      
      // Mock successful token refresh response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token',
          expires_in: 3600,
        }),
      });
      
      await googleCalendarService.refreshAccessToken();
      
      // Check that the auth state was updated correctly
      const updatedAuthState = googleCalendarService.getAuthState();
      expect(updatedAuthState).toEqual({
        ...initialAuthState,
        accessToken: 'new-access-token',
        expiresAt: expect.any(Number),
      });
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        GOOGLE_CALENDAR_ENDPOINTS.TOKEN,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: expect.any(String),
        })
      );
      
      // Check that the body contains the required parameters
      const body = (global.fetch as jest.Mock).mock.calls[0][1].body;
      expect(body).toContain(`client_id=${GOOGLE_CALENDAR_CONFIG.clientId}`);
      expect(body).toContain(`client_secret=${GOOGLE_CALENDAR_CONFIG.clientSecret}`);
      expect(body).toContain('refresh_token=test-refresh-token');
      expect(body).toContain('grant_type=refresh_token');
    });
  });
  
  describe('Calendar Operations', () => {
    beforeEach(() => {
      // Set auth state for calendar operations
      googleCalendarService.setAuthState({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 3600000,
        scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
      });
    });
    
    it('should fetch calendars', async () => {
      // Mock successful calendars response
      const mockCalendars: GoogleCalendar[] = [
        {
          id: 'primary',
          summary: 'Primary Calendar',
          timeZone: 'UTC',
          primary: true,
          accessRole: 'owner',
          etag: 'etag1',
          kind: 'calendar#calendarListEntry',
        },
        {
          id: 'secondary',
          summary: 'Secondary Calendar',
          timeZone: 'UTC',
          primary: false,
          accessRole: 'owner',
          etag: 'etag2',
          kind: 'calendar#calendarListEntry',
        },
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: mockCalendars,
        }),
      });
      
      const calendars = await googleCalendarService.getCalendars();
      
      // Check that the calendars were returned correctly
      expect(calendars).toEqual(mockCalendars);
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        GOOGLE_CALENDAR_ENDPOINTS.CALENDARS,
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-access-token',
          },
        })
      );
    });
    
    it('should fetch events for a calendar', async () => {
      // Mock successful events response
      const mockEvents: GoogleEvent[] = [
        {
          id: 'event1',
          summary: 'Test Event 1',
          start: { dateTime: '2023-01-01T10:00:00Z' },
          end: { dateTime: '2023-01-01T11:00:00Z' },
          status: 'confirmed',
          created: '2023-01-01T00:00:00Z',
          updated: '2023-01-01T00:00:00Z',
        },
        {
          id: 'event2',
          summary: 'Test Event 2',
          start: { dateTime: '2023-01-02T10:00:00Z' },
          end: { dateTime: '2023-01-02T11:00:00Z' },
          status: 'confirmed',
          created: '2023-01-01T00:00:00Z',
          updated: '2023-01-01T00:00:00Z',
        },
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: mockEvents,
        }),
      });
      
      const timeMin = '2023-01-01T00:00:00Z';
      const timeMax = '2023-01-31T23:59:59Z';
      const calendarId = 'primary';
      
      const events = await googleCalendarService.getEvents(calendarId, timeMin, timeMax);
      
      // Check that the events were returned correctly
      expect(events).toEqual(mockEvents);
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events`),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-access-token',
          },
        })
      );
      
      // Verify URL parameters separately
      const url = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(url).toContain(`timeMin=${encodeURIComponent(timeMin)}`);
      expect(url).toContain(`timeMax=${encodeURIComponent(timeMax)}`);
      expect(url).toContain('singleEvents=true');
      expect(url).toContain('orderBy=startTime');
    });
    
    it('should create a new event', async () => {
      // Mock successful event creation response
      const mockEvent: GoogleEvent = {
        id: 'new-event',
        summary: 'New Test Event',
        start: { dateTime: '2023-01-03T10:00:00Z' },
        end: { dateTime: '2023-01-03T11:00:00Z' },
        status: 'confirmed',
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-01T00:00:00Z',
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });
      
      const calendarId = 'primary';
      const eventDetails: Partial<GoogleEvent> = {
        summary: 'New Test Event',
        start: { dateTime: '2023-01-03T10:00:00Z' },
        end: { dateTime: '2023-01-03T11:00:00Z' },
      };
      
      const createdEvent = await googleCalendarService.createEvent(calendarId, eventDetails);
      
      // Check that the event was created correctly
      expect(createdEvent).toEqual(mockEvent);
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer test-access-token',
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        })
      );
      
      // Check that the body contains the event details
      const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.summary).toBe(eventDetails.summary);
      expect(body.start).toEqual(eventDetails.start);
      expect(body.end).toEqual(eventDetails.end);
      expect(body.reminders).toBeDefined();
    });
    
    it('should update an existing event', async () => {
      // Mock successful event update response
      const mockEvent: GoogleEvent = {
        id: 'updated-event',
        summary: 'Updated Test Event',
        start: { dateTime: '2023-01-04T10:00:00Z' },
        end: { dateTime: '2023-01-04T11:00:00Z' },
        status: 'confirmed',
        created: '2023-01-01T00:00:00Z',
        updated: '2023-01-01T00:00:00Z',
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });
      
      const calendarId = 'primary';
      const eventId = 'event1';
      const eventDetails: Partial<GoogleEvent> = {
        summary: 'Updated Test Event',
        start: { dateTime: '2023-01-04T10:00:00Z' },
        end: { dateTime: '2023-01-04T11:00:00Z' },
      };
      
      const updatedEvent = await googleCalendarService.updateEvent(calendarId, eventId, eventDetails);
      
      // Check that the event was updated correctly
      expect(updatedEvent).toEqual(mockEvent);
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events/${eventId}`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            Authorization: 'Bearer test-access-token',
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        })
      );
      
      // Check that the body contains the event details
      const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.summary).toBe(eventDetails.summary);
      expect(body.start).toEqual(eventDetails.start);
      expect(body.end).toEqual(eventDetails.end);
    });
    
    it('should delete an event', async () => {
      // Mock successful event deletion response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });
      
      const calendarId = 'primary';
      const eventId = 'event1';
      
      await googleCalendarService.deleteEvent(calendarId, eventId);
      
      // Check that the fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        `${GOOGLE_CALENDAR_ENDPOINTS.EVENTS}/${calendarId}/events/${eventId}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer test-access-token',
          },
        })
      );
    });
  });
  
  describe('Error Handling', () => {
    it('should throw an error when not authenticated', async () => {
      // Clear auth state
      googleCalendarService.setAuthState({
        accessToken: '',
        refreshToken: '',
        expiresAt: 0,
        scope: ''
      });
      
      // Attempt to fetch calendars without authentication
      await expect(googleCalendarService.getCalendars()).rejects.toThrow('Not authenticated');
    });
    
    it('should throw an error when token exchange fails', async () => {
      // Mock failed token exchange response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'invalid_request',
          error_description: 'Invalid request',
        }),
      });
      
      await expect(googleCalendarService.exchangeCode('invalid-code')).rejects.toThrow('Failed to exchange code for tokens');
    });
    
    it('should throw an error when token refresh fails', async () => {
      // Set initial auth state
      googleCalendarService.setAuthState({
        accessToken: 'old-access-token',
        refreshToken: 'invalid-refresh-token',
        expiresAt: Date.now() + 3600000,
        scope: GOOGLE_CALENDAR_CONFIG.scopes.join(' '),
      });
      
      // Mock failed token refresh response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Invalid refresh token',
        }),
      });
      
      await expect(googleCalendarService.refreshAccessToken()).rejects.toThrow('Failed to refresh access token');
    });
  });
}); 