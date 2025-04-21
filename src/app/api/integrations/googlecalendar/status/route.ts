import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/utils/encryption';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ isAuthenticated: false });
    }

    // Get user's Google Calendar tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
        selectedCalendarId: true,
      },
    });

    // Check if user has valid tokens
    const hasValidTokens = user?.googleAccessToken && user?.googleRefreshToken;
    const tokenExpired = user?.googleTokenExpiry ? Number(user.googleTokenExpiry) < Date.now() : false;

    // If tokens are missing or expired, user is not authenticated
    if (!hasValidTokens || tokenExpired) {
      return NextResponse.json({ isAuthenticated: false });
    }

    // User is authenticated
    return NextResponse.json({
      isAuthenticated: true,
      selectedCalendarId: user.selectedCalendarId,
    });
  } catch (error) {
    console.error('Error checking Google Calendar status:', error);
    return NextResponse.json({ isAuthenticated: false, error: 'Failed to check authentication status' });
  }
} 