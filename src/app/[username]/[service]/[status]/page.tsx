import ServiceFinalizationForm from '@/modules/scheduling/services/ServiceFinalizationForm';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {getUserPageProps} from '../page';
import { redirect } from 'next/navigation';

const ServiceSchedulingFinalizationPage = async (props: {
  params: Promise<{username: string; service: string}>;
}) => {
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

  return (
    <ServiceFinalizationForm host={host} service={userPageProps.eventData} />
  );
};

export default ServiceSchedulingFinalizationPage;
