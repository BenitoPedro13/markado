import { getAppFromLocationValue } from "@/packages/app-store/utils";
import { prisma } from "@/lib/prisma";
import { eventTypeLocations as eventTypeLocationsSchema } from "~/prisma/zod-utils";

const getBulkEventTypes = async (userId: string) => {
  const eventTypes = await prisma.eventType.findMany({
    where: {
      userId,
      team: null,
    },
    select: {
      id: true,
      title: true,
      locations: true,
    },
  });

  const eventTypesWithLogo = eventTypes.map((eventType) => {
    const locationParsed = eventTypeLocationsSchema.safeParse(eventType.locations);

    // some events has null as location for legacy reasons, so this fallbacks to daily video
    const app = getAppFromLocationValue(
      locationParsed.success && locationParsed.data?.[0]?.type
        ? locationParsed.data[0].type
        : 'integrations:google:meet'
    );
    return {
      ...eventType,
      logo: app?.logo,
    };
  });

  return {
    eventTypes: eventTypesWithLogo,
  };
};

export default getBulkEventTypes;
