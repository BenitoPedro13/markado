import ServiceFinalizationForm from '@/modules/scheduling/services/ServiceFinalizationForm';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

const ServiceSchedulingFinalizationPage = async (
  props: {
    params: Promise<{username: string; service: string}>;
  }
) => {
  const params = await props.params;
  const host = await getHostUserByUsername(params.username);
  const service = await getServiceBySlugAndUsername(
    params.service,
    params.username
  );

  return <ServiceFinalizationForm host={host} service={service} />;
};

export default ServiceSchedulingFinalizationPage;
