import {z} from 'zod';
import {SchedulingType} from '~/prisma/enums';
import * as imports from '~/prisma/zod-utils';

// Create

export const createEventTypeInput = z
  .object({
    title: z.string().min(1),
    slug: imports.eventTypeSlug,
    description: z.string().nullish(),
    length: z.number().int(),
    hidden: z.boolean(),
    teamId: z.number().int().nullish(),
    schedulingType: z.nativeEnum(SchedulingType).nullish(),
    locations: imports.eventTypeLocations,
    metadata: imports.EventTypeMetaDataSchema.optional(),
    disableGuests: z.boolean().optional(),
    slotInterval: z.number().min(0).nullish(),
    minimumBookingNotice: z.number().int().min(0).optional(),
    beforeEventBuffer: z.number().int().min(0).optional(),
    afterEventBuffer: z.number().int().min(0).optional(),
    scheduleId: z.number().int().optional()
  })
  .partial({hidden: true, locations: true})
  .refine((data) => (data.teamId ? data.teamId && data.schedulingType : true), {
    path: ['schedulingType'],
    message: 'You must select a scheduling type for team events'
  });

export const EventTypeDuplicateInput = z
  .object({
    id: z.number(),
    slug: z.string(),
    title: z.string().min(1),
    description: z.string(),
    length: z.number(),
    teamId: z.number().nullish()
  })
  .strict();

export type EventTypeLocation = z.infer<
  typeof imports.eventTypeLocations
>[number];

export const ZCreateInputSchema = createEventTypeInput;

export type TCreateInputSchema = z.infer<typeof ZCreateInputSchema>;
