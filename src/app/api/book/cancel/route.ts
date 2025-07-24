import { NextRequest, NextResponse } from "next/server";
import handleCancelBooking from "@/packages/features/bookings/lib/handleCancelBooking";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const req = {
      body,
      userId: session?.user?.id || "0",
      method: "POST",
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    } as any;

    const result = await handleCancelBooking(req);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/book/cancel:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: error?.statusCode || 500 }
    );
  }
} 