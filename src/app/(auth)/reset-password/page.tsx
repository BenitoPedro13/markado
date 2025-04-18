'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTRPC } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiLockFill } from '@remixicon/react';
import { useState, Suspense } from 'react';
import { signInWithEmailPassword } from '@/components/auth/auth-actions';

const resetPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const t = useTranslations('ResetPasswordPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const redirectTo = searchParams.get('redirect') || '/';

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const resetPassword = useMutation(trpc.resetPassword.mutationOptions({
    onSuccess: async (data) => {
      if (data.loginToken) {
        try {
          // Use the login token to sign in
          await signInWithEmailPassword(email!, data.loginToken, redirectTo);
        } catch (error) {
          console.error('Failed to auto-login:', error);
          // If auto-login fails, redirect to sign in page
          router.push('/sign-in?message=password_reset_success');
        }
      } else {
        // If no login token, redirect to sign in page
        router.push('/sign-in?message=password_reset_success');
      }
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    }
  }));

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);
    setError('');
    resetPassword.mutate({
      token,
      email,
      newPassword: data.password
    });
  };

  if (!token || !email) {
    return (
      <div className="flex flex-col items-center gap-4">
        <RoundedIconWrapper>
          <RiLockFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>
        <div className="text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('invalid_link')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('invalid_link_description')}
          </p>
        </div>
      </div>
    );
  }

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
            {t('reset_password')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('enter_new_password')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>
            {t('new_password')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="password"
              placeholder="• • • • • • • • • • "
              {...form.register('password')}
              required
            />
          </Input.Root>
          {form.formState.errors.password && (
            <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label>
            {t('confirm_password')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="password"
              placeholder="• • • • • • • • • • "
              {...form.register('confirmPassword')}
              required
            />
          </Input.Root>
          {form.formState.errors.confirmPassword && (
            <span className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</span>
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
          {isLoading ? t('resetting') : t('reset_password')}
        </span>
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
} 