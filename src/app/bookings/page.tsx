import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import BookingListClient from '@/components/scheduling/BookingListClient';

interface BookingPageProps {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}

export default async function BookingPage(props: BookingPageProps) {
  const searchParams = await props.searchParams;

  return (
    <PageLayout title="Home">
      <Header variant="scheduling" />
      <div className="px-8">
        <Divider.Root />
      </div>
      <BookingListClient searchParams={searchParams} />
    </PageLayout>
  );
}
