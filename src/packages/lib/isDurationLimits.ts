import { intervalLimitsType } from "~/prisma/zod-utils";
import type { IntervalLimit } from "@/types/Calendar";

export function isDurationLimit(obj: unknown): obj is IntervalLimit {
  return intervalLimitsType.safeParse(obj).success;
}

export function parseDurationLimit(obj: unknown): IntervalLimit | null {
  let durationLimit: IntervalLimit | null = null;
  if (isDurationLimit(obj)) durationLimit = obj;
  return durationLimit;
}
