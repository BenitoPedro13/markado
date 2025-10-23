import {prisma as defaultPrisma} from "@/lib/prisma";
import type { PrismaClient } from "~/prisma/app/generated/prisma/client";
import type { WebhookTriggerEvents } from "~/prisma/enums";

export type GetSubscriberOptions = {
  userId?: string | null;
  eventTypeId?: number | null;
  triggerEvent: WebhookTriggerEvents;
  teamId?: number | number[] | null;
  orgId?: number | null;
  oAuthClientId?: string | null;
};

const getWebhooks = async (options: GetSubscriberOptions, prisma: PrismaClient = defaultPrisma) => {
  const teamId = options.teamId;
  const userId = options.userId ?? "";
  const eventTypeId = options.eventTypeId ?? 0;
  const teamIds = Array.isArray(teamId) ? teamId : [teamId ?? 0];
  const orgId = options.orgId ?? 0;
  const oAuthClientId = options.oAuthClientId ?? "";

  // if we have userId and teamId it is a managed event type and should trigger for team and user
  const allWebhooks = await prisma.webhook.findMany({
    where: {
      OR: [
        {
          platform: true,
        },
        {
          userId,
        },
        {
          eventTypeId,
        },
        {
          teamId: {
            in: [...teamIds, orgId],
          },
        },
        { platformOAuthClientId: oAuthClientId },
      ],
      AND: {
        eventTriggers: {
          has: options.triggerEvent,
        },
        active: {
          equals: true,
        },
      },
    },
    select: {
      id: true,
      subscriberUrl: true,
      payloadTemplate: true,
      appId: true,
      secret: true,
      time: true,
      timeUnit: true,
      eventTriggers: true,
    },
  });

  return allWebhooks;
};

export default getWebhooks;
