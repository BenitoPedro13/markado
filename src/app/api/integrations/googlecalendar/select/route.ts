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

    // Parse request body
    const body = await request.json();
    const { calendarId } = body;

    if (!calendarId) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    // Update user's selected calendar
    await prisma.user.update({
      where: { id: session.user.id },
      data: { selectedCalendarId: calendarId },
    });

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error selecting Google Calendar:', error);
    return NextResponse.json({ error: 'Failed to select calendar' }, { status: 500 });
  }
} 