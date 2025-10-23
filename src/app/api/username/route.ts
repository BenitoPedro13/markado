import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getOrgDomainConfigFromHostname } from "@/lib/orgDomains";
import { checkUsername } from "@/packages/lib/server/checkUsername";

const bodySchema = z.object({
  username: z.string(),
  orgSlug: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, orgSlug } = bodySchema.parse(body);

    const hostname = request.headers.get("host") || "";
    const { currentOrgDomain } = getOrgDomainConfigFromHostname({ hostname });

    const result = await checkUsername(username, currentOrgDomain || orgSlug || null);
    return NextResponse.json(result);
  } catch (err: unknown) {
    // On validation or other errors, return a safe response shape
    return NextResponse.json(
      { available: false, premium: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
