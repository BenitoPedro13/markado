import ServiceCalendarForm from '@/modules/scheduling/services/ServiceCalendarForm';
import ServiceInviteForm from '@/modules/scheduling/services/ServiceInviteForm';
import dayjs from 'dayjs';
import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
// import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import * as Button from '@/components/align-ui/ui/button';
import {RiArrowLeftSLine} from '@remixicon/react';

// import type {DehydratedState} from '@tanstack/react-query';
// import {type GetServerSidePropsContext} from 'next';
// import type {Session} from 'next-auth';
// import {z} from 'zod';

// import {getServerSession} from '@/features/auth/lib/getServerSession';
// import {
//   getBookingForReschedule,
//   getBookingForSeatedEvent
// } from '@/features/bookings/lib/get-booking';
import type {GetBookingType} from '@/packages/features/bookings/lib/get-booking';
// import {orgDomainConfig} from '@/features/core/organizations/lib/orgDomains';
import type {getPublicEvent} from '@/packages/features/eventtypes/lib/getPublicEvent';
// import {getUsernameList} from '@/packages/lib/defaultEvents';
import {UserRepository} from '@/repositories/user';
// import slugify from '@/lib/slugify';
// import {prisma} from '@/lib/prisma';
// import {RedirectType} from '~/prisma/app/generated/prisma/client';

// import {getTemporaryOrgRedirect} from '@lib/getTemporaryOrgRedirect';
// import {auth} from '@/auth';
import eventHandler from '~/trpc/server/handlers/events.handler';

type Props = {
  eventData: Pick<
    NonNullable<Awaited<ReturnType<typeof getPublicEvent>>>,
    | 'id'
    | 'length'
    | 'metadata'
    | 'title'
    | 'slug'
    | 'price'
    | 'hidden'
    | 'badgeColor'
    // | 'entity'
  >;
  booking?: GetBookingType;
  rescheduleUid: string | null;
  bookingUid: string | null;
  user: string;
  slug: string;
  // trpcState: DehydratedState;
  isBrandingHidden: boolean;
  isSEOIndexable: boolean | null;
  themeBasis: null | string;
  orgBannerUrl: null;
};

// async function processReschedule({
//   props,
//   rescheduleUid,
//   session
// }: {
//   props: Props;
//   session: Session | null;
//   rescheduleUid: string | string[] | undefined;
// }) {
//   if (!rescheduleUid) return;
//   const booking = await getBookingForReschedule(
//     `${rescheduleUid}`,
//     session?.user?.id
//   );
//   // if no booking found, no eventTypeId (dynamic) or it matches this eventData - return void (success).
//   if (
//     booking === null ||
//     !booking.eventTypeId ||
//     booking?.eventTypeId === props.eventData?.id
//   ) {
//     props.booking = booking;
//     props.rescheduleUid = Array.isArray(rescheduleUid)
//       ? rescheduleUid[0]
//       : rescheduleUid;
//     return;
//   }
//   // handle redirect response
//   const redirectEventTypeTarget = await prisma.eventType.findUnique({
//     where: {
//       id: booking.eventTypeId
//     },
//     select: {
//       slug: true
//     }
//   });
//   if (!redirectEventTypeTarget) {
//     return {
//       notFound: true
//     } as const;
//   }
//   return {
//     redirect: {
//       permanent: false,
//       destination: redirectEventTypeTarget.slug
//     }
//   };
// }

// async function processSeatedEvent({
//   props,
//   bookingUid
// }: {
//   props: Props;
//   bookingUid: string | string[] | undefined;
// }) {
//   if (!bookingUid) return;
//   props.booking = await getBookingForSeatedEvent(`${bookingUid}`);
//   props.bookingUid = Array.isArray(bookingUid) ? bookingUid[0] : bookingUid;
// }

// async function getDynamicGroupPageProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context);
//   const {user: usernames, type: slug} = paramsSchema.parse(context.params);
//   const {rescheduleUid, bookingUid} = context.query;

//   // const {ssrInit} = await import('@server/lib/ssr');
//   // const ssr = await ssrInit(context);
//   // const {currentOrgDomain, isValidOrgDomain} = orgDomainConfig(
//   //   context.req,
//   //   context.params?.orgSlug
//   // );
//   // const org = isValidOrgDomain ? currentOrgDomain : null;
//   const org = null;

