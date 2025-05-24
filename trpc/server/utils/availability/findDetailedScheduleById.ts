import {getWorkingHours} from '@/lib/availability';
import dayjs from '@/lib/dayjs';
import {Schedule, TimeRange} from '@/types/scheadule';
import {Availability} from '~/prisma/app/generated/prisma/client';
import { yyyymmdd } from '@/lib/date-fns';

import type { PrismaClient } from '~/prisma/app/generated/prisma/client';

type ScheduleAvailability = Pick<
  Availability,
  'days' | 'startTime' | 'endTime'
>[];
type ScheduleOverride = Pick<Availability, 'date' | 'startTime' | 'endTime'>[];

export function transformWorkingHours(schedule: {
  timeZone: string | null;
  availability: ScheduleAvailability;
}) {
  return getWorkingHours(
    {timeZone: schedule.timeZone || undefined, utcOffset: 0},
    schedule.availability || []
  );
}

export function transformAvailability(schedule: {
  availability: ScheduleAvailability;
}) {
  return transformScheduleToAvailability(schedule).map((a) =>
    a.map((startAndEnd) => ({
      ...startAndEnd,
      end: new Date(
        startAndEnd.end.toISOString().replace('23:59:00.000Z', '23:59:59.999Z')
      )
    }))
  );
}

export const transformScheduleToAvailability = (schedule: {
  availability: ScheduleAvailability;
}) => {
  return schedule.availability.reduce(
    (schedule: Schedule, availability) => {
      availability.days.forEach((day) => {
        schedule[day].push({
          start: new Date(
            Date.UTC(
              new Date().getUTCFullYear(),
              new Date().getUTCMonth(),
              new Date().getUTCDate(),
              availability.startTime.getUTCHours(),
              availability.startTime.getUTCMinutes()
            )
          ),
          end: new Date(
            Date.UTC(
              new Date().getUTCFullYear(),
              new Date().getUTCMonth(),
              new Date().getUTCDate(),
              availability.endTime.getUTCHours(),
              availability.endTime.getUTCMinutes()
            )
          )
        });
      });
      return schedule;
    },
    Array.from([...Array(7)]).map(() => [])
  );
};

export function transformDateOverrides(
  schedule: {availability: ScheduleOverride},
  timeZone: string
) {
  return schedule.availability.reduce(
    (acc, override) => {
      // only if future date override
      const currentUtcOffset = dayjs().tz(timeZone).utcOffset();
      const currentTimeInTz = dayjs().utc().add(currentUtcOffset, 'minute');

      if (
        !override.date ||
        dayjs(override.date).isBefore(currentTimeInTz, 'day')
      ) {
        return acc;
      }
      const newValue = {
        start: dayjs
          .utc(override.date)
          .hour(override.startTime.getUTCHours())
          .minute(override.startTime.getUTCMinutes())
          .toDate(),
        end: dayjs
          .utc(override.date)
          .hour(override.endTime.getUTCHours())
          .minute(override.endTime.getUTCMinutes())
          .toDate()
      };
      const dayRangeIndex = acc.findIndex(
        // early return prevents override.date from ever being empty.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (item) => yyyymmdd(item.ranges[0].start) === yyyymmdd(override.date!)
      );
      if (dayRangeIndex === -1) {
        acc.push({ranges: [newValue]});
        return acc;
      }
      acc[dayRangeIndex].ranges.push(newValue);
      return acc;
    },
    [] as {ranges: TimeRange[]}[]
  );
}

export const setupDefaultSchedule = async (
  userId: string,
  scheduleId: number,
  prisma: PrismaClient
) => {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      defaultScheduleId: scheduleId
    }
  });
};
