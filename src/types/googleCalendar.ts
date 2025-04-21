/**
 * Google Calendar API types and interfaces
 */

/**
 * Google Calendar authentication state
 */
export interface GoogleAuthState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
}

/**
 * Google Calendar error response
 */
export interface GoogleCalendarError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

/**
 * Google Calendar event reminder
 */
export interface GoogleCalendarReminder {
  method: 'email' | 'popup';
  minutes: number;
}

/**
 * Google Calendar event date/time
 */
export interface GoogleCalendarDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

/**
 * Google Calendar event attendee
 */
export interface GoogleCalendarAttendee {
  id?: string;
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  organizer?: boolean;
  self?: boolean;
}

/**
 * Google Calendar event
 */
export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  attendees?: GoogleCalendarAttendee[];
  reminders?: {
    useDefault: boolean;
    overrides?: GoogleCalendarReminder[];
  };
  recurrence?: string[];
  colorId?: string;
  transparency?: 'opaque' | 'transparent';
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  status?: 'confirmed' | 'tentative' | 'cancelled';
  created: string;
  updated: string;
  htmlLink?: string;
  iCalUID?: string;
  sequence?: number;
  etag?: string;
}

/**
 * Google Calendar
 */
export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  selected?: boolean;
  accessRole: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  defaultReminders?: GoogleCalendarReminder[];
  notificationSettings?: {
    notifications: Array<{
      type: string;
      method: string;
    }>;
  };
  etag: string;
  kind: string;
}

/**
 * Google Calendar API response
 */
export interface GoogleCalendarResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  nextSyncToken?: string;
  items: T[];
}

/**
 * Google Calendar API error codes
 */
export enum GoogleCalendarErrorCode {
  INVALID_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  REQUEST_ENTITY_TOO_LARGE = 413,
  RATE_LIMIT_EXCEEDED = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Google Calendar API error reasons
 */
export enum GoogleCalendarErrorReason {
  REQUIRED = 'required',
  INVALID = 'invalid',
  INVALID_VALUE = 'invalidValue',
  INVALID_FORMAT = 'invalidFormat',
  INVALID_PARAMETER = 'invalidParameter',
  INVALID_JSON = 'invalidJson',
  INVALID_CONTENT_TYPE = 'invalidContentType',
  INVALID_CREDENTIALS = 'invalidCredentials',
  INVALID_TOKEN = 'invalidToken',
  INVALID_SCOPE = 'invalidScope',
  INVALID_REQUEST = 'invalidRequest',
  INVALID_RESPONSE = 'invalidResponse',
  INVALID_STATE = 'invalidState',
  INVALID_VERSION = 'invalidVersion',
  INVALID_VERSION_FORMAT = 'invalidVersionFormat',
  INVALID_VERSION_NUMBER = 'invalidVersionNumber',
  INVALID_VERSION_STRING = 'invalidVersionString',
  INVALID_VERSION_TYPE = 'invalidVersionType',
  INVALID_VERSION_VALUE = 'invalidVersionValue',
  INVALID_VERSION_FORMAT_STRING = 'invalidVersionFormatString',
  INVALID_VERSION_NUMBER_STRING = 'invalidVersionNumberString',
  INVALID_VERSION_STRING_STRING = 'invalidVersionStringString',
  INVALID_VERSION_TYPE_STRING = 'invalidVersionTypeString',
  INVALID_VERSION_VALUE_STRING = 'invalidVersionValueString',
}

export type GoogleCalendarScope =
  | 'https://www.googleapis.com/auth/calendar'
  | 'https://www.googleapis.com/auth/calendar.events'
  | 'https://www.googleapis.com/auth/calendar.readonly'
  | 'https://www.googleapis.com/auth/calendar.settings.readonly';

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: GoogleCalendarScope[];
}

export interface GoogleCalendarEndpoints {
  AUTH: string;
  TOKEN: string;
  CALENDARS: string;
  EVENTS: string;
  SETTINGS: string;
}

export interface GoogleCalendarSettings {
  timeZone: string;
  reminders: GoogleCalendarReminder[];
  notifications: {
    type: string;
    method: string;
  }[];
}

export interface GoogleCalendarColor {
  id: string;
  backgroundColor: string;
  foregroundColor: string;
} 