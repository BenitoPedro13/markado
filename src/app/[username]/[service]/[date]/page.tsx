import ServiceUserDataForm from '@/modules/scheduling/services/ServiceUserDataForm';
import {timeStringToDate} from '@/utils/time-utils';
import {redirect} from 'next/navigation';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

const ServiceSchedulingUserPage = async ({
  params
}: {
  params: {username: string; service: string; date: string};
}) => {
  const host = await getHostUserByUsername(params.username);
  const service = await getServiceBySlugAndUsername(
    params.service,
    params.username
  );

  let scheduleDate = null;
  try {
    scheduleDate = timeStringToDate(params.date);
  } catch (error) {
    throw new Error('Invalid date format');
  }
  if (!scheduleDate) {
    redirect(`/${params.username}/${params.service}`);
  }

  return (
    <ServiceUserDataForm
      host={host}
      service={service}
      scheduleDate={scheduleDate}
    />
  );
};

export default ServiceSchedulingUserPage;
