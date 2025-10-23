import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { getCustomerAndCheckoutSession } from "@/packages/app-store/stripepayment/lib/getCustomerAndCheckoutSession";
import { WEBAPP_URL } from "@/constants";
import { HttpError } from "@/packages/lib/http-error";
import { getServerErrorFromUnknown } from "@/packages/lib/server/getServerErrorFromUnknown";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "~/prisma/app/generated/prisma/client";

import type { StripeApiHandlerResult } from "./types";

const querySchema = z.object({
  callbackUrl: z.string().transform((url) => {
    if (url.search(/^https?:\/\//) === -1) {
      url = `${WEBAPP_URL}${url}`;
    }
    return new URL(url);
  }),
  checkoutSessionId: z.string(),
});

export async function handlePaymentCallbackRequest({
  method,
  query,
  url,
}: {
  method?: string;
  query: NextApiRequest["query"];
  url?: string;
}): Promise<StripeApiHandlerResult<{ message: string }>> {
  if (method !== "GET") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const { callbackUrl, checkoutSessionId } = querySchema.parse({
    callbackUrl: Array.isArray(query.callbackUrl) ? query.callbackUrl[0] : query.callbackUrl,
    checkoutSessionId: Array.isArray(query.checkoutSessionId)
      ? query.checkoutSessionId[0]
      : query.checkoutSessionId,
  });
  const { stripeCustomer, checkoutSession } = await getCustomerAndCheckoutSession(checkoutSessionId);

  if (!stripeCustomer)
    throw new HttpError({
      statusCode: 404,
      message: "Stripe customer not found or deleted",
      url,
      method,
    });

  // first let's try to find user by metadata stripeCustomerId
  let user = await prisma.user.findFirst({
    where: {
      metadata: {
        path: ["stripeCustomerId"],
        equals: stripeCustomer.id,
      },
    },
  });

  if (!user && stripeCustomer.email) {
    // if user not found, let's try to find user by email
    user = await prisma.user.findFirst({
      where: {
        email: stripeCustomer.email,
      },
    });
  }

  if (!user)
    throw new HttpError({ statusCode: 404, message: "User not found", url, method });

  if (checkoutSession.payment_status === "paid" && stripeCustomer.metadata.username) {
    try {
      await prisma.user.update({
        data: {
          username: stripeCustomer.metadata.username,
          metadata: {
            ...(user.metadata as Prisma.JsonObject),
            isPremium: true,
          },
        },
        where: {
          id: user.id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpError({
        statusCode: 400,
        url,
        method,
        message:
          "We have received your payment. Your premium username could still not be reserved. Please contact suporte@markado.co and mention your premium username",
      });
    }
  }
  callbackUrl.searchParams.set("paymentStatus", checkoutSession.payment_status);
  return {
    status: 302,
    redirectUrl: callbackUrl.toString(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await handlePaymentCallbackRequest({ method: req.method, query: req.query, url: req.url ?? undefined });

    if (result.redirectUrl) {
      res.redirect(result.status || 302, result.redirectUrl);
      return;
    }

    res.status(result.status).json(result.body ?? {});
  } catch (error) {
    const serverError = getServerErrorFromUnknown(error);
    res.status(serverError.statusCode).json({
      message: serverError.message,
      url: serverError.url,
      method: serverError.method,
    });
  }
}
