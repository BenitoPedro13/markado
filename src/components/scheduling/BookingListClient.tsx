'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { trpc } from '~/trpc/client';
import BookingList from './BookingList';
import BookingFilter from './BookingFilter';
import BookingSearch from './BookingSearch';
import BookingViewControl from './BookingViewControl';
import { BookingSort as ValidBookingSort } from './BookingSort';
import { useTRPC } from '@/utils/trpc';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Booking } from '@/data/bookings';
import BookingListSkeleton from '@/components/skeletons/BookingListSkeleton';
import WeeklyCalendar from '@/components/booking/CalendarView/WeeklyCalendar';
import { CalendarTest } from '@/components/booking/CalendarView/CalendarTest';

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
  let { status, sort, search, view } = searchParams;

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
    search: search as string | undefined,
  };
}

// Map tRPC status to our local status format
function mapTrpcStatusToLocalStatus(trpcStatus: string): ValidBookingStatus {
  switch (trpcStatus) {
    case 'upcoming':
    case 'unconfirmed':
      return 'confirmed';
    case 'cancelled':
      return 'canceled';
    default:
      return 'all';
  }
}

// Map local status to tRPC status
function mapLocalStatusToTrpcStatus(localStatus: ValidBookingStatus): 'upcoming' | 'unconfirmed' | 'cancelled' | 'recurring' | 'past' {
  switch (localStatus) {
    case 'confirmed':
      return 'upcoming';
    case 'canceled':
      return 'cancelled';
    case 'all':
    default:
      return 'upcoming';
  }
}

// // Transform tRPC booking to local booking format
// function transformTrpcBooking(trpcBooking: any): Booking {
//   return {
//     id: trpcBooking.id,
//     title: (trpcBooking.title || trpcBooking.eventType?.title || 'Untitled').includes(' entre ') 
//       ? (trpcBooking.title || trpcBooking.eventType?.title || 'Untitled').split(' entre ')[0] 
//       : (trpcBooking.title || trpcBooking.eventType?.title || 'Untitled'),
//     duration: trpcBooking.eventType?.length || 30,
//     startTime: new Date(trpcBooking.startTime),
//     endTime: new Date(trpcBooking.endTime),
//     organizer: trpcBooking.user?.name || trpcBooking.user?.email || 'Unknown',
//     type: (trpcBooking.location?.includes('Meet') || trpcBooking.location?.includes('Teams')) ? 'online' : 'presential',
//     participants: trpcBooking.attendees?.map((attendee: any) => attendee.name || attendee.email) || [],
//     status: trpcBooking.status === 'CANCELLED' ? 'canceled' : 'confirmed',
//     location: trpcBooking.location || undefined,
//   };
// }

function transformTrpcBooking(trpcBooking: any): Booking {
  // Extract the base title from trpcBooking
  const rawTitle = trpcBooking.title || trpcBooking.eventType?.title || 'Untitled';

  // Clean the title by removing participant names after "entre" or "between"
  const cleanTitle = (title: string): string => {
    const separators = [' entre ', ' between '];

    for (const separator of separators) {
      if (title.includes(separator)) {
        return title.split(separator)[0];
      }
    }

    return title;
  };

  // Determine meeting type based on location
  const getMeetingType = (location?: string): 'online' | 'presential' => {
    if (!location) return 'presential';
    const loc = String(location).toLowerCase();
    const isOnline =
      loc.includes('integrations:google:meet') ||
      loc.includes('google meet') ||
      loc.includes('meet') ||
      loc.includes('zoom') ||
      loc.includes('teams');
    return isOnline ? 'online' : 'presential';
  };

  // Extract participant names from attendees
  const getParticipants = (attendees?: any[]): string[] => {
    return attendees?.map((attendee: any) => attendee.name || attendee.email) || [];
  };

  // Convert booking status
  const getBookingStatus = (status?: string): 'canceled' | 'confirmed' => {
    return status === 'CANCELLED' ? 'canceled' : 'confirmed';
  };

  // Prefer a readable address/value for in-person bookings
  let resolvedLocation: string | undefined = trpcBooking.location || undefined;
  const isOnlineType = getMeetingType(resolvedLocation) === 'online';
  if (!isOnlineType) {
    const responsesLoc = trpcBooking?.responses?.location;
    const candidateFromResponses =
      (responsesLoc?.optionValue as string | undefined) ||
      (responsesLoc?.value as string | undefined);
    const candidateFromMetadata = trpcBooking?.metadata?.location?.address as string | undefined;
    // Try eventType's configured address (when organizer set an address in service setup)
    const locs = (trpcBooking?.eventType?.locations as Array<any> | undefined) || [];
    const fromEventType = (() => {
      const inPerson = locs.find((l) => l?.type === 'inPerson' && typeof l.address === 'string' && l.address.trim());
      if (inPerson) return inPerson.address as string;
      const attendee = locs.find(
        (l) => l?.type === 'attendeeInPerson' && typeof l.attendeeAddress === 'string' && l.attendeeAddress.trim()
      );
      if (attendee) return attendee.attendeeAddress as string;
      const generic = locs.find((l) => typeof l.address === 'string' && l.address.trim());
      return generic?.address as string | undefined;
    })();

    const candidate = candidateFromResponses || candidateFromMetadata || fromEventType;
    const isToken = (val?: string) => {
      if (!val) return false;
      const v = val.toLowerCase();
      return v === 'inperson' || v === 'in_person' || v === 'in person';
    };
    if (candidate && !isToken(candidate)) {
      resolvedLocation = candidate;
    }
  }

  return {
    uid: trpcBooking.uid ?? String(trpcBooking.id),
    id: trpcBooking.id,
    title: cleanTitle(rawTitle),
    duration: trpcBooking.eventType?.length || 30,
    startTime: new Date(trpcBooking.startTime),
    endTime: new Date(trpcBooking.endTime),
    organizer: trpcBooking.user?.name || trpcBooking.user?.email || 'Unknown',
    type: getMeetingType(trpcBooking.location),
    participants: getParticipants(trpcBooking.attendees),
    status: getBookingStatus(trpcBooking.status),
    location: resolvedLocation,
  };
}

interface BookingListClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BookingListClient({ searchParams }: BookingListClientProps) {
  const trpc = useTRPC();
  const { status, search, sort, view } = ValidateSearchParams(searchParams);
  const [searchTerm, setSearchTerm] = useState(search || '');

  // Map local status to tRPC status
  const trpcStatus = mapLocalStatusToTrpcStatus(status);

  // Use tRPC query
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(trpc.booking.get.infiniteQueryOptions(
    {
      limit: 10,
      filters: {
        status: trpcStatus,
      },
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  ));

  // Transform and filter bookings
  const bookings = useMemo(() => {
    if (!data?.pages) return [];

    const allBookings = data.pages.flatMap((page) =>
      page.bookings.map(transformTrpcBooking)
    );

    // Apply search filter
    let filteredBookings = allBookings;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredBookings = allBookings.filter((booking) =>
        booking.title.toLowerCase().includes(searchLower) ||
        booking.organizer.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sort) {
      filteredBookings.sort((a, b) => {
        if (sort === 'az') {
          return a.title.localeCompare(b.title);
        } else if (sort === 'za') {
          return b.title.localeCompare(a.title);
        } else if (sort === 'newest') {
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        } else if (sort === 'oldest') {
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        }
        return 0;
      });
    }

    return filteredBookings;
  }, [data, searchTerm, sort]);

  useEffect(() => setSearchTerm(search || ''), [search]);

  if (isLoading) {
    return <BookingListSkeleton />;
  }

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  return (
    <>
      <div className="w-full gap-8 p-8">
        <div className="flex justify-between">
          <BookingFilter status={status} />
          <div className="flex items-center justify-end gap-2">
            <BookingSearch search={searchTerm} />
            <ValidBookingSort sort={sort} />
            <BookingViewControl view={view} />
          </div>
        </div>
      </div>
      <div className="w-full gap-8 px-8">
        {view === 'list' &&
          (<>
            <BookingList bookings={bookings} />
            {hasNextPage && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                </button>
              </div>
            )}
          </>

          )
        }
        {view === 'calendar' && (
          // <WeeklyCalendar bookings={bookings} />
          <CalendarTest bookings={bookings} />
        )}
      </div>
    </>
  )
} 
