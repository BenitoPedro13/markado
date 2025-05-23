import {BookingProvider} from '@/contexts/bookings/BookingContext';
import {
  getAllBookings,
  getBookingsByStatus
} from '~/trpc/server/handlers/booking.handler';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import BookingList from '@/components/scheduling/BookingList';
import BookingFilter from '@/components/scheduling/BookingFilter';
import BookingSearch from '@/components/scheduling/BookingSearch';
import BookingViewControl from '@/components/scheduling/BookingViewControl';
import {BookingSort as ValidBookingSort} from '@/components/scheduling/BookingSort';
import {Booking} from '@/data/bookings';

const VALID_VIEWS = ['list', 'calendar'];
const VALID_STATUSES = ['all', 'confirmed', 'canceled'];
const VALID_SORTS = ['az', 'za', 'newest', 'oldest'];

type ValidBookingView = 'list' | 'calendar';
type ValidBookingStatus = 'all' | 'confirmed' | 'canceled';
type ValidBookingSort = 'az' | 'za' | 'newest' | 'oldest';

interface ValidatedSearchParams {
  view: ValidBookingView;
  status: ValidBookingStatus;
  sort: ValidBookingSort | undefined;
  search: string | undefined;
}

function ValidateSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): ValidatedSearchParams {
  let {status, sort, search, view} = searchParams;

  if (!VALID_STATUSES.includes(status as ValidBookingStatus)) {
    status = 'all';
  }

  if (sort && !VALID_SORTS.includes(sort as ValidBookingSort)) {
    sort = undefined;
  }

  if (view && !VALID_VIEWS.includes(view as ValidBookingView)) {
    view = 'list';
  }

  return {
    view: view as ValidBookingView,
    status: status as ValidBookingStatus,
    sort: sort as ValidBookingSort | undefined,
    search: search as string | undefined
  };
}

async function getBookingData(status: ValidatedSearchParams['status']) {
  return status === 'all' ? getAllBookings() : getBookingsByStatus(status);
}

interface BookingPageProps {
  // params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function BookingPage({
  // params,
  searchParams
}: BookingPageProps) {
  let {status, search, sort, view} = ValidateSearchParams(searchParams);

  const bookings = (await getBookingData(status)).filter((booking) => {
    if (!search) {
      return true;
    }
    const searchLower = search.toLowerCase();
    return (
      booking.title.toLowerCase().includes(searchLower) ||
      booking.organizer.toLowerCase().includes(searchLower)
    );
  });
  if (sort) {
    bookings.sort((a, b) => {
      if (sort === 'az') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'za') {
        return b.title.localeCompare(a.title);
      } else if (sort === 'newest') {
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      } else if (sort === 'oldest') {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }
      return 0;
    });
  }

  return (
    <PageLayout title="Home">
      <Header variant="scheduling" />
      <div className="px-8">
        <Divider.Root />
      </div>

      <div className="w-full gap-8 p-8">
        <div className="flex justify-between">
          <BookingFilter status={status} />
          <div className="flex items-center justify-end gap-2">
            <BookingSearch search={search} />
            <ValidBookingSort sort={sort} />
            <BookingViewControl view={view} />
          </div>
        </div>
      </div>
      <div className="w-full gap-8 px-8">
        <BookingList bookings={bookings} />
      </div>
    </PageLayout>
  );
}
