import { FAKE_DAILY_CREDENTIAL } from "@/packages/app-store/dailyvideo/lib/VideoApiAdapter";
import { DailyLocationType } from "@/core/locations";
import EventManager from "@/packages/core/EventManager";
import dayjs from "@/lib/dayjs";
import { getCalEventResponses } from "@/packages/features/bookings/lib/getCalEventResponses";
import { workflowSelect } from "@/packages/features/workflows/lib/getAllWorkflows";
import sendPayload from "@/packages/features/webhooks/lib/sendOrSchedulePayload";
import type { EventTypeInfo } from "@/packages/features/webhooks/lib/sendPayload";
import { isPrismaObjOrUndefined, parseRecurringEvent } from "@/packages/lib";
import getOrgIdFromMemberOrTeamId from "@/packages/lib/getOrgIdFromMemberOrTeamId";
import { getTeamIdFromEventType } from "@/packages/lib/getTeamIdFromEventType";
import { HttpError } from "@/packages/lib/http-error";
import logger from "@/packages/lib/logger";
import { safeStringify } from "@/lib/safeStringify";
import { getTimeFormatStringFromUserTimeFormat } from "@/packages/features/bookings/lib/timeFormat";
import { credentialForCalendarServiceSelect } from "~/prisma/selects/credential";
import { bookingMetadataSchema, EventTypeMetaDataSchema, bookingCancelInput } from "~/prisma/zod-utils";
import type { EventTypeMetadata } from "~/prisma/zod-utils";
import type { CalendarEvent } from "@/types/Calendar";
import { getAllCredentials } from "./getAllCredentialsForUsersOnEvent/getAllCredentials";
import { bookingMinimalSelect } from "~/prisma/selects";
import { NextApiRequest } from "next";
import { BookingStatus, WebhookTriggerEvents } from "~/prisma/enums";
import { getTranslation } from "@/packages/lib/server/i18n";
import { WorkflowReminder, Prisma } from "~/prisma/app/generated/prisma/client";
// import cancelAttendeeSeat from "./handleSeats/cancel/cancelAttendeeSeat"; // Não encontrado
import {prisma} from '@/lib/prisma'
import { sendCancelledEmailsAndSMS } from "@/packages/emails";
const log = logger.getSubLogger({ prefix: ["handleCancelBooking"] });

async function getBookingToDelete(id: number | undefined, uid: string | undefined) {
  return await prisma.booking.findUniqueOrThrow({
    where: {
      id,
      uid,
    },
    select: {
      ...bookingMinimalSelect,
      recurringEventId: true,
      userId: true,
      user: {
        select: {
          id: true,
          username: true,
          credentials: { select: credentialForCalendarServiceSelect }, // Not leaking at the moment, be careful with
          email: true,
          timeZone: true,
          timeFormat: true,
          name: true,
          destinationCalendar: true,
        },
      },
      location: true,
      references: {
        select: {
          uid: true,
          type: true,
          externalCalendarId: true,
          credentialId: true,
          thirdPartyRecurringEventId: true,
        },
      },
      payment: true,
      paid: true,
      eventType: {
        select: {
          slug: true,
          owner: {
            select: {
              id: true,
              hideBranding: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              parentId: true,
            },
          },
          parentId: true,
          parent: {
            select: {
              teamId: true,
            },
          },
          userId: true,
          recurringEvent: true,
          title: true,
          eventName: true,
          description: true,
          requiresConfirmation: true,
          price: true,
          currency: true,
          length: true,
          seatsPerTimeSlot: true,
          bookingFields: true,
          seatsShowAttendees: true,
          metadata: true,
          schedulingType: true,
          hosts: {
            select: {
              user: true,
            },
          },
          workflows: {
            select: {
              workflow: {
                select: workflowSelect,
              },
            },
          },
        },
      },
      uid: true,
      id: true,
      eventTypeId: true,
      destinationCalendar: true,
      smsReminderNumber: true,
      workflowReminders: true,
      seatsReferences: true,
      responses: true,
      iCalUID: true,
      iCalSequence: true,
    },
  });
}

export type CustomRequest = NextApiRequest & {
  userId?: number;
  bookingToDelete?: Awaited<ReturnType<typeof getBookingToDelete>>;
  platformClientId?: string;
  platformRescheduleUrl?: string;
  platformCancelUrl?: string;
  platformBookingUrl?: string;
  arePlatformEmailsEnabled?: boolean;
};

export type HandleCancelBookingResponse = {
  success: boolean;
  message: string;
  onlyRemovedAttendee: boolean;
  bookingId: number;
  bookingUid: string;
};

