import type { LocationObject } from "@/core/locations";
import { getAppFromSlug } from "@/packages/app-store/utils";
import getBulkEventTypes from "@/packages/event-types/getBulkEventTypes";
import {prisma} from "@/lib/prisma";
import { userMetadata } from "~/prisma/zod-utils";

const setDefaultConferencingApp = async (userId: string, appSlug: string) => {
  const eventTypes = await getBulkEventTypes(userId);
  const eventTypeIds = eventTypes.eventTypes.map((item) => item.id);
  const foundApp = getAppFromSlug(appSlug);
  const appType = foundApp?.appData?.location?.type;

  if (!appType) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      metadata: true,
      credentials: true,
    },
  });

  const currentMetadata = userMetadata.parse(user?.metadata);
  const credentialId = user?.credentials.find((item) => item.appId == appSlug)?.id;

  //Update the default conferencing app for the user.
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      metadata: {
        ...currentMetadata,
        defaultConferencingApp: {
          appSlug,
        },
      },
    },
  });

  await prisma.eventType.updateMany({
    where: {
      id: {
        in: eventTypeIds,
      },
      userId,
    },
    data: {
      locations: [{ type: appType, credentialId }] as LocationObject[],
    },
  });
};
export default setDefaultConferencingApp;