//   if (!org) {
//     const redirect = await getTemporaryOrgRedirect({
//       slugs: usernames,
//       redirectType: RedirectType.User,
//       eventTypeSlug: slug,
//       currentQuery: context.query
//     });

//     if (redirect) {
//       return redirect;
//     }
//   }

//   const usersInOrgContext = await UserRepository.findUsersByUsername({
//     usernameList: usernames,
//     // orgSlug: isValidOrgDomain ? currentOrgDomain : null
//     orgSlug: null
//   });

//   const users = usersInOrgContext;

//   if (!users.length) {
//     return {
//       notFound: true
//     } as const;
//   }

//   // We use this to both prefetch the query on the server,
//   // as well as to check if the event exist, so we c an show a 404 otherwise.
//   const eventData = await ssr.viewer.public.event.fetch({
//     username: usernames.join('+'),
//     eventSlug: slug,
//     org,
//     fromRedirectOfNonOrgLink: context.query.orgRedirection === 'true'
//   });

//   if (!eventData) {
//     return {
//       notFound: true
//     } as const;
//   }

//   const props: Props = {
//     eventData: {
//       id: eventData.id,
//       entity: eventData.entity,
//       length: eventData.length,
//       metadata: {
//         ...eventData.metadata,
//         multipleDuration: [15, 30, 45, 60, 90]
//       }
//     },
//     user: usernames.join('+'),
//     slug,
//     trpcState: ssr.dehydrate(),
//     isBrandingHidden: false,
//     isSEOIndexable: true,
//     themeBasis: null,
//     bookingUid: bookingUid ? `${bookingUid}` : null,
//     rescheduleUid: null,
//     orgBannerUrl: null
//   };

//   if (rescheduleUid) {
//     const processRescheduleResult = await processReschedule({
//       props,
//       rescheduleUid,
//       session
//     });
//     if (processRescheduleResult) {
//       return processRescheduleResult;
//     }
//   } else if (bookingUid) {
//     await processSeatedEvent({props, bookingUid});
//   }

//   return {
//     props
//   };
// }

async function getUserPageProps({
  username,
  slug
}: {
  username: string;
  slug: string;
}) {
  // const session = await auth();
  // const {user: usernames, type: slug} = paramsSchema.parse(context.params);
  // const username = usernames[0];
  // const {rescheduleUid, bookingUid} = context.query;
  // const {currentOrgDomain, isValidOrgDomain} = orgDomainConfig(
  //   context.req,
  //   context.params?.orgSlug
  // );

  // const isOrgContext = currentOrgDomain && isValidOrgDomain;
  // if (!isOrgContext) {
  //   const redirect = await getTemporaryOrgRedirect({
  //     slugs: usernames,
  //     redirectType: RedirectType.User,
  //     eventTypeSlug: slug,
  //     currentQuery: context.query
  //   });

  //   if (redirect) {
  //     return redirect;
  //   }
  // }

  // const {ssrInit} = await import('@server/lib/ssr');
  // const ssr = await ssrInit(context);
  const [user] = await UserRepository.findUsersByUsername({
    usernameList: [username],
    // orgSlug: isValidOrgDomain ? currentOrgDomain : null
    orgSlug: null
  });

  if (!user) {
    return notFound();
  }

  // const org = isValidOrgDomain ? currentOrgDomain : null;
  const org = null;

  // We use this to both prefetch the query on the server,
  // as well as to check if the event exist, so we can show a 404 otherwise.
  const eventData = await eventHandler({
    input: {
      username,
      eventSlug: slug,
      org,
      // fromRedirectOfNonOrgLink: context.query.orgRedirection === 'true'
      fromRedirectOfNonOrgLink: false
    }
  });

  if (!eventData) {
    return notFound();
  }

  const props: Props = {
    eventData: {
      id: eventData.id,
      // entity: eventData.entity,
      length: eventData.length,
      metadata: eventData.metadata,
      title: eventData.title,
      slug: eventData.slug,
      hidden: eventData.hidden,
      badgeColor: eventData.badgeColor,
      price: eventData.price
    },
    user: username,
    slug,
    // trpcState: ssr.dehydrate(),
    isBrandingHidden: user?.hideBranding,
    isSEOIndexable: user?.allowSEOIndexing,
    themeBasis: username,
    // bookingUid: bookingUid ? `${bookingUid}` : null,
    bookingUid: null,
    rescheduleUid: null,
    orgBannerUrl: eventData?.owner?.profile?.organization?.bannerUrl ?? null
  };

  // if (rescheduleUid) {
  //   const processRescheduleResult = await processReschedule({
  //     props,
  //     rescheduleUid,
  //     session
  //   });
  //   if (processRescheduleResult) {
  //     return processRescheduleResult;
  //   }
  // } else if (bookingUid) {
  //   await processSeatedEvent({props, bookingUid});
  // }

  return {
    props
  };
}

