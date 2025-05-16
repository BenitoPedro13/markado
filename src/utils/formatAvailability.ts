import dayjs from "@/lib/dayjs"

import {inferRouterOutputs} from '@trpc/server';
import {AppRouter} from '~/trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ServerAvailabilityResponse = RouterOutput['availability']['getAll'][number];
export type ServerDetailedAvailabilityResponse =
  RouterOutput['availability']['findDetailedScheduleById']

// Map day numbers to Portuguese abbreviations
const dayAbbreviations: Record<number, string> = {
  1: 'seg.',
  2: 'ter.',
  3: 'qua.',
  4: 'qui.',
  5: 'sex.',
  6: 'sab.',
  7: 'dom.',
};

/**
 * Converts time from UTC to the specified timezone using dayjs
 * @param date Date object in UTC
 * @param timezone Target timezone (e.g., 'America/Sao_Paulo')
 * @returns Formatted time string in HH:MM format
 */
const formatTimeWithTimezone = (date: Date, timezone: string): string => {
  return dayjs(date)
    .tz(timezone)
    .format('HH:mm');
};

/**
 * Formats a list of availability entries into a readable string
 * @param availabilities Array of availability objects from the server
 * @returns A string like "seg. - sex., 9:00 até 17:00"
 */
export const formatAvailabilitySchedule = (
  availabilities: ServerAvailabilityResponse[],
  timezone: string
): string => {
  if (!availabilities.length) return '';

  // Group availabilities by day
  const availabilitiesByDay: Record<number, ServerAvailabilityResponse[]> = {};
  
  availabilities.forEach(avail => {
    const day = avail.days[0];
    if (!availabilitiesByDay[day]) {
      availabilitiesByDay[day] = [];
    }
    availabilitiesByDay[day].push(avail);
  });

  // Sort days
  const sortedDays = Object.keys(availabilitiesByDay).map(Number).sort((a, b) => a - b);
  
  // Get consecutive day ranges
  const dayGroups: number[][] = [];
  let currentGroup: number[] = [];
  
  sortedDays.forEach((day, index) => {
    if (index === 0 || day !== sortedDays[index - 1] + 1) {
      if (currentGroup.length > 0) {
        dayGroups.push([...currentGroup]);
        currentGroup = [];
      }
    }
    currentGroup.push(day);
    
    if (index === sortedDays.length - 1) {
      dayGroups.push([...currentGroup]);
    }
  });

  // Format day ranges
  const dayRanges = dayGroups.map(group => {
    if (group.length === 1) {
      return dayAbbreviations[group[0]];
    } else {
      return `${dayAbbreviations[group[0]]} - ${dayAbbreviations[group[group.length - 1]]}`;
    }
  });

  // Get overall time range (earliest start to latest end)
  const startTime = formatTimeWithTimezone(
    availabilities.reduce((earliest, curr) => 
      curr.startTime < earliest.startTime ? curr : earliest
    ).startTime,
    timezone
  );
  
  const endTime = formatTimeWithTimezone(
    availabilities.reduce((latest, curr) => 
      curr.endTime > latest.endTime ? curr : latest
    ).endTime,
    timezone
  );

  // Join day ranges with commas
  const daysFormatted = dayRanges.join(', ');

  // Return the full formatted string
  return `${daysFormatted}, ${startTime} até ${endTime}`;
};

/**
 * Formats the weekly schedule from a detailed schedule object (findDetailedScheduleById)
 * @param detailed The full object returned by findDetailedScheduleById
 * @returns A string like "seg. - sex., 9:00 até 17:00"
 */
export function formatScheduleFromDetailed(
  detailed: ServerDetailedAvailabilityResponse
): string {
  const { availability, timeZone } = detailed;
  if (!availability || !availability.length) return '';

  // Collect all days with their time ranges
  const daysWithRanges: { day: number; ranges: { start: Date; end: Date }[] }[] = [];
  for (let day = 0; day < availability.length; day++) {
    if (availability[day] && availability[day].length > 0) {
      daysWithRanges.push({ day: day + 1, ranges: availability[day] }); // +1 to match dayAbbreviations
    }
  }
  if (!daysWithRanges.length) return '';

  // Group days by identical time ranges
  const groupKey = (ranges: { start: Date; end: Date }[]) =>
    ranges
      .map(r => `${r.start.toISOString()}-${r.end.toISOString()}`)
      .join('|');

  const groups: { key: string; days: number[]; ranges: { start: Date; end: Date }[] }[] = [];
  daysWithRanges.forEach(({ day, ranges }) => {
    const key = groupKey(ranges);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.key === key) {
      lastGroup.days.push(day);
    } else {
      groups.push({ key, days: [day], ranges });
    }
  });

  // Format each group
  const formattedGroups = groups.map(group => {
    // Format day range
    let dayLabel = '';
    if (group.days.length === 1) {
      dayLabel = dayAbbreviations[group.days[0]];
    } else {
      dayLabel = `${dayAbbreviations[group.days[0]]} - ${dayAbbreviations[group.days[group.days.length - 1]]}`;
    }
    // Format time ranges
    const timeLabel = group.ranges
      .map(r => `${formatTimeWithTimezone(r.start, timeZone)} até ${formatTimeWithTimezone(r.end, timeZone)}`)
      .join(', ');
    return `${dayLabel}, ${timeLabel}`;
  });

  return formattedGroups.join(' | ');
} 

/**
 * Groups availabilities by scheduleId
 * This function can handle any structure as long as it has scheduleId, days, 
 * startTime, endTime and schedule properties
 */
export type TFormatedAvailabilitiesBySchedule = {
  scheduleId: number;
  scheduleName: string;
  timeZone: string;
  availability: string;
  isDefault: boolean;
};

export const groupAvailabilitiesBySchedule = <T extends ServerAvailabilityResponse>(
  availabilities: T[]
): TFormatedAvailabilitiesBySchedule[] => {
  if (!availabilities.length) return [];

  const grouped: Record<string, T[]> = {};

  availabilities.forEach((avail) => {
    if (!avail.scheduleId) return;

    const scheduleIdStr = String(avail.scheduleId);
    if (!grouped[scheduleIdStr]) {
      grouped[scheduleIdStr] = [];
    }
    grouped[scheduleIdStr].push(avail);
  });

  const result = Object.entries(grouped)
    .map(([scheduleId, items]) => {
      const scheduleInfo = items[0].schedule;
      if (!scheduleInfo) return null;

      // Use the user's timezone from the schedule
      const userTimezone = scheduleInfo.timeZone || 'America/Sao_Paulo';

      return {
        scheduleId: Number(scheduleId),
        scheduleName: scheduleInfo.name,
        timeZone: userTimezone,
        availability: formatAvailabilitySchedule(items, userTimezone),
        isDefault: Boolean(
          scheduleInfo.user?.defaultScheduleId === Number(scheduleId)
        )
      };
    })
    .filter(Boolean) as TFormatedAvailabilitiesBySchedule[];

  return result;
};