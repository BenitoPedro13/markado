import {z} from 'zod';
import {SchedulingType, ServiceBadgeColor} from '~/prisma/enums';
import * as imports from '~/prisma/zod-utils';
// import {templateTypeEnum} from '@/features/core/cal-ai-phone/zod-utils';
import {_DestinationCalendarModel, _EventTypeModel} from '~/prisma/zod';
import {
  customInputSchema,
  EventTypeMetaDataSchema,
  stringOrNumber
} from '~/prisma/zod-utils';
import {eventTypeBookingFields} from '~/prisma/zod-utils';

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
  slug: z.string(),
});

export type TGetInputSchema = z.infer<typeof ZGetInputSchema>;

// get all by viewer

export const filterQuerySchemaStrict = z.object({
  teamIds: z.number().array().optional(),
  // A user can only filter by only his userId
  upIds: z.string().array().max(1).optional(),
  schedulingTypes: z.nativeEnum(SchedulingType).array().optional(),
  hidden: z.boolean().nullable()
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

// Update

const aiPhoneCallConfig = z
  .object({
    generalPrompt: z.string(),
    enabled: z.boolean(),
    beginMessage: z.string().nullable(),
    yourPhoneNumber: z.string(),
    numberToCall: z.string(),
    guestName: z.string().nullable().optional(),
    guestEmail: z.string().nullable().optional(),
    guestCompany: z.string().nullable().optional(),
    // templateType: templateTypeEnum
  })
  .optional();

const hostSchema = z.object({
  userId: z.string(),
  profileId: z.number().or(z.null()).optional(),
  isFixed: z.boolean().optional(),
  priority: z.number().min(0).max(4).optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  scheduleId: z.number().optional().nullable()
});

const childSchema = z.object({
  owner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    eventTypeSlugs: z.array(z.string())
  }),
  hidden: z.boolean()
});

/** Optional fields */
const BaseEventTypeUpdateInput = _EventTypeModel
  .extend({
    isInstantEvent: z.boolean(),
    instantMeetingExpiryTimeOffsetInSeconds: z.number(),
    aiPhoneCallConfig,
    calAiPhoneScript: z.string(),
    customInputs: z.array(customInputSchema),
    destinationCalendar: _DestinationCalendarModel
      .pick({
        integration: true,
        externalId: true
      })
      .nullable(),
    users: z.array(z.string()),
    children: z.array(childSchema),
    hosts: z.array(hostSchema),
    schedule: z.number().nullable(),
    instantMeetingSchedule: z.number().nullable(),
    multiplePrivateLinks: z.array(z.string()),
    assignAllTeamMembers: z.boolean(),
    isRRWeightsEnabled: z.boolean(),
    metadata: EventTypeMetaDataSchema,
    bookingFields: eventTypeBookingFields
  })
  .partial()
  .extend(_EventTypeModel.pick({id: true}).shape);

const ZUpdateInputSchema = BaseEventTypeUpdateInput.extend({
  aiPhoneCallConfig: aiPhoneCallConfig.refine(
    (data) => {
      if (!data) return true;
      data.yourPhoneNumber = data.yourPhoneNumber || '';
      data.numberToCall = data.numberToCall || '';
      data.guestName = data.guestName ?? undefined;
      data.guestEmail = data.guestEmail ?? null;
      data.guestCompany = data.guestCompany ?? null;
      return true;
    },
    {
      message: 'Applying default values and transformations'
    }
  )
}).strict();
// only run infer over the simple type, excluding refines/transforms.
type TUpdateInputSchema = z.infer<typeof BaseEventTypeUpdateInput>;

export {ZUpdateInputSchema, type TUpdateInputSchema};


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