// const paramsSchema = z.object({
//   type: z.string().transform((s) => slugify(s)),
//   user: z.string().transform((s) => getUsernameList(s))
// });

// Booker page fetches a tiny bit of data server side, to determine early
// whether the page should show an away state or dynamic booking not allowed.
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const {user} = paramsSchema.parse(context.params);
//   const isDynamicGroup = user.length > 1;

//   return isDynamicGroup
//     ? await getUserPageProps(context)
//     // await getDynamicGroupPageProps(context)
//     : await getUserPageProps(context);
// };

const ServiceSchedulingPage = async (props: {
  params: Promise<{username: string; service: string}>;
  searchParams: Promise<{
    tz: string | undefined;
    d: string | undefined;
    t: string | undefined;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const host = await getHostUserByUsername(params.username);
  const {props: userPageProps} = await getUserPageProps({
    username: params.username,
    slug: params.service
  });

  // const service = await getServiceBySlugAndUsername(
  //   params.service,
  //   params.username
  // );

  if (!userPageProps.eventData) {
    console.error('Service not found');
    redirect(`/${params.username}`);
  }

  if (!host) {
    throw new Error('Host not found');
  }

  const date = searchParams.d;
  const time = searchParams.t;
  const encodedTimezone = searchParams.tz;
  const timezone = encodedTimezone
    ? decodeURIComponent(encodedTimezone)
    : undefined;

  // Validate if date it future date
  if (date) {
    const selectedDate = new Date(date);
    if (selectedDate < new Date()) {
      console.error('Selected date is in the past');
      redirect(`/${params.username}/${params.service}`);
    }
  }

  // Validate if time is valid
  if (time) {
    const selectedTime = new Date(`1970-01-01T${time}:00`);
    if (isNaN(selectedTime.getTime())) {
      console.error('Invalid time selected');
      redirect(`/${params.username}/${params.service}`);
    }
  }

  // Validate if timezone is valid
  if (timezone) {
    const validTimezones = Intl.supportedValuesOf('timeZone');
    if (!validTimezones.includes(timezone)) {
      console.error('Invalid timezone selected');
      redirect(`/${params.username}/${params.service}`);
    }
  }

  // Merge the date and time into a single Date object
  if (date && time && timezone) {
    const selectedDate = dayjs(date)
      .set('hour', parseInt(time.split(':')[0]))
      .set('minute', parseInt(time.split(':')[1]))
      .toDate();

    return (
      <ServiceInviteForm
        host={host}
        service={userPageProps.eventData}
        date={selectedDate}
        timezone={timezone}
      />
    );
  }

  return (
    <>
      <div className="w-full flex justify-between">
        <Link href={`/${host.username}`} className="flex items-center gap-x-2">
          <Button.Root variant="neutral" mode="stroke">
            <Button.Icon as={RiArrowLeftSLine} />
            <span className="text-text-sub-600">Voltar</span>
          </Button.Root>
        </Link>

        <Link href={`/${host.username}`} className="flex items-center gap-x-2">
          <Button.Root variant="neutral" mode="stroke">
            <span className="text-text-sub-600">Precisa de ajuda?</span>
          </Button.Root>
        </Link>
      </div>
      <div className="grow w-full flex flex-col justify-center items-center">
        <ServiceCalendarForm service={userPageProps.eventData} host={host} />
      </div>
    </>
  );
};

export default ServiceSchedulingPage;
