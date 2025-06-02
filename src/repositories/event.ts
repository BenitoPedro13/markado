import { getPublicEvent } from "@/packages/features/eventtypes/lib/getPublicEvent";
import {prisma} from "@/lib/prisma";
import type { TEventInputSchema } from "~/trpc/server/schemas/events.schema";

export class EventRepository {
  static async getPublicEvent(input: TEventInputSchema, userId?: string) {
    const event = await getPublicEvent(
      input.username,
      input.eventSlug,
      input.isTeamEvent,
      input.org,
      prisma,
      input.fromRedirectOfNonOrgLink,
      userId
    );
    return event;
  }
}
