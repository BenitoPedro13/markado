import ServiceFinalizationForm from '@/modules/scheduling/services/ServiceFinalizationForm';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

const ServiceSchedulingFinalizationPage = async ({
  params
}: {
  params: {username: string; service: string};
}) => {
  const host = await getHostUserByUsername(params.username);
  const service = await getServiceBySlugAndUsername(
    params.service,
    params.username
  );

  return <ServiceFinalizationForm host={host} service={service} />;
};

export default ServiceSchedulingFinalizationPage;
