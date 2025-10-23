export function getMultipleDurationValue(
  multipleDurationConfig: number[] | undefined,
  queryDuration: string | string[] | null | undefined,
  defaultValue: number
): number | null {
  if (!multipleDurationConfig) return null;
  if (multipleDurationConfig.includes(Number(queryDuration)))
    return Number(queryDuration);
  return defaultValue;
} 