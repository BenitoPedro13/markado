import BookingListItem from './BookingListItem';
import * as Divider from '@/components/align-ui/ui/divider';
import {Booking} from '@/data/bookings';

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({bookings}: BookingListProps) {
  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {bookings.map((booking, index) => (
        <div key={booking.id}>
          <BookingListItem
            uid={booking.uid}
            key={booking.id}
            id={booking.id}
            title={booking.title}
            duration={booking.duration}
            startTime={booking.startTime}
            endTime={booking.endTime}
            organizer={booking.organizer}
            type={booking.type}
            status={booking.status}
            location={booking.location}
          />
          {index < bookings.length - 1 && <Divider.Root />}
        </div>
      ))}
    </div>
  );
}
