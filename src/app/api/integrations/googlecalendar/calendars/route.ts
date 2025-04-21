import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';
import { decrypt } from '@/utils/encryption';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Fetch user's calendars
    const { data: calendarList } = await calendar.calendarList.list();

    // Return calendars
    return NextResponse.json({ calendars: calendarList.items || [] });
  } catch (error) {
    console.error('Error fetching Google Calendars:', error);
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 });
  }
} 