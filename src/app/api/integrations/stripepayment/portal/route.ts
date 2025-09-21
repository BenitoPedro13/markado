import { NextRequest, NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { handlePortalRequest } from "@/packages/app-store/stripepayment/api/portal";
import { getErrorFromUnknown } from "@/packages/lib/errors";

import { mapSearchParamsToQuery } from "../utils";

export const runtime = "nodejs";

async function processRequest(req: NextRequest) {
  const query = mapSearchParamsToQuery(req.nextUrl.searchParams);
  const result = await handlePortalRequest({ method: req.method, returnTo: query.returnTo ?? null });

  if (result.redirectUrl) {
    return NextResponse.redirect(result.redirectUrl, result.status || 302);
  }

  return NextResponse.json(result.body ?? {}, { status: result.status });
}

export async function GET(req: NextRequest) {
  try {
    return await processRequest(req);
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

export async function POST(req: NextRequest) {
  try {
    return await processRequest(req);
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
