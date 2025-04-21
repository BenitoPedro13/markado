import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';
import { decrypt } from '@/utils/encryption';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { calendarId: string; eventId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calendarId, eventId } = params;

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

    // Update event
    const { data } = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: eventData,
    });

    // Return updated event
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { calendarId: string; eventId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calendarId, eventId } = params;

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

    // Delete event
    await calendar.events.delete({
      calendarId,
      eventId,
    });

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 