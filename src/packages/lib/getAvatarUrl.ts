import { z } from "zod";

import { AVATAR_FALLBACK, MARKADO_URL } from "@/constants";
import type { User } from "~/prisma/app/generated/prisma/client";

/**
 * Gives an organization aware avatar url for a user
 * It ensures that the wrong avatar isn't fetched by ensuring that organizationId is always passed
 * It should always return a fully formed url
 */
export const getUserAvatarUrl = (user: Pick<User, "image"> | undefined) => {
  if (user?.image) {
    // const isAbsoluteUrl = z.string().url().safeParse(user.image).success;
    // if (isAbsoluteUrl) {
    //   return user.image;
    // } else {
    //   return CAL_URL + user.image;
    // }
      return user.image;
  }
  
  return MARKADO_URL + AVATAR_FALLBACK;
};
