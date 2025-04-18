import { z } from 'zod';

export const ZTimezoneInputSchema = z.object({
  timezone: z.string()
});

export type TTimezoneInputSchema = z.infer<typeof ZTimezoneInputSchema>; 