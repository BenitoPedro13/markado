import { NextRequest, NextResponse } from 'next/server';
import {auth} from '@/auth';

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
    console.log('Google Calendar callback received');
    console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

    const session = await auth();
    if (!session?.user) {
      console.log('No session found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    console.log('User authenticated:', session.user.id);

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    console.log('Authorization code received:', code ? 'Yes' : 'No');

    if (!code) {
      console.log('No code provided in callback');
      return NextResponse.redirect(
        new URL('/sign-up/calendar?error=no_code', request.url)
      );
    }

    console.log('Getting tokens from Google...');
    const {tokens} = await oauth2Client.getToken(code);
    console.log('Tokens received:', tokens ? 'Yes' : 'No');

    if (!tokens.refresh_token) {
      console.log('No refresh token received');
      return NextResponse.redirect(
        new URL('/sign-up/calendar?error=no_refresh_token', request.url)
      );
    }

    // Encrypt tokens before storing
    console.log('Encrypting tokens...');
    const encryptedAccessToken = encrypt(tokens.access_token || '');
    const encryptedRefreshToken = encrypt(tokens.refresh_token);

    // Get user's calendars
    console.log('Setting credentials and fetching calendars...');
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    const {data: calendarList} = await calendar.calendarList.list();
    console.log('Calendars fetched:', calendarList.items?.length || 0);

    // Store tokens and calendar list
    console.log('Updating user with tokens and calendars...');
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

    console.log('User updated successfully');

    return NextResponse.redirect(
      new URL('/sign-up/calendar/select', request.url)
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