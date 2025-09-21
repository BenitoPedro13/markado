import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { handleAddRequest } from "@/packages/app-store/stripepayment/api/add";
import { getErrorFromUnknown } from "@/packages/lib/errors";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const result = await handleAddRequest({
      method: req.method,
      state: req.nextUrl.searchParams.get("state"),
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
