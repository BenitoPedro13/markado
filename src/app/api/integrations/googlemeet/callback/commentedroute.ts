import { NextRequest, NextResponse } from 'next/server';
import {auth} from '@/auth';
import { google } from 'googleapis';
import { encrypt } from '@/utils/encryption';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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
        new URL('/sign-up/conferencing?error=no_code', request.url)
      );
    }

    const {tokens} = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL('/sign-up/conferencing?error=no_refresh_token', request.url)
      );
    }

    // Since we're using the same OAuth client for both Calendar and Meet,
    // we'll store the tokens in the same fields
    await prisma.user.update({
      where: {id: session.user.id},
      data: {
        googleAccessToken: encrypt(tokens.access_token || ''),
        googleRefreshToken: encrypt(tokens.refresh_token),
        googleTokenExpiry: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        googleMeetEnabled: true
      }
    });

    return NextResponse.redirect(
      new URL('/sign-up/conferencing?success=true', request.url)
    );
  } catch (error) {
    console.error('Error in Google Meet callback:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.redirect(new URL('/sign-up/conferencing?error=server_error', request.url));
  }
} 