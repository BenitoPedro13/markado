import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

const stripe =
  globalThis.stripe ||
  new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2025-05-28.basil",
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.stripe = stripe;
}

export default stripe;
