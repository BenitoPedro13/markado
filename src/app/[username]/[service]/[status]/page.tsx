import ServiceFinalizationView from '@/modules/scheduling/services/ServiceFinalizationView';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {getUserPageProps} from '../page';
import {redirect} from 'next/navigation';
import ServiceCancelledView from '@/modules/scheduling/services/ServiceCancelledView';
import ServiceRescheduledView from '@/modules/scheduling/services/ServiceRescheduledView';

const ServiceSchedulingFinalizationPage = async (props: {
  params: Promise<{username: string; service: string}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

  if (searchParams.status === 'cancelled') {
    return (
      <ServiceCancelledView host={host} service={userPageProps.eventData} />
    );
  }

  if (searchParams.status === 'rescheduled') {
    return (
      <ServiceRescheduledView host={host} service={userPageProps.eventData} />
    );
  }

  return (
    <ServiceFinalizationView host={host} service={userPageProps.eventData} />
  );
};

export default ServiceSchedulingFinalizationPage;