async function handler(req: CustomRequest) {
  const { id, uid, allRemainingBookings, cancellationReason, seatReferenceUid, cancelledBy } =
    bookingCancelInput.parse(req.body);
  req.bookingToDelete = await getBookingToDelete(id, uid);
  const {
    bookingToDelete,
    userId,
    platformBookingUrl,
    platformCancelUrl,
    platformClientId,
    platformRescheduleUrl,
    arePlatformEmailsEnabled,
  } = req;

  if (!bookingToDelete.userId || !bookingToDelete.user) {
    throw new HttpError({ statusCode: 400, message: "User not found" });
  }

  // If the booking is a seated event and there is no seatReferenceUid we should validate that logged in user is host
  if (bookingToDelete.eventType?.seatsPerTimeSlot && !seatReferenceUid) {
    const userIsHost = bookingToDelete.eventType.hosts.find((host: any) => {
      if (host.user.id === userId) return true;
    });

    const userIsOwnerOfEventType = bookingToDelete.eventType.owner?.id === userId;

    if (!userIsHost && !userIsOwnerOfEventType) {
      throw new HttpError({ statusCode: 401, message: "User not a host of this event" });
    }
  }

  // get webhooks
  const eventTrigger: WebhookTriggerEvents = "BOOKING_CANCELLED";

  const teamId = await getTeamIdFromEventType({
    eventType: {
      team: { id: bookingToDelete.eventType?.team?.id ?? null },
      parentId: bookingToDelete?.eventType?.parentId ?? null,
    },
  });
  const triggerForUser = !teamId || (teamId && bookingToDelete.eventType?.parentId);
  const organizerUserId = triggerForUser ? bookingToDelete.userId : null;

  const orgId = await getOrgIdFromMemberOrTeamId({ memberId: organizerUserId, teamId });

  // const subscriberOptions: GetSubscriberOptions = {
  //   userId: organizerUserId,
  //   eventTypeId: bookingToDelete.eventTypeId as number,
  //   triggerEvent: eventTrigger,
  //   teamId,
  //   orgId,
  //   oAuthClientId: platformClientId,
  // };

  const eventTypeInfo: EventTypeInfo = {
    eventTitle: bookingToDelete?.eventType?.title || null,
    eventDescription: bookingToDelete?.eventType?.description || null,
    requiresConfirmation: bookingToDelete?.eventType?.requiresConfirmation || null,
    price: bookingToDelete?.eventType?.price || null,
    currency: bookingToDelete?.eventType?.currency || null,
    length: bookingToDelete?.eventType?.length || null,
  };

  // const webhooks = await getWebhooks(subscriberOptions);

  const organizer = await prisma.user.findFirstOrThrow({
    where: {
      id: bookingToDelete.userId,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      timeZone: true,
      timeFormat: true,
      locale: true,
    },
  });

  const teamMembersPromises = [];
  const attendeesListPromises = [];
  const hostsPresent = !!bookingToDelete.eventType?.hosts;

  for (const attendee of bookingToDelete.attendees) {
    const attendeeObject = {
      name: attendee.name,
      email: attendee.email,
      timeZone: attendee.timeZone,
      phoneNumber: attendee.phoneNumber,
      language: {
        translate: await getTranslation(attendee.locale ?? "en", "common"),
        locale: attendee.locale ?? "en",
      },
    };

    // Check for the presence of hosts to determine if it is a team event type
    if (hostsPresent) {
      // If the attendee is a host then they are a team member
      const teamMember = bookingToDelete.eventType?.hosts.some((host: any) => host.user.email === attendee.email);
      if (teamMember) {
        teamMembersPromises.push(attendeeObject);
        // If not then they are an attendee
      } else {
        attendeesListPromises.push(attendeeObject);
      }
    } else {
      attendeesListPromises.push(attendeeObject);
    }
  }

  const attendeesList = await Promise.all(attendeesListPromises);
  const teamMembers = await Promise.all(teamMembersPromises);
  const tOrganizer = await getTranslation(organizer.locale ?? "en", "common");

  const ownerProfile = await prisma.profile.findFirst({
    where: {
      userId: bookingToDelete.userId,
    },
  });

  // const bookerUrl = await getBookerBaseUrl(
  //   bookingToDelete.eventType?.team?.parentId ?? ownerProfile?.organizationId ?? null
  // );

  const evt: CalendarEvent = {
    bookerUrl: platformBookingUrl || "",
    title: bookingToDelete?.title,
    length: bookingToDelete?.eventType?.length,
    type: bookingToDelete?.eventType?.slug as string,
    description: bookingToDelete?.description || "",
    customInputs: isPrismaObjOrUndefined(bookingToDelete.customInputs),
    eventTypeId: bookingToDelete.eventTypeId as number,
    ...getCalEventResponses({
      bookingFields: bookingToDelete.eventType?.bookingFields ?? null,
      booking: bookingToDelete,
    }),
    startTime: bookingToDelete?.startTime ? dayjs(bookingToDelete.startTime).format() : "",
    endTime: bookingToDelete?.endTime ? dayjs(bookingToDelete.endTime).format() : "",
    organizer: {
      id: organizer.id,
      username: organizer.username || undefined,
      email: bookingToDelete?.userPrimaryEmail ?? organizer.email,
      name: organizer.name ?? "Nameless",
      timeZone: organizer.timeZone ?? "America/Sao_Paulo",
      timeFormat: getTimeFormatStringFromUserTimeFormat(organizer.timeFormat),
      language: { translate: tOrganizer, locale: organizer.locale ?? "en" },
    },
    attendees: attendeesList,
    uid: bookingToDelete?.uid,
    bookingId: bookingToDelete?.id,
    /* Include recurringEvent information only when cancelling all bookings */
    recurringEvent: allRemainingBookings
      ? parseRecurringEvent(bookingToDelete.eventType?.recurringEvent)
      : undefined,
    location: bookingToDelete?.location,
    destinationCalendar: bookingToDelete?.destinationCalendar
      ? [bookingToDelete?.destinationCalendar]
      : bookingToDelete?.user.destinationCalendar
      ? [bookingToDelete?.user.destinationCalendar]
      : [],
    cancellationReason: cancellationReason,
    ...(teamMembers &&
      teamId && {
        team: {
          name: bookingToDelete?.eventType?.team?.name || "Nameless",
          members: teamMembers,
          id: teamId,
        },
      }),
    seatsPerTimeSlot: bookingToDelete.eventType?.seatsPerTimeSlot,
    seatsShowAttendees: bookingToDelete.eventType?.seatsShowAttendees,
    iCalUID: bookingToDelete.iCalUID,
    iCalSequence: bookingToDelete.iCalSequence + 1,
    platformClientId,
    platformRescheduleUrl,
    platformCancelUrl,
    platformBookingUrl,
  };

  const dataForWebhooks = { evt, webhooks: [], eventTypeInfo };

  // If it's just an attendee of a booking then just remove them from that booking
  // const result = await cancelAttendeeSeat(
  //   req,
  //   dataForWebhooks,
  //   bookingToDelete?.eventType?.metadata as EventTypeMetadata
  // );
  // if (result)
  //   return {
  //     success: true,
  //     onlyRemovedAttendee: true,
  //     bookingId: bookingToDelete.id,
  //     bookingUid: bookingToDelete.uid,
  //     message: "Attendee successfully removed.",
  //   } satisfies HandleCancelBookingResponse;

  // const promises = webhooks.map((webhook) =>
  //   sendPayload(webhook.secret, eventTrigger, new Date().toISOString(), webhook, {
  //     ...evt,
  //     ...eventTypeInfo,
  //     status: "CANCELLED",
  //     smsReminderNumber: bookingToDelete.smsReminderNumber || undefined,
  //     cancelledBy: cancelledBy,
  //   }).catch((e) => {
  //     logger.error(
  //       `Error executing webhook for event: ${eventTrigger}, URL: ${webhook.subscriberUrl}, bookingId: ${evt.bookingId}, bookingUid: ${evt.uid}`,
  //       safeStringify(e)
  //     );
  //   })
  // );
  // await Promise.all(promises);

  // const workflows = await getAllWorkflowsFromEventType(bookingToDelete.eventType, bookingToDelete.userId);
  const parsedMetadata = bookingMetadataSchema.safeParse(bookingToDelete.metadata || {});

  // await sendCancelledReminders({
  //   workflows,
  //   smsReminderNumber: bookingToDelete.smsReminderNumber,
  //   evt: {
  //     ...evt,
  //     ...(parsedMetadata.success && parsedMetadata.data?.videoCallUrl
  //       ? { metadata: { videoCallUrl: parsedMetadata.data.videoCallUrl } }
  //       : {}),
  //     bookerUrl,
  //     ...{
  //       eventType: {
  //         slug: bookingToDelete.eventType?.slug as string,
  //         schedulingType: bookingToDelete.eventType?.schedulingType,
  //         hosts: bookingToDelete.eventType?.hosts,
  //       },
  //     },
  //   },
  //   hideBranding: !!bookingToDelete.eventType?.owner?.hideBranding,
  // });

  let updatedBookings: {
    id: number;
    uid: string;
    workflowReminders: WorkflowReminder[];
    references: {
      type: string;
      credentialId: number | null;
      uid: string;
      externalCalendarId: string | null;
    }[];
    startTime: Date;
    endTime: Date;
  }[] = [];

  // by cancelling first, and blocking whilst doing so; we can ensure a cancel
  // action always succeeds even if subsequent integrations fail cancellation.
  if (bookingToDelete.eventType?.recurringEvent && bookingToDelete.recurringEventId && allRemainingBookings) {
    const recurringEventId = bookingToDelete.recurringEventId;
    // Proceed to mark as cancelled all remaining recurring events instances (greater than or equal to right now)
    await prisma.booking.updateMany({
      where: {
        recurringEventId,
        startTime: {
          gte: new Date(),
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: cancellationReason,
        cancelledBy: cancelledBy,
      },
    });
    const allUpdatedBookings = await prisma.booking.findMany({
      where: {
        recurringEventId: bookingToDelete.recurringEventId,
        startTime: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        references: {
          select: {
            uid: true,
            type: true,
            externalCalendarId: true,
            credentialId: true,
          },
        },
        workflowReminders: true,
        uid: true,
      },
    });
    updatedBookings = updatedBookings.concat(allUpdatedBookings);
  } else {
    if (bookingToDelete?.eventType?.seatsPerTimeSlot) {
      await prisma.attendee.deleteMany({
        where: {
          bookingId: bookingToDelete.id,
        },
      });
    }

    const where: Prisma.BookingWhereUniqueInput = uid ? { uid } : { id };

    const updatedBooking = await prisma.booking.update({
      where,
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: cancellationReason,
        cancelledBy: cancelledBy,
        // Assume that canceling the booking is the last action
        iCalSequence: evt.iCalSequence || 100,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        references: {
          select: {
            uid: true,
            type: true,
            externalCalendarId: true,
            credentialId: true,
          },
        },
        workflowReminders: true,
        uid: true,
      },
    });
    updatedBookings.push(updatedBooking);
  }

  /** TODO: Remove this without breaking functionality */
  if (bookingToDelete.location === DailyLocationType) {
    bookingToDelete.user.credentials.push({
      ...FAKE_DAILY_CREDENTIAL,
      teamId: bookingToDelete.eventType?.team?.id || null,
    });
  }

  const isBookingInRecurringSeries = !!(
    bookingToDelete.eventType?.recurringEvent &&
    bookingToDelete.recurringEventId &&
    allRemainingBookings
  );

  const bookingToDeleteEventTypeMetadata = EventTypeMetaDataSchema.parse(
    bookingToDelete.eventType?.metadata || null
  );

  const credentials = await getAllCredentials(bookingToDelete.user, {
    ...bookingToDelete.eventType,
    metadata: bookingToDeleteEventTypeMetadata,
  });

  const eventManager = new EventManager({ ...bookingToDelete.user, credentials });

  await eventManager.cancelEvent(evt, bookingToDelete.references, isBookingInRecurringSeries);

  const bookingReferenceDeletes = prisma.bookingReference.deleteMany({
    where: {
      bookingId: bookingToDelete.id,
    },
  });

  const webhookTriggerPromises = [];
  const workflowReminderPromises = [];

  // for (const booking of updatedBookings) {
  //   // delete scheduled webhook triggers of cancelled bookings
  //   webhookTriggerPromises.push(deleteWebhookScheduledTriggers({ booking }));

  //   //Workflows - cancel all reminders for cancelled bookings
  //   workflowReminderPromises.push(WorkflowRepository.deleteAllWorkflowReminders(booking.workflowReminders));
  // }

  // await Promise.all([...webhookTriggerPromises, ...workflowReminderPromises]).catch((error) => {
  //   log.error("An error occurred when deleg workflow reminders and webhook triggers", or);
  // });

  // const prismaPromises: Promise<unknown>[] = [kingReferenceDeletes];

  try {
  //   // TODO: if emails fail try to requeue m
  //   if (!platformClientId || (platformClientId && arePlatfEmailsEnabled))
       await sendCancelledEmailsAndSMS(
        evt,
        { eventName: bookingToDelete?.eventType?.eventName },
        bookingToDelete?.eventType?.metadata as EventTypeMetadata
      );
  } catch (error) {
  //   console.error("Error deleting event", error);
  // }
  // req.statusCode200;
  //turn {
  //   success: true,
  //   message: "Booking successfully cancelle,
  //   yRemovedAttendee: false,
  //   bookingId: bookinDelete.id,
  //   bookingUid: bookingToDelete.uid,
  // } satisfies HandleCancookingResponse;
  }
}

export default handler;