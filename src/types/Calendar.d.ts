import type {Frequency} from '~/prisma/zod-utils';

export type IntervalLimitUnit = 'day' | 'week' | 'month' | 'year';

export type IntervalLimit = Partial<
  Record<`PER_${Uppercase<IntervalLimitUnit>}`, number | undefined>
>;

export interface RecurringEvent {
  dtstart?: Date | undefined;
  interval: number;
  count: number;
  freq: Frequency;
  until?: Date | undefined;
  tzid?: string | undefined;
}

export type EventBusyDate = {
  start: Date | string;
  end: Date | string;
  source?: string | null;
};

export type EventBusyDetails = EventBusyDate & {
  title?: string;
  source?: string | null;
  userId?: string | null;
};