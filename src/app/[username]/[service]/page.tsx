import ServiceCalendarForm from '@/modules/scheduling/services/ServiceCalendarForm';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

const ServiceSchedulingPage = async ({
  params
}: {
  params: {username: string; service: string};
}) => {
  const host = await getHostUserByUsername(params.username);
  const service = await getServiceBySlugAndUsername(
    params.service,
    params.username
  );

  return <ServiceCalendarForm service={service} host={host} />;
};

export default ServiceSchedulingPage;
