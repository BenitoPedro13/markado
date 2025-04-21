import { GoogleCalendarEndpoints, GoogleCalendarScope } from '@/types/googleCalendar';

/**
 * Google Calendar API configuration
 */
export const GOOGLE_CALENDAR_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.settings.readonly',
  ] as GoogleCalendarScope[],
};

/**
 * Google Calendar API endpoints
 */
export const GOOGLE_CALENDAR_ENDPOINTS: GoogleCalendarEndpoints = {
  AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN: 'https://oauth2.googleapis.com/token',
  CALENDARS: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
  EVENTS: 'https://www.googleapis.com/calendar/v3/calendars',
  SETTINGS: 'https://www.googleapis.com/calendar/v3/users/me/settings',
};

/**
 * Default calendar settings
 */
export const DEFAULT_CALENDAR_SETTINGS = {
  timeZone: 'UTC',
  reminders: [
    { method: 'email', minutes: 24 * 60 }, // 1 day before
    { method: 'popup', minutes: 30 }, // 30 minutes before
  ],
  notifications: [
    { type: 'eventCreation', method: 'email' },
    { type: 'eventChange', method: 'email' },
    { type: 'eventCancellation', method: 'email' },
    { type: 'eventResponse', method: 'email' },
  ],
};

/**
 * Calendar color options
 */
export const CALENDAR_COLORS = [
  { id: '1', backgroundColor: '#7986cb', foregroundColor: '#000000' },
  { id: '2', backgroundColor: '#33b679', foregroundColor: '#000000' },
  { id: '3', backgroundColor: '#8e24aa', foregroundColor: '#ffffff' },
  { id: '4', backgroundColor: '#e67c73', foregroundColor: '#000000' },
  { id: '5', backgroundColor: '#f6c026', foregroundColor: '#000000' },
  { id: '6', backgroundColor: '#f5511d', foregroundColor: '#ffffff' },
  { id: '7', backgroundColor: '#039be5', foregroundColor: '#ffffff' },
  { id: '8', backgroundColor: '#616161', foregroundColor: '#ffffff' },
  { id: '9', backgroundColor: '#3f51b5', foregroundColor: '#ffffff' },
  { id: '10', backgroundColor: '#0b8043', foregroundColor: '#ffffff' },
  { id: '11', backgroundColor: '#d50000', foregroundColor: '#ffffff' },
]; 