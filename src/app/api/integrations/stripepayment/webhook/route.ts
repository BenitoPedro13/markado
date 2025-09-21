import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { processStripeWebhook } from "@/packages/core/payments/api/webhook";
import { getErrorFromUnknown } from "@/packages/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    const result = await processStripeWebhook({ payload, signature });

    return NextResponse.json(result.body, { status: result.statusCode });
  } catch (_err) {
    const err = getErrorFromUnknown(_err);
    console.error(`Webhook Error: ${err.message}`);

    return NextResponse.json(
      {
        message: err.message,
        stack: IS_PRODUCTION ? undefined : err.stack,
      },
      { status: err.statusCode ?? 500 },
    );
  }
}
