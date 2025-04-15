'use client';

import GoogleLogo from '@/../public/images/google_logo.svg';
import {Root as Button} from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import {Asterisk, Root as Label} from '@/components/align-ui/ui/label';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {RiUserAddFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {FormEvent, Suspense} from 'react';
import {signInWithGoogle} from '@/components/auth/auth-actions';
import {IconGoogle} from '@/components/auth/sign-in';
import * as SocialButton from '@/components/align-ui/ui/social-button';
import { useSearchParams } from 'next/navigation';

const SignInForm = () => {
  const t = useTranslations('SignInForm');
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(redirectTo);
  };

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-8 justify-center items-center max-w-[392px] w-full"
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
            <Input.Input type="email" placeholder="hello@markado.co" />
          </Input.Root>
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
            <Input.Input type="password" placeholder="• • • • • • • • • • " />
          </Input.Root>
        </div>
      </div>

      <Button className="w-full" variant="primary" mode="filled" type="submit">
        <span className="text-label-sm">{t('start')}</span>
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-paragraph-sm text-text-sub-600">
          {t('dont_have_an_account')}
        </span>
        <Link
          className="text-label-sm text-text-strong-950 hover:border-b border-b-stroke-strong-950 transition"
          href={`/pt/sign-up${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
        >
          {t('create')}
        </Link>
      </div>
    </form>
  );
};

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
};

export default SignInPage;
