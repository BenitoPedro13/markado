import ServiceCalendarForm from '@/modules/scheduling/services/ServiceCalendarForm';
import ServiceInviteForm from '@/modules/scheduling/services/ServiceInviteForm';
import { ServiceSchedulingPageClient } from './ServiceSchedulingPageClient';
import dayjs from 'dayjs';
import {redirect, notFound} from 'next/navigation';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import type {GetBookingType} from '@/packages/features/bookings/lib/get-booking';
import type {getPublicEvent} from '@/packages/features/eventtypes/lib/getPublicEvent';
import {getUserPageProps} from '@/lib/getUserPageProps';
import { BookerWrapper } from '@/packages/booker/BookerWrapper';
import { getMultipleDurationValue } from '@/utils/getMultipleDurationValue';

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

const ServiceSchedulingPage = async (props: {
  params: Promise<{username: string; service: string}>;
  searchParams: Promise<{
    tz: string | undefined;
    d: string | undefined;
    t: string | undefined;
    duration: string | undefined;
    rescheduleUid?: string;
    reschedule?: string;
    rescheduledBy?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const host = await getHostUserByUsername(params.username);
  const {props: userPageProps} = await getUserPageProps({
    username: params.username,
    slug: params.service
  });

  if (!userPageProps.eventData) {
    return redirect(`/${params.username}`);
  }
  if (!host) {
    notFound();
  }

  const date = searchParams.d;
  const time = searchParams.t;
  const encodedTimezone = searchParams.tz;
  const timezone = encodedTimezone
    ? decodeURIComponent(encodedTimezone)
    : undefined;

  if (date && new Date(date) < new Date()) {
    return redirect(`/${params.username}/${params.service}`);
  }
  if (time && isNaN(new Date(`1970-01-01T${time}:00`).getTime())) {
    return redirect(`/${params.username}/${params.service}`);
  }
  if (timezone) {
    const validTimezones = Intl.supportedValuesOf('timeZone');
    if (!validTimezones.includes(timezone)) {
      return redirect(`/${params.username}/${params.service}`);
    }
  }

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
      <ServiceSchedulingPageClient username={host.username ?? ""} />
      <div className="grow w-full flex flex-col justify-center items-center">
        {(() => {
          return (
            <BookerWrapper
              username={params.username}
              eventSlug={params.service}
              bookingData={userPageProps.booking}
              hideBranding={userPageProps.isBrandingHidden}
              entity={{
                ...userPageProps.eventData.entity,
                eventTypeId: userPageProps.eventData?.id
              }}
              durationConfig={userPageProps.eventData.metadata?.multipleDuration}
              orgBannerUrl={userPageProps.orgBannerUrl}
              duration={getMultipleDurationValue(
                userPageProps.eventData.metadata?.multipleDuration,
                searchParams?.duration,
                userPageProps.eventData.length
              )}
            />
          );
        })()}
      </div>
    </>
  );
};

export default ServiceSchedulingPage;

