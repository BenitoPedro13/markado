/**
 * @deprecated
 * This file is deprecated. The only use of this file is to seed the database for E2E tests. Each test should take care of seeding it's own data going forward.
 */
// import type { Prisma } from "./app/generated/prisma/client";
const dotEnv = require("dotenv");

// const { appStoreMetadata } = require("../src/packages/app-store/bookerApps.metadata.generated");
const { PrismaClient } = require("./app/generated/prisma/client/index.js");
const prisma = new PrismaClient();
// import { AppCategories } from "./enums";

dotEnv.config({ path: "../.env" });

async function createApp(
  slug,
  // : Prisma.AppCreateInput["slug"],
  /** The directory name for `/packages/app-store/[dirName]` */
  dirName,
  // : Prisma.AppCreateInput["dirName"],
  categories,
  // : Prisma.AppCreateInput["categories"],
  /** This is used so credentials gets linked to the correct app */
  type,
  // : Prisma.CredentialCreateInput["type"],
  keys,
  // ?: Prisma.AppCreateInput["keys"],
  isTemplate,
  // ?: boolean
) {
  try {
    const foundApp = await prisma.app.findFirst({
      where: {
        OR: [
          {
            slug,
          },
          {
            dirName,
          },
        ],
      },
    });

    // We need to enable seeded apps as they are used in tests.
    const data = { slug, dirName, categories, keys, enabled: true };

    if (!foundApp) {
      await prisma.app.create({
        data,
      });
      console.log(`📲 Created ${isTemplate ? "template" : "app"}: '${slug}'`);
    } else {
      await prisma.app.update({
        where: { slug: foundApp.slug },
        data,
      });
      await prisma.app.update({
        where: { dirName: foundApp.dirName },
        data,
      });
      console.log(`📲 Updated ${isTemplate ? "template" : "app"}: '${slug}'`);
    }

    await prisma.credential.updateMany({
      where: { type },
      data: { appId: slug },
    });
  } catch (e) {
    console.log(`Could not upsert app: ${slug}. Error:`, e);
  }
}

async function main() {
  // Calendar apps
  // await createApp("apple-calendar", "applecalendar", ["calendar"], "apple_calendar");
  // await createApp("caldav-calendar", "caldavcalendar", ["calendar"], "caldav_calendar");
  try {
    const { client_secret, client_id, redirect_uris } = JSON.parse(
      process.env.GOOGLE_API_CREDENTIALS || ""
    ).web;
    await createApp("google-calendar", "googlecalendar", ["calendar"], "google_calendar", {
      client_id,
      client_secret,
      redirect_uris,
    });
    await createApp("google-meet", "googlevideo", ["conferencing"], "google_video", {
      client_id,
      client_secret,
      redirect_uris,
    });
  } catch (e) {
    if (e instanceof Error) console.error("Error adding google credentials to DB:", e.message);
  }
  // if (process.env.MS_GRAPH_CLIENT_ID && process.env.MS_GRAPH_CLIENT_SECRET) {
  //   await createApp("office365-calendar", "office365calendar", ["calendar"], "office365_calendar", {
  //     client_id: process.env.MS_GRAPH_CLIENT_ID,
  //     client_secret: process.env.MS_GRAPH_CLIENT_SECRET,
  //   });
  //   await createApp("msteams", "office365video", ["conferencing"], "office365_video", {
  //     client_id: process.env.MS_GRAPH_CLIENT_ID,
  //     client_secret: process.env.MS_GRAPH_CLIENT_SECRET,
  //   });
  // }

  // Payment apps
  if (
    process.env.STRIPE_CLIENT_ID &&
    process.env.STRIPE_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.PAYMENT_FEE_FIXED &&
    process.env.PAYMENT_FEE_PERCENTAGE
  ) {
    await createApp("stripe", "stripepayment", ["payment"], "stripe_payment", {
      client_id: process.env.STRIPE_CLIENT_ID,
      client_secret: process.env.STRIPE_PRIVATE_KEY,
      payment_fee_fixed: Number(process.env.PAYMENT_FEE_FIXED),
      payment_fee_percentage: Number(process.env.PAYMENT_FEE_PERCENTAGE),
      public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    });
  }
}
module.exports = async function () {
  try {
    await main();
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
