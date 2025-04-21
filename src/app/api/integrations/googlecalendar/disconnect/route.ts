import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear Google Calendar tokens and selected calendar
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
        selectedCalendarId: null,
      },
    });

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting from Google Calendar:', error);
    return NextResponse.json({ error: 'Failed to disconnect from Google Calendar' }, { status: 500 });
  }
} 