import { GoogleMeetScope } from '@/types/googleMeet';

/**
 * Google Meet API configuration
 */
export const GOOGLE_MEET_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '', // Using same client ID as calendar
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', // Using same client secret as calendar
  redirectUri: process.env.GOOGLE_REDIRECT_URI || '', // Using same redirect URI as calendar
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/meetings.space.created'
  ] as GoogleMeetScope[],
};

/**
 * Google Meet API endpoints
 */
export const GOOGLE_MEET_ENDPOINTS = {
  AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN: 'https://oauth2.googleapis.com/token',
}; 