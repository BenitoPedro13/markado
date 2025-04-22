export type GoogleMeetScope =
  | 'https://www.googleapis.com/auth/calendar'
  | 'https://www.googleapis.com/auth/calendar.events'
  | 'https://www.googleapis.com/auth/meetings.space.created';

export interface GoogleMeetAuthState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
}

export interface GoogleMeetEndpoints {
  AUTH: string;
  TOKEN: string;
} 