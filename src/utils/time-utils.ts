/**
 * Converts a time string in "HH:MM" format to a Date object
 * @param timeString Time string in "HH:MM" format
 * @returns Date object with the time set
 */
export function timeStringToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Converts a Date object to a time string in "HH:MM" format
 * @param date Date object
 * @returns Time string in "HH:MM" format
 */
export function dateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
} 