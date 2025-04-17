import PageLayout from '@/components/PageLayout';
import {useTranslations} from 'next-intl';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';

/** Availability page of the website. */
export default function AvailabilityPage() {
  const t = useTranslations('IndexPage');

  return (
    <PageLayout title="Home">
      {/* <Header variant="scheduling"/> */}
      <Header variant="availability" mode="inside" />
      <Divider.Root />
      {/* <Home /> */}
    </PageLayout>
  );
} 