import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Utility function to handle BigInt serialization
 * This is needed because JSON.stringify cannot handle BigInt values directly
 */
export function serializeObject<T extends Record<string, any>>(
  obj: T | null
): T | null {
  if (!obj) return null;

  // Create a new object to avoid mutating the original
  const serialized: T = {...obj};

  // Iterate over the object keys and convert BigInt to string
  for (const key in serialized) {
    if (typeof serialized[key] === 'bigint') {
      serialized[key] = serialized[key].toString() as any;
    }
  }

  return serialized;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
