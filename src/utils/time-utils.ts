import dayjs from '@/lib/dayjs';

/**
 * Converts a time string in "HH:MM" format to a Date object in UTC
 * @param timeString Time string in "HH:MM" format
 * @param timezone The timezone to convert from (e.g., 'America/Sao_Paulo')
 * @returns Date object with the time set in UTC
 */
export function timeStringToDate(
  timeString: string,
  timezone: string = 'UTC'
): Date {
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
  return dayjs(date).tz(timezone).format('HH:mm');
}

/**
 * Converts a Date object to a string in "YYYY-MM-DD-HH-mm" format in UTC.
 * @param date Date object
 * @returns String in "YYYY-MM-DD-HH-mm" format
 */
export function dateToCalendarDateString(date: Date): string {
  return dayjs(date).utc().format('YYYY-MM-DD-HH-mm');
}

/**
 * Converts a string in "YYYY-MM-DD-HH-mm" format to a Date object in UTC
 * @param dateString String in "YYYY-MM-DD-HH-mm" format
 * @returns Date object in UTC
 */
export function calendarDateStringToDate(dateString: string): Date {
  const [year, month, day, hours, minutes] = dateString.split('-').map(Number);
  // Validate the date components
  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hours) ||
    isNaN(minutes)
  ) {
    throw new Error('Invalid date string format');
  }
  // Check if the date is valid
  const date = dayjs()
    .set('year', year)
    .set('month', month - 1) // Month is zero-based
    .set('date', day)
    .set('hour', hours)
    .set('minute', minutes)
    .set('second', 0)
    .set('millisecond', 0);

  if (!date.isValid()) {
    throw new Error('Invalid date string format');
  }
  // Check if the date is in the future
  const now = dayjs().utc();
  if (date.isBefore(now)) {
    throw new Error('Date is in the past');
  }

  return date.utc().toDate();
}
