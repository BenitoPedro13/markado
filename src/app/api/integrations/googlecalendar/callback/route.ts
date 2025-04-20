import { NextRequest, NextResponse } from 'next/server';
import {auth} from '@/auth';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';
import { encrypt } from '@/utils/encryption';

import { prisma } from '@/lib/prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  try {

    const session = await auth();
    if (!session?.user) {
      console.log('No session found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }


    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/sign-up/calendar?error=no_code', request.url)
      );
    }

    const {tokens} = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL('/sign-up/calendar?error=no_refresh_token', request.url)
      );
    }

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(tokens.access_token || '');
    const encryptedRefreshToken = encrypt(tokens.refresh_token);

    // Get user's calendars
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    const {data: calendarList} = await calendar.calendarList.list();

    // Store tokens and calendar list
    // Then for each calendar, use upsert instead of create

    await prisma.user.update({
      where: {id: session.user.id},
      data: {
        googleAccessToken: encryptedAccessToken,
        googleRefreshToken: encryptedRefreshToken,
        googleTokenExpiry: tokens.expiry_date || 0
      }
    });

    if (!calendarList.items) {
      console.log('No calendars found from Google');
      return NextResponse.redirect(new URL('/sign-up/calendar?error=no_calendars', request.url));
    }

    for (const cal of calendarList.items) {
      await prisma.calendar.upsert({
        where: {
          // Use a unique identifier or composite unique fields
          googleId_userId: {
            googleId: cal.id || '',
            userId: session.user.id
          }
        },
        update: {
          name: cal.summary || '',
          description: cal.description || null,
          primary: cal.primary || false
          // Any other fields to update
        },
        create: {
          googleId: cal.id || '',
          name: cal.summary || '',
          description: cal.description || null,
          primary: cal.primary || false,
          userId: session.user.id
          // Any other fields to create
        }
      });
    }


    return NextResponse.redirect(
      new URL('/sign-up/calendar', request.url)
    );
  } catch (error) {
    console.error('Error in Google Calendar callback:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.redirect(new URL('/sign-up/calendar?error=server_error', request.url));
  }
} 