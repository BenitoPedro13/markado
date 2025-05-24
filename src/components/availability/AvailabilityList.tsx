'use client';
import Availability from '@/components/availability/Availability';
import * as Divider from '@/components/align-ui/ui/divider';
import {
  TFormatedAvailabilitiesBySchedule
} from '@/utils/formatAvailability';
interface AvailabilityListProps {
  initialAllAvailability: TFormatedAvailabilitiesBySchedule[] | null;
}

export default function AvailabilityList({
  initialAllAvailability
}: AvailabilityListProps) {
  if (!initialAllAvailability) return null

  return (
    <div className="rounded-lg w-full border border-stroke-soft-200">
      {initialAllAvailability.map((data) => (
        <div key={data.scheduleId}>
          <Availability
            id={data.scheduleId}
            key={data.scheduleId}
            title={data.scheduleName}
            schedule={data.availability}
            timezone={data.timeZone}
            isDefault={data.isDefault}
          />
          {data !== initialAllAvailability[initialAllAvailability.length - 1] && (
            <Divider.Root />
          )}
        </div>
      ))}
    </div>
  );
}
