import { GoogleMeetAuthState } from '@/types/googleMeet';
import { GOOGLE_MEET_CONFIG, GOOGLE_MEET_ENDPOINTS } from '@/config/googleMeet';

/**
 * Google Meet API service
 */
export class GoogleMeetService {
  private static instance: GoogleMeetService;
  private authState: GoogleMeetAuthState | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): GoogleMeetService {
    if (!GoogleMeetService.instance) {
      GoogleMeetService.instance = new GoogleMeetService();
    }
    return GoogleMeetService.instance;
  }

  /**
   * Initialize authentication state
   */
  public setAuthState(state: GoogleMeetAuthState): void {
    this.authState = state;
  }

  /**
   * Get authentication state
   */
  public getAuthState(): GoogleMeetAuthState | null {
    return this.authState;
  }

  /**
   * Get authorization URL
   */
  public getAuthUrl(returnUrl: string): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_MEET_CONFIG.clientId,
      redirect_uri: GOOGLE_MEET_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_MEET_CONFIG.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: returnUrl // Pass the return URL in the state parameter
    });

    return `${GOOGLE_MEET_ENDPOINTS.AUTH}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  public async exchangeCode(code: string): Promise<GoogleMeetAuthState> {
    const response = await fetch(GOOGLE_MEET_ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_MEET_CONFIG.clientId,
        client_secret: GOOGLE_MEET_CONFIG.clientSecret,
        redirect_uri: GOOGLE_MEET_CONFIG.redirectUri,
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

    const response = await fetch(GOOGLE_MEET_ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_MEET_CONFIG.clientId,
        client_secret: GOOGLE_MEET_CONFIG.clientSecret,
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
} 