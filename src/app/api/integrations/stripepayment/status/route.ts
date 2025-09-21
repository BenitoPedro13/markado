import { NextResponse } from "next/server";

import { IS_PRODUCTION } from "@/constants";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getErrorFromUnknown } from "@/packages/lib/errors";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          connected: false,
          credentialId: null,
        },
        { status: 401 },
      );
    }

    const credential = await prisma.credential.findFirst({
      where: {
        userId: session.user.id,
        appId: "stripe",
        invalid: false,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        connected: Boolean(credential),
        credentialId: credential?.id ?? null,
      },
      { status: 200 },
    );
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
