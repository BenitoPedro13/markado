'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTRPC } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiLockFill } from '@remixicon/react';
import { useState } from 'react';

const passwordRecoverySchema = z.object({
  email: z.string().email('PasswordRecoveryPage.invalid_email'),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

export default function PasswordRecoveryPage() {
  const t = useTranslations('PasswordRecoveryPage');
  const router = useRouter();
  const trpc = useTRPC();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    }
  });

  const requestPasswordReset = useMutation(trpc.requestPasswordReset.mutationOptions({
    onSuccess: () => {
      // Redirect to check-email page
      router.push(`/check-email?email=${encodeURIComponent(form.getValues('email'))}`);
    },
    onError: () => {
      setError('Failed to send password reset email. Please try again.');
      setIsLoading(false);
    }
  }));

  // Translate validation messages
  const getTranslatedError = (error: any) => {
    if (error?.message) {
      return t(error.message);
    }
    return error?.message;
  };

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    setIsLoading(true);
    setError('');
    requestPasswordReset.mutate({ email: data.email });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiLockFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('recover_password')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('enter_email_for_reset')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>
            {t('email')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="email"
              placeholder="hello@markado.co"
              {...form.register('email')}
              required
            />
          </Input.Root>
          {form.formState.errors.email && (
            <span className="text-red-500 text-sm">{getTranslatedError(form.formState.errors.email)}</span>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        type="submit"
        disabled={isLoading}
      >
        <span className="text-label-sm">
          {isLoading ? t('sending') : t('send_reset_link')}
        </span>
      </Button>
    </form>
  );
} 