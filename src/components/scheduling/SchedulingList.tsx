'use client';

import {useBooking} from '@/contexts/bookings/BookingContext';
import Scheduling from './Scheduling';
import * as Divider from '@/components/align-ui/ui/divider';

export default function SchedulingList() {
  const {filteredBookings} = useBooking();

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {filteredBookings.map((scheduling) => (
        <div key={scheduling.id}>
          <Scheduling
            key={scheduling.id}
            id={scheduling.id}
            title={scheduling.title}
            duration={scheduling.duration}
            startTime={scheduling.startTime}
            endTime={scheduling.endTime}
            organizer={scheduling.organizer}
            type={scheduling.type}
            status={scheduling.status}
            location={scheduling.location}
          />
          <Divider.Root />
        </div>
      ))}
    </div>
  );
}
