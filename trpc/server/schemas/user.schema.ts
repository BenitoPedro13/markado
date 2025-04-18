import { z } from 'zod';

export const ZUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  image: z.string().optional(),
});

export const ZUserUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
});

export type TUserInputSchema = z.infer<typeof ZUserInputSchema>;
export type TUserUpdateSchema = z.infer<typeof ZUserUpdateSchema>; 