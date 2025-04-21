import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';
import { decrypt } from '@/utils/encryption';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { calendarId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calendarId } = params;

    // Get user's Google Calendar tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
      },
    });

    // Check if user has valid tokens
    if (!user?.googleAccessToken || !user?.googleRefreshToken) {
      return NextResponse.json({ error: 'Not authenticated with Google Calendar' }, { status: 401 });
    }

    // Decrypt tokens
    const accessToken = decrypt(user.googleAccessToken);
    const refreshToken = decrypt(user.googleRefreshToken);

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: user.googleTokenExpiry ? Number(user.googleTokenExpiry) : undefined,
    });

    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const syncToken = searchParams.get('syncToken');

    // Prepare parameters for the API call
    const apiParams: any = {
      calendarId,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    };

    // Add time range if provided
    if (startDate) {
      apiParams.timeMin = startDate;
    } else {
      // Default to current time if no start date provided
      apiParams.timeMin = new Date().toISOString();
    }

    if (endDate) {
      apiParams.timeMax = endDate;
    }

    // Add sync token if provided (for incremental sync)
    if (syncToken) {
      apiParams.syncToken = syncToken;
    }

    // Fetch events
    const { data } = await calendar.events.list(apiParams);

    // Return events and next sync token
    return NextResponse.json({
      events: data.items || [],
      nextSyncToken: data.nextSyncToken,
    });
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    
    // Handle specific error cases
    if (error.code === 404) {
      console.error('Calendar not found or access denied:', {
        calendarId: params.calendarId,
        error: error.message,
        status: error.status,
        errors: error.errors
      });
      return NextResponse.json({ 
        error: 'Calendar not found or access denied', 
        details: error.message,
        code: 404 
      }, { status: 404 });
    }
    
    // Handle sync token expiration
    if (error.code === 410) {
      return NextResponse.json({ error: 'Sync token expired', code: 410 }, { status: 410 });
    }
    
    // Handle authentication errors
    if (error.code === 401 || error.code === 403) {
      console.error('Authentication error:', {
        code: error.code,
        message: error.message
      });
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: error.message,
        code: error.code 
      }, { status: error.code });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch events',
      details: error.message,
      code: error.code || 500
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { calendarId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calendarId } = params;

    // Get user's Google Calendar tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
      },
    });

    // Check if user has valid tokens
    if (!user?.googleAccessToken || !user?.googleRefreshToken) {
      return NextResponse.json({ error: 'Not authenticated with Google Calendar' }, { status: 401 });
    }

    // Decrypt tokens
    const accessToken = decrypt(user.googleAccessToken);
    const refreshToken = decrypt(user.googleRefreshToken);

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: user.googleTokenExpiry ? Number(user.googleTokenExpiry) : undefined,
    });

    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse request body
    const eventData = await request.json();

    // Create event
    const { data } = await calendar.events.insert({
      calendarId,
      requestBody: eventData,
    });

    // Return created event
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 