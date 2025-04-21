/**
 * Converts a date from one timezone to another
 * @param date The date to convert
 * @param fromTimeZone The source timezone
 * @param toTimeZone The target timezone
 * @returns A new date object in the target timezone
 */
export function convertDateToTimezone(date: Date, fromTimeZone: string, toTimeZone: string): Date {
  // Get the date string in the source timezone
  const dateStr = date.toLocaleString('en-US', {
    timeZone: fromTimeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Create a new date object in the target timezone
  const targetDate = new Date(dateStr);
  const targetDateStr = targetDate.toLocaleString('en-US', {
    timeZone: toTimeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return new Date(targetDateStr);
}

/**
 * Formats a date for display in a specific timezone
 * @param date The date to format
 * @param timeZone The timezone to format the date in
 * @returns A formatted string representation of the date in the specified timezone
 */
export function formatDateInTimezone(date: Date, timeZone: string): string {
  return date.toLocaleString('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Gets the timezone offset in minutes for a specific timezone at a specific date
 * @param date The date to get the offset for
 * @param timeZone The timezone to get the offset for
 * @returns The offset in minutes
 */
export function getTimezoneOffset(date: Date, timeZone: string): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return (utcDate.getTime() - tzDate.getTime()) / 60000;
}

/**
 * Checks if two timezones are equivalent (have the same offset at a given time)
 * @param timezone1 First timezone
 * @param timezone2 Second timezone
 * @param date The date to check the offset at
 * @returns boolean indicating if the timezones are equivalent
 */
export function areTimezonesEquivalent(timezone1: string, timezone2: string, date: Date = new Date()): boolean {
  return getTimezoneOffset(date, timezone1) === getTimezoneOffset(date, timezone2);
} 