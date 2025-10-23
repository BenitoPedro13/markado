import type { NextApiRequest, NextApiResponse } from "next";
import stringify from "qs-stringify";
import type Stripe from "stripe";
import { z } from "zod";

import { WEBAPP_URL } from "@/constants";
import { prisma } from "@/lib/prisma";

import { getStripeAppKeys } from "../lib/getStripeAppKeys";
import { auth } from "@/auth";

import type { StripeApiHandlerResult } from "./types";

interface HandleAddRequestOptions {
  method?: string;
  state?: string | string[] | null;
}

export async function handleAddRequest({ method, state }: HandleAddRequestOptions): Promise<StripeApiHandlerResult<{ url: string } | { message: string }>> {
  if (method !== "GET") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const { client_id } = await getStripeAppKeys();
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      email: true,
      name: true,
    },
  });

  const redirect_uri = encodeURI(`${WEBAPP_URL}/api/integrations/stripepayment/callback`);
  const stripeConnectParams: Stripe.OAuthAuthorizeUrlParams = {
    client_id,
    scope: "read_write",
    response_type: "code",
    stripe_user: {
      email: user?.email,
      first_name: user?.name || undefined,
      /** We need this so E2E don't fail for international users */
      country: process.env.NEXT_PUBLIC_IS_E2E ? "US" : undefined,
    },
    redirect_uri,
    state: typeof state === "string" ? state : undefined,
  };

  const params = z.record(z.any()).parse(stripeConnectParams);
  const query = stringify(params);

  const url = `https://connect.stripe.com/oauth/authorize?${query}`;

  return {
    status: 200,
    body: { url },
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await handleAddRequest({ method: req.method, state: req.query.state ?? null });

  if (result.redirectUrl) {
    res.redirect(result.status || 302, result.redirectUrl);
    return;
  }

  res.status(result.status).json(result.body ?? {});
}
