import type { NextApiRequest, NextApiResponse } from "next";

import { WEBAPP_URL } from "@/constants";
import { getSafeRedirectUrl } from "@/packages/lib/getSafeRedirectUrl";

import { getStripeCustomerIdFromUserId } from "../lib/customer";
import stripe from "../lib/server";
import { auth } from "@/auth";

import type { StripeApiHandlerResult } from "./types";

interface HandlePortalRequestOptions {
  method?: string;
  returnTo?: string | string[] | null;
}

export async function handlePortalRequest({ method, returnTo }: HandlePortalRequestOptions): Promise<StripeApiHandlerResult<{ message: string }>> {
  if (method !== "POST" && method !== "GET") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 401,
      body: { message: "Not authenticated" },
    };
  }

  const customerId = await getStripeCustomerIdFromUserId(session.user.id);
  if (!customerId) {
    return {
      status: 400,
      body: { message: "CustomerId not found in stripe" },
    };
  }

  let return_url = `${WEBAPP_URL}/settings/billing`;

  if (typeof returnTo === "string") {
    const safeRedirectUrl = getSafeRedirectUrl(returnTo);
    if (safeRedirectUrl) return_url = safeRedirectUrl;
  }

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url,
  });

  return {
    status: 302,
    redirectUrl: stripeSession.url,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await handlePortalRequest({ method: req.method, returnTo: req.query.returnTo ?? null });

  if (result.redirectUrl) {
    res.redirect(result.status || 302, result.redirectUrl);
    return;
  }

  res.status(result.status).json(result.body ?? {});
}
