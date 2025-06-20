import getWebhooks from "@/packages/features/webhooks/lib/getWebhooks";
import type { GetSubscriberOptions } from "@/packages/features/webhooks/lib/getWebhooks";
import sendPayload from "@/packages/features/webhooks/lib/sendPayload";
import { isEventPayload, type WebhookPayloadType } from "@/packages/features/webhooks/lib/sendPayload";
import logger from "@/packages/lib/logger";
import { safeStringify } from "@/lib/safeStringify";

export async function handleWebhookTrigger(args: {
  subscriberOptions: GetSubscriberOptions;
  eventTrigger: string;
  webhookData: WebhookPayloadType;
}) {
  try {
    const subscribers = await getWebhooks(args.subscriberOptions);

    const promises = subscribers.map((sub) =>
      sendPayload(sub.secret, args.eventTrigger, new Date().toISOString(), sub, args.webhookData).catch(
        (e) => {
          if (isEventPayload(args.webhookData)) {
            logger.error(
              `Error executing webhook for event: ${args.eventTrigger}, URL: ${sub.subscriberUrl}, booking id: ${args.webhookData.bookingId}, booking uid: ${args.webhookData.uid}`,
              safeStringify(e)
            );
          }
        }
      )
    );
    await Promise.all(promises);
  } catch (error) {
    logger.error("Error while sending webhook", error);
  }
}
