import ServiceCalendarForm from '@/modules/scheduling/services/ServiceCalendarForm';
import ServiceInviteForm from '@/modules/scheduling/services/ServiceInviteForm';
import dayjs from 'dayjs';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import * as Button from '@/components/align-ui/ui/button';
import {RiArrowLeftSLine} from '@remixicon/react';

const ServiceSchedulingPage = async ({
  params,
  searchParams
}: {
  params: {username: string; service: string};
  searchParams: {
    tz: string | undefined;
    d: string | undefined;
    t: string | undefined;
  };
}) => {
  const host = await getHostUserByUsername(params.username);
  const service = await getServiceBySlugAndUsername(
    params.service,
    params.username
  );

  if (!service) {
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
        service={service}
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
        <ServiceCalendarForm service={service} host={host} />
      </div>
    </>
  );
};

export default ServiceSchedulingPage;
