'use client';

import GoogleLogo from '@/../public/images/google_logo.svg';
import {Root as Button} from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import {Asterisk, Root as Label} from '@/components/align-ui/ui/label';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {RiUserAddFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {Suspense, useState, useEffect} from 'react';

import {IconGoogle} from '@/components/auth/sign-in';
import * as SocialButton from '@/components/align-ui/ui/social-button';
import {useSearchParams} from 'next/navigation';
import AuthSkeleton from '@/components/skeletons/AuthSkeleton';
import {useAuthStore} from '@/stores/auth-store';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('SignInForm.invalid_email'),
  password: z.string().min(8, 'SignInForm.min_password_length')
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const t = useTranslations('SignInForm');
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const errorParam = searchParams.get('error');
  const {
    signInWithEmail,
    signInWithGoogle,
    isLoading,
    error: authStoreError
  } = useAuthStore();
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthAccountNotLinked':
          setOauthError(t('oauth_account_not_linked'));
          break;
        case 'AccountLinkingFailed':
          setOauthError(t('account_linking_failed'));
          break;
        case 'Signin':
          // This is a general sign-in error, often caused by invalid credentials
          setOauthError(t('invalid_credentials'));
          break;
        case 'OAuthSignin':
          setOauthError(t('oauth_signin_error'));
          break;
        case 'OAuthCallback':
          setOauthError(t('oauth_callback_error'));
          break;
        default:
          setOauthError(t('general_error'));
      }
    }
  }, [errorParam, t]);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Translate validation messages
  const getTranslatedError = (error: any) => {
    if (error?.message) {
      return t(error.message);
    }
    return error?.message;
  };

  const onSubmit = async (data: SignInFormData) => {
    await signInWithEmail(data.email, data.password, redirectTo);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(redirectTo);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiUserAddFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('welcome_again')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">{t('to_start')}</p>
        </div>
      </div>

      <SocialButton.Root
        brand="google"
        mode="stroke"
        className="w-full text-text-sub-600 hover:text-text-strong-950"
        type="button"
        onClick={handleGoogleSignIn}
      >
        <SocialButton.Icon as={IconGoogle} />
        <span className="ml-2 ">{t('enter_with_your_google_account')}</span>
      </SocialButton.Root>

      <OrDivider />

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
            <span className="text-red-500 text-sm">
              {getTranslatedError(form.formState.errors.email)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Label>
              {t('password')}
              <Asterisk />
            </Label>
            <Link
              href={'/password-recovery'}
              className="text-label-xs text-text-sub-600"
            >
              {t('forgot_your_password')}
            </Link>
          </div>

          <Input.Root>
            <Input.Input
              type="password"
              placeholder="• • • • • • • • • • "
              {...form.register('password')}
              required
            />
          </Input.Root>
          {form.formState.errors.password && (
            <span className="text-red-500 text-sm">
              {getTranslatedError(form.formState.errors.password)}
            </span>
          )}
        </div>

        {(authStoreError || oauthError) && (
          <div className="text-red-500 text-sm">
            {oauthError || authStoreError}
          </div>
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
          {isLoading ? t('loading') : t('start')}
        </span>
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-paragraph-sm text-text-sub-600">
          {t('dont_have_an_account')}
        </span>
        <Link
          className="text-label-sm text-text-strong-950 hover:border-b border-b-stroke-strong-950 transition"
          href={`/sign-up${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
        >
          {t('create')}
        </Link>
      </div>
    </form>
  );
};

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <Suspense fallback={<AuthSkeleton />}>
        <div className="flex items-center justify-center gap-4 w-full">
          <SignInForm />
        </div>
      </Suspense>
    </div>
  );
};

export default SignInPage;
