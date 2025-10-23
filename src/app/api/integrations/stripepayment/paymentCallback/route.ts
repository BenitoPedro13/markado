import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { handlePaymentCallbackRequest } from "@/packages/app-store/stripepayment/api/paymentCallback";
import { getServerErrorFromUnknown } from "@/packages/lib/server/getServerErrorFromUnknown";

import { mapSearchParamsToQuery } from "../utils";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const query = mapSearchParamsToQuery(req.nextUrl.searchParams);
    const result = await handlePaymentCallbackRequest({ method: req.method, query, url: req.nextUrl.toString() });

    if (result.redirectUrl) {
      return NextResponse.redirect(result.redirectUrl, result.status || 302);
    }

    return NextResponse.json(result.body ?? {}, { status: result.status });
  } catch (_err) {
    const err = getServerErrorFromUnknown(_err);

    return NextResponse.json(
      {
        message: err.message,
        url: err.url,
        method: err.method,
        stack: IS_PRODUCTION ? undefined : err.stack,
      },
      { status: err.statusCode ?? 500 },
    );
  }
}
