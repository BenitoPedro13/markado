import ServiceCalendarForm from '@/modules/scheduling/services/ServiceCalendarForm';
import ServiceInviteForm from '@/modules/scheduling/services/ServiceInviteForm';
import dayjs from 'dayjs';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import * as Button from '@/components/align-ui/ui/button';
import {RiArrowLeftSLine} from '@remixicon/react';
import type {GetBookingType} from '@/packages/features/bookings/lib/get-booking';
import type {getPublicEvent} from '@/packages/features/eventtypes/lib/getPublicEvent';
import {getUserPageProps} from '@/lib/getUserPageProps';
import {SUPORT_WHATSAPP_NUMBER} from '@/constants';
import { BookerWrapper } from '@/packages/booker/BookerWrapper';

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

export const getMultipleDurationValue = (
  multipleDurationConfig: number[] | undefined,
  queryDuration: string | string[] | null | undefined,
  defaultValue: number
) => {
  if (!multipleDurationConfig) return null;
  if (multipleDurationConfig.includes(Number(queryDuration)))
    return Number(queryDuration);
  return defaultValue;
};

const ServiceSchedulingPage = async (props: {
  params: Promise<{username: string; service: string}>;
  searchParams: Promise<{
    tz: string | undefined;
    d: string | undefined;
    t: string | undefined;
    duration: string | undefined;
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

        <Link
          href={`https://wa.me/${SUPORT_WHATSAPP_NUMBER}`}
          className="flex items-center gap-x-2"
          target="_blank"
        >
          <Button.Root variant="neutral" mode="stroke">
            <span className="text-text-sub-600">Precisa de ajuda?</span>
          </Button.Root>
        </Link>
      </div>
      <div className="grow w-full flex flex-col justify-center items-center">
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
          /* TODO: Currently unused, evaluate it is needed-
           *       Possible alternative approach is to have onDurationChange.
           */
          duration={getMultipleDurationValue(
            userPageProps.eventData.metadata?.multipleDuration,
            searchParams?.duration,
            userPageProps.eventData.length
          )}
        />
        {/* <ServiceCalendarForm service={userPageProps.eventData} host={host} /> */}
      </div>
    </>
  );
};

export default ServiceSchedulingPage;
