import {z} from 'zod';

export const ZDestinationCalendarInputSchema = z.object({
  integration: z.string(),
  externalId: z.string(),
  eventTypeId: z.number().nullish(),
  bookingId: z.number().nullish()
});

export type TDestinationCalendarInputSchema = z.infer<
  typeof ZDestinationCalendarInputSchema
>;
