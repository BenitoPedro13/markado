import {z} from 'zod';
import {Locale} from '~/prisma/app/generated/prisma/client';

export const ZUpdateSettingsProfileSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  biography: z.string().optional(),
  image: z.string().optional()
});

export const ZUpdateSettingsGeneralSchema = z.object({
  locale: z.nativeEnum(Locale).optional(),
  timeZone: z.string().optional(),
  // timeFormat is a number that is either 12 or 24 in Number, not string
  timeFormat: z.union([z.literal(12), z.literal(24)]).optional(),
  weekStart: z.string().optional()
});
