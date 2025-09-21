import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { handleSubscriptionRequest } from "@/packages/app-store/stripepayment/api/subscription";
import { getErrorFromUnknown } from "@/packages/lib/errors";

import { mapSearchParamsToQuery } from "../utils";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const query = mapSearchParamsToQuery(req.nextUrl.searchParams);
    const result = await handleSubscriptionRequest({
      method: req.method,
      intentUsername: query.intentUsername ?? null,
      callbackUrl: query.callbackUrl ?? null,
    });

    if (result.redirectUrl) {
      return NextResponse.redirect(result.redirectUrl, result.status || 302);
    }

    return NextResponse.json(result.body ?? {}, { status: result.status });
  } catch (_err) {
    const err = getErrorFromUnknown(_err);

    return NextResponse.json(
      {
        message: err.message,
        stack: IS_PRODUCTION ? undefined : err.stack,
      },
      { status: err.statusCode ?? 500 },
    );
  }
}
