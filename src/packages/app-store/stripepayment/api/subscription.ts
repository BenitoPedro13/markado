import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";

import { getPremiumMonthlyPlanPriceId } from "@/packages/app-store/stripepayment/lib/utils";
// import { checkPremiumUsername } from "@/features/ee/common/lib/checkPremiumUsername";
import { WEBAPP_URL } from "@/constants";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "~/prisma/app/generated/prisma/client";

import { getStripeCustomerIdFromUserId } from "../lib/customer";
import stripe from "../lib/server";
import { auth } from "@/auth";

import type { StripeApiHandlerResult } from "./types";

interface HandleSubscriptionRequestOptions {
  method?: string;
  intentUsername?: string | string[] | null;
  callbackUrl?: string | string[] | null;
}

export async function handleSubscriptionRequest({ method, intentUsername = null, callbackUrl = null }: HandleSubscriptionRequestOptions): Promise<StripeApiHandlerResult<{ message: string }>> {
  if (method !== "GET") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !intentUsername) {
    return {
      status: 404,
      body: { message: "Missing user or intent username" },
    };
  }

  const normalizedIntentUsername = Array.isArray(intentUsername) ? intentUsername[0] : intentUsername;

  const customerId = await getStripeCustomerIdFromUserId(userId);
  if (!customerId) {
    return {
      status: 404,
      body: { message: "Missing customer id" },
    };
  }

  const userData = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, metadata: true },
  });
  if (!userData) {
    return {
      status: 404,
      body: { message: "Missing user data" },
    };
  }

  const normalizedCallbackUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
  const return_url = `${WEBAPP_URL}/api/integrations/stripepayment/paymentCallback?checkoutSessionId={CHECKOUT_SESSION_ID}&callbackUrl=${normalizedCallbackUrl}`;
  const createSessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price: getPremiumMonthlyPlanPriceId(),
      },
    ],
    allow_promotion_codes: true,
    customer: customerId,
    success_url: return_url,
    cancel_url: return_url,
  };

  const stripeCustomer = await stripe.customers.retrieve(customerId);
  if (!stripeCustomer || stripeCustomer.deleted) {
    return {
      status: 400,
      body: { message: "Stripe customer not found or deleted" },
    };
  }

  await stripe.customers.update(customerId, {
    metadata: {
      ...stripeCustomer.metadata,
      username: normalizedIntentUsername,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      metadata: {
        ...((userData.metadata as Prisma.JsonObject) || {}),
        isPremium: false,
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create(createSessionParams);
  if (checkoutSession && checkoutSession.url) {
    return {
      status: 302,
      redirectUrl: checkoutSession.url,
    };
  }

  return {
    status: 404,
    body: { message: "Couldn't redirect to stripe checkout session" },
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await handleSubscriptionRequest({
    method: req.method,
    intentUsername: req.query.intentUsername ?? null,
    callbackUrl: req.query.callbackUrl ?? null,
  });

  if (result.redirectUrl) {
    res.redirect(result.status || 302, result.redirectUrl);
    return;
  }

  res.status(result.status).json(result.body ?? {});
}
