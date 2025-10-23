import { redirect } from 'next/navigation';
import { URLSearchParams } from "url";
import { z } from "zod";
import { auth } from '@/auth';
import { getUserFromSession } from '@/lib/getUserFromSession';
import { maybeGetBookingUidFromSeat } from '@/packages/lib/server/maybeGetBookingUidFromSeat';
import { bookingMinimalSelect } from '~/prisma/selects';
import { BookingStatus } from '~/prisma/enums';
import { getDefaultEvent } from '@/packages/lib/defaultEvents';
import { UserRepository } from '@/repositories/user';
import { buildEventUrlFromBooking } from "@/packages/lib/bookings/buildEventUrlFromBooking";
import { prisma } from '@/lib/prisma';

const querySchema = z.object({
  seatReferenceUid: z.string().optional(),
  rescheduledBy: z.string().optional(),
  allowRescheduleForCancelledBooking: z
    .string()
    .transform((value) => value === "true")
    .optional(),
});

interface PageProps {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReschedulePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const session = await auth();
  const user = await getUserFromSession(session);

  const bookingUid = resolvedParams.uid;
  
  const {
    seatReferenceUid,
    rescheduledBy,
    /**
     * This is for the case of request-reschedule where the booking is cancelled
     */
    allowRescheduleForCancelledBooking,
  } = querySchema.parse(resolvedSearchParams);

  const coepFlag = resolvedSearchParams["flag.coep"];
  const { uid, seatReferenceUid: maybeSeatReferenceUid } = await maybeGetBookingUidFromSeat(
    prisma,
    bookingUid
  );

  const booking = await prisma.booking.findUnique({
    where: {
      uid,
    },
    select: {
      ...bookingMinimalSelect,
      eventType: {
        select: {
          users: {
            select: {
              username: true,
            },
          },
          slug: true,
          team: {
            select: {
              parentId: true,
              slug: true,
            },
          },
          seatsPerTimeSlot: true,
          userId: true,
          owner: {
            select: {
              id: true,
              username: true,
            },
          },
          hosts: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      dynamicEventSlugRef: true,
      dynamicGroupSlugRef: true,
      user: true,
      status: true,
    },
  });
  const dynamicEventSlugRef = booking?.dynamicEventSlugRef || "";

  if (!booking) {
    redirect('/404');
  }

  // If booking is already CANCELLED or REJECTED, we can't reschedule this booking. Take the user to the booking page which would show it's correct status and other details.
  // A booking that has been rescheduled to a new booking will also have a status of CANCELLED
  if (
    !allowRescheduleForCancelledBooking &&
    (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REJECTED)
  ) {
    redirect(`/booking/${uid}`);
  }

  if (!booking?.eventType && !booking?.dynamicEventSlugRef) {
    // TODO: Show something in UI to let user know that this booking is not rescheduleable
    redirect('/404');
  }

  // if booking event type is for a seated event and no seat reference uid is provided, throw not found
  if (booking?.eventType?.seatsPerTimeSlot && !maybeSeatReferenceUid) {
    const userId = user?.id;

    if (!userId && !seatReferenceUid) {
      redirect(`/auth/login?callbackUrl=/reschedule/${bookingUid}`);
    }
    const userIsHost = booking?.eventType.hosts.find((host: any) => {
      if (host.user.id === userId) return true;
    });

    const userIsOwnerOfEventType = booking?.eventType.owner?.id === userId;

    if (!userIsHost && !userIsOwnerOfEventType) {
      redirect('/404');
    }
  }

  const eventType = booking.eventType ? booking.eventType : getDefaultEvent(dynamicEventSlugRef);

  const enrichedBookingUser = booking.user
    ? await UserRepository.enrichUserWithItsProfile({ user: booking.user })
    : null;

  const eventUrl = await buildEventUrlFromBooking({
    eventType,
    dynamicGroupSlugRef: booking.dynamicGroupSlugRef ?? null,
    profileEnrichedBookingUser: enrichedBookingUser,
  });

  const username =
    booking?.eventType?.users?.[0]?.username ||
    booking?.eventType?.owner?.username ||
    booking?.user?.username ||
    user?.username;

  if (!username) {
    throw new Error("Username não encontrado para redirecionamento de reagendamento");
  }

  const slug = booking?.eventType?.slug;
  if (!slug) {
    throw new Error("Slug não encontrado para redirecionamento de reagendamento");
  }

  const destinationUrlSearchParams = new URLSearchParams();
  if (coepFlag) {
    destinationUrlSearchParams.set("flag.coep", coepFlag as string);
  }
  const currentUserEmail = rescheduledBy ?? user?.email;
  if (currentUserEmail) {
    destinationUrlSearchParams.set("rescheduledBy", currentUserEmail);
  }

  destinationUrlSearchParams.set("rescheduleUid", uid);

  const destination = `/${username}/${slug}?${destinationUrlSearchParams.toString()}`;
  
  redirect(destination);
}
