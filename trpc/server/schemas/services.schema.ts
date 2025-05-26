import {z} from 'zod';
import {SchedulingType, ServiceBadgeColor} from '~/prisma/enums';
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
    scheduleId: z.number().int().optional(),
    badgeColor: z.nativeEnum(ServiceBadgeColor).optional()
  })
  .partial({hidden: true, locations: true})
  .refine((data) => (data.teamId ? data.teamId && data.schedulingType : true), {
    path: ['schedulingType'],
    message: 'You must select a scheduling type for team events'
  });

export type EventTypeLocation = z.infer<
  typeof imports.eventTypeLocations
>[number];

export const ZCreateInputSchema = createEventTypeInput;

export type TCreateInputSchema = z.infer<typeof ZCreateInputSchema>;

// get details by id
export const ZGetInputSchema = z.object({
  id: z.number()
});

export type TGetInputSchema = z.infer<typeof ZGetInputSchema>;

// get all by viewer

export const filterQuerySchemaStrict = z.object({
  teamIds: z.number().array().optional(),
  // A user can only filter by only his userId
  upIds: z.string().array().max(1).optional(),
  schedulingTypes: z.nativeEnum(SchedulingType).array().optional()
});

export const ZEventTypeInputSchema = z
  .object({
    filters: filterQuerySchemaStrict.optional(),
    forRoutingForms: z.boolean().optional()
  })
  .nullish();

export type TEventTypeInputSchema = z.infer<typeof ZEventTypeInputSchema>;

export const ZGetEventTypesFromGroupSchema = z.object({
  filters: filterQuerySchemaStrict.optional(),
  forRoutingForms: z.boolean().optional(),
  cursor: z.number().nullish(),
  limit: z.number().default(10),
  group: z.object({
    teamId: z.number().nullish(),
    parentId: z.number().nullish()
  }),
  searchQuery: z.string().optional()
});

export type TGetEventTypesFromGroupSchema = z.infer<
  typeof ZGetEventTypesFromGroupSchema
>;

// Delete

export const ZDeleteInputSchema = z.object({
  id: z.number()
});

export type TDeleteInputSchema = z.infer<typeof ZDeleteInputSchema>;

// duplicate

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

export const ZDuplicateInputSchema = EventTypeDuplicateInput;

export type TDuplicateInputSchema = z.infer<typeof ZDuplicateInputSchema>;