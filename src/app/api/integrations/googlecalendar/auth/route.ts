import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GOOGLE_CALENDAR_CONFIG } from '@/config/googleCalendar';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting Google Calendar auth process...');
    
    const session = await auth();
    console.log('Session check result:', session ? 'Session found' : 'No session');
    
    if (!session?.user) {
      console.log('No session found, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Construct the Google OAuth URL
    console.log('Constructing Google OAuth URL...');
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    // Add required parameters
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    console.log('Environment variables check:', {
      hasClientId: !!clientId,
      hasRedirectUri: !!redirectUri,
      clientIdLength: clientId?.length,
      redirectUriLength: redirectUri?.length
    });
    
    authUrl.searchParams.append('client_id', clientId || '');
    authUrl.searchParams.append('redirect_uri', redirectUri || '');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', GOOGLE_CALENDAR_CONFIG.scopes.join(' '));
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    
    // Add state parameter for security
    const state = Buffer.from(JSON.stringify({ userId: session.user.id })).toString('base64');
    authUrl.searchParams.append('state', state);
    
    const finalUrl = authUrl.toString();
    console.log('Generated OAuth URL:', finalUrl);
    
    // Return the URL instead of redirecting
    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    console.error('Error in Google Calendar auth:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 