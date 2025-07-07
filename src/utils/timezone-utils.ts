import dayjs from '@/lib/dayjs';

/**
 * Detects the user's current timezone using multiple methods
 * @returns The detected timezone string or fallback to America/Sao_Paulo
 */
export function getUserTimezone(): string {
  try {
    const intlTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (intlTimezone && intlTimezone !== 'undefined') {
      return intlTimezone;
    }
  } catch (error) {
    console.warn('Failed to detect timezone using Intl API:', error);
  }

  try {
    const dayjsTimezone = dayjs.tz.guess();
    if (dayjsTimezone && dayjsTimezone !== 'undefined') {
      return dayjsTimezone;
    }
  } catch (error) {
    console.warn('Failed to detect timezone using dayjs:', error);
  }

  return 'America/Sao_Paulo';
}

/**
 * Gets the timezone with fallback - priority: user timezone from DB > auto-detected > fallback
 * @param userTimezone The timezone stored in the user database (can be null)
 * @returns The final timezone to use
 */
export function getTimezoneWithFallback(userTimezone?: string | null): string {
  if (userTimezone && userTimezone !== 'null' && userTimezone !== 'undefined') {
    return userTimezone;
  }

  return getUserTimezone();
} 