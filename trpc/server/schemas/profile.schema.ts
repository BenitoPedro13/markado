import {z} from 'zod';
import {Locale} from '~/prisma/app/generated/prisma/client';

export const ZUpdateProfileInputSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  biography: z.string().optional(),
  image: z.string().optional(),
  timeZone: z.string().optional(),
  locale: z.nativeEnum(Locale).optional(),
  completedOnboarding: z.boolean().optional()
});

export type TUpdateProfileInputSchema = z.infer<
  typeof ZUpdateProfileInputSchema
>;
