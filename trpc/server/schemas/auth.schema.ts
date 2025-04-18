import { z } from 'zod';
import { Locale } from '~/prisma/app/generated/prisma/client';

export const ZVerifyEmailInputSchema = z.object({
  token: z.string(),
  identifier: z.string()
});

export const ZSendVerificationEmailInputSchema = z.object({
  email: z.string().email()
});

export const ZRequestPasswordResetInputSchema = z.object({
  email: z.string().email()
});

export const ZResetPasswordInputSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z.string().min(8)
});

export const ZUpdateLocaleInputSchema = z.object({
  locale: z.nativeEnum(Locale)
});

export type TVerifyEmailInputSchema = z.infer<typeof ZVerifyEmailInputSchema>;
export type TSendVerificationEmailInputSchema = z.infer<typeof ZSendVerificationEmailInputSchema>;
export type TRequestPasswordResetInputSchema = z.infer<typeof ZRequestPasswordResetInputSchema>;
export type TResetPasswordInputSchema = z.infer<typeof ZResetPasswordInputSchema>;
export type TUpdateLocaleInputSchema = z.infer<typeof ZUpdateLocaleInputSchema>; 