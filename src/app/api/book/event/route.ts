import { NextRequest, NextResponse } from "next/server";
import handleNewBooking from "@/packages/features/bookings/lib/handleNewBooking";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log('/api/book/event: session', session);
    
    // Get the request body
    const body = await request.json();
    
    // Create a mock NextApiRequest object to maintain compatibility
    const req = {
      body,
      userId: session?.user?.id || "0",
      method: "POST",
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    } as any;
    
    console.log('/api/book/event: req.userId', req.userId);
    
    const booking = await handleNewBooking(req);
    console.log('/api/book/event: booking', booking);
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error in /api/book/event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 