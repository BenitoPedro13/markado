import type { Prisma } from "~/prisma/app/generated/prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";

import getInstalledAppPath from "../../_utils/getInstalledAppPath";
import createOAuthAppCredential from "../../_utils/oauth/createOAuthAppCredential";
import { decodeOAuthState } from "../../_utils/oauth/decodeOAuthState";
import type { StripeData } from "../lib/server";
import stripe from "../lib/server";
import { auth } from "@/auth";

import type { StripeApiHandlerResult } from "./types";

function getReturnToValueFromQueryState(req: NextApiRequest) {
  let returnTo = "";
  try {
    returnTo = JSON.parse(`${req.query.state}`).returnTo;
  } catch (error) {
    console.info("No 'returnTo' in req.query.state");
  }
  return returnTo;
}

interface HandleCallbackRequestOptions {
  method?: string;
  query: NextApiRequest["query"];
}

export async function handleCallbackRequest({ method, query }: HandleCallbackRequestOptions): Promise<StripeApiHandlerResult<{ message: string }>> {
  if (method !== "GET") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const session = await auth();
  const reqLike = { query } as unknown as NextApiRequest;
  const { code, error, error_description } = query;
  const state = decodeOAuthState(reqLike);

  if (error) {
    if (error === "access_denied") {
      return {
        status: 302,
        redirectUrl: state?.onErrorReturnTo || "/apps/installed/payment",
      };
    }
    const queryString = stringify({ error, error_description });
    return {
      status: 302,
      redirectUrl: `/apps/installed?${queryString}`,
    };
  }

  if (!session?.user?.id) {
    return {
      status: 401,
      body: { message: "You must be logged in to do this" },
    };
  }

  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code: Array.isArray(code) ? code[0] : code?.toString(),
  });

  const data: StripeData = { ...response, default_currency: "" };
  if (response["stripe_user_id"]) {
    const account = await stripe.accounts.retrieve(response["stripe_user_id"]);
    data["default_currency"] = account.default_currency!;
  }

  await createOAuthAppCredential(
    { appId: "stripe", type: "stripe_payment" },
    data as unknown as Prisma.InputJsonObject,
    reqLike
  );

  const returnTo = state?.returnTo || getReturnToValueFromQueryState(reqLike);
  return {
    status: 302,
    redirectUrl: returnTo || getInstalledAppPath({ variant: "payment", slug: "stripe" }),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await handleCallbackRequest({ method: req.method, query: req.query });

  if (result.redirectUrl) {
    res.redirect(result.status || 302, result.redirectUrl);
    return;
  }

  res.status(result.status).json(result.body ?? {});
}
