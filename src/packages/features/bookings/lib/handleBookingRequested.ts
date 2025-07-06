import type { Prisma } from "~/prisma/app/generated/prisma/client";

// import { sendAttendeeRequestEmailAndSMS, sendOrganizerRequestEmail } from "@/emails";
import { getWebhookPayloadForBooking } from "@/packages/features/bookings/lib/getWebhookPayloadForBooking";
import getWebhooks from "@/packages/features/webhooks/lib/getWebhooks";
import sendPayload from '@/packages/features/webhooks/lib/sendOrSchedulePayload';
import getOrgIdFromMemberOrTeamId from '@/packages/lib/getOrgIdFromMemberOrTeamId';
import logger from "@/packages/lib/logger";
import { safeStringify } from "@/lib/safeStringify";
import { WebhookTriggerEvents } from "~/prisma/enums";
import type { EventTypeMetadata } from "~/prisma/zod-utils";
import type { CalendarEvent } from "@/types/Calendar";

const log = logger.getSubLogger({ prefix: ["[handleBookingRequested] book:user"] });

/**
 * Supposed to do whatever is needed when a booking is requested.
 */
export async function handleBookingRequested(args: {
  evt: CalendarEvent;
  booking: {
    eventType: {
      team?: {
        parentId: number | null;
      } | null;
      currency: string;
      description: string | null;
      id: number;
      length: number;
      price: number;
      requiresConfirmation: boolean;
      title: string;
      teamId?: number | null;
      metadata: Prisma.JsonValue;
    } | null;
    eventTypeId: number | null;
    userId: string | null;
    id: number;
  };
}) {
  const { evt, booking } = args;

  log.debug("Emails: Sending booking requested emails");

  // await sendOrganizerRequestEmail({ ...evt }, booking?.eventType?.metadata as EventTypeMetadata);
  // await sendAttendeeRequestEmailAndSMS(
  //   { ...evt },
  //   evt.attendees[0],
  //   booking?.eventType?.metadata as EventTypeMetadata
  // );

  const orgId = await getOrgIdFromMemberOrTeamId({
    memberId: booking.userId,
    teamId: booking.eventType?.teamId,
  });

  try {
    const subscribersBookingRequested = await getWebhooks({
      userId: booking.userId,
      eventTypeId: booking.eventTypeId,
      triggerEvent: WebhookTriggerEvents.BOOKING_REQUESTED,
      teamId: booking.eventType?.teamId,
      orgId,
    });

    const webhookPayload = getWebhookPayloadForBooking({
      booking,
      evt,
    });

    const promises = subscribersBookingRequested.map((sub) =>
      sendPayload(
        sub.secret,
        WebhookTriggerEvents.BOOKING_REQUESTED,
        new Date().toISOString(),
        sub,
        webhookPayload
      ).catch((e) => {
        log.error(
          `Error executing webhook for event: ${WebhookTriggerEvents.BOOKING_REQUESTED}, URL: ${sub.subscriberUrl}, bookingId: ${evt.bookingId}, bookingUid: ${evt.uid}`,
          safeStringify(e)
        );
      })
    );
    await Promise.all(promises);
  } catch (error) {
    // Silently fail
    log.error("Error in handleBookingRequested", safeStringify(error));
  }
}
