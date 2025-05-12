import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import AvailabilityDetails from '@/components/availability/AvailabilityDetails';
import {auth} from '@/auth';
import {findDetailedScheduleById} from '~/trpc/server/handlers/availability.handler';
import { AvailabilityProvider } from '@/contexts/AvailabilityContext';

type Props = {
  params: {
    slug: string;
  };
};

export default async function AvailabilityDetailsPage({params}: Props) {
  const session = await auth();

  if (!session?.user.id) return;

  const availabilityId = params.slug;

  const availability = await findDetailedScheduleById({
    scheduleId: +availabilityId,
    userId: session.user.id
  });

  const title = availability?.name;

  return (
    <AvailabilityProvider initialAvailability={availability}>
      <PageLayout title="Disponibilidade">
        <Header
          variant="availability"
          mode="inside"
          // title={title}
          subtitle="seg. - sex., 9:00 até 17:00"
        />
        <div className="px-8">
          <Divider.Root />
        </div>

        <div className="p-8">
          <AvailabilityDetails
            title={title || ''}
            // availability={availability}
          />
        </div>
      </PageLayout>
    </AvailabilityProvider>
  );
}
