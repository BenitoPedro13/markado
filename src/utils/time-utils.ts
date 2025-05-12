import dayjs from "@/lib/dayjs"

/**
 * Converts a time string in "HH:MM" format to a Date object in UTC
 * @param timeString Time string in "HH:MM" format
 * @param timezone The timezone to convert from (e.g., 'America/Sao_Paulo')
 * @returns Date object with the time set in UTC
 */
export function timeStringToDate(timeString: string, timezone: string = 'UTC'): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a date object in the user's timezone and convert to UTC
  const date = dayjs()
    .tz(timezone)
    .set('hour', hours)
    .set('minute', minutes)
    .set('second', 0)
    .set('millisecond', 0)
    .utc()
    .toDate();
  
  return date;
}

/**
 * Converts a Date object to a time string in "HH:MM" format
 * @param date Date object
 * @param timezone The timezone to convert to (e.g., 'America/Sao_Paulo')
 * @returns Time string in "HH:MM" format
 */
export function dateToTimeString(date: Date, timezone: string = 'UTC'): string {
  return dayjs(date)
    .tz(timezone)
    .format('HH:mm');
} 