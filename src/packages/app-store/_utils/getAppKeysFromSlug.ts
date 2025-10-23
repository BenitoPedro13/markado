import type { Prisma } from "~/prisma/app/generated/prisma/client";

import {prisma} from "@/lib/prisma";

async function getAppKeysFromSlug(slug: string) {
  const app = await prisma.app.findUnique({ where: { slug } });
  return (app?.keys || {}) as Prisma.JsonObject;
}

export default getAppKeysFromSlug;
