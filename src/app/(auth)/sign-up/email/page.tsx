'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import { Root as Checkbox } from '@/components/align-ui/ui/checkbox';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import * as SocialButton from '@/components/align-ui/ui/social-button';
import { signInWithGoogle } from '@/components/auth/auth-actions';
import { IconGoogle } from '@/components/auth/sign-in';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { RiUserAddFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

const EmailForm = () => {
  const {forms, nextStep} = useSignUp();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const t = useTranslations('SignUpPage.EmailForm');

  const agree = forms.email.watch('agree');
  const setAgree = (value: boolean) => forms.email.setValue('agree', value);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agree) {
      forms.email.setError('agree', {
        message: t('must_agree_to_terms')
      });
      return;
    }

    nextStep();
  };

  const handleGoogleSignIn = async () => {
    // Pass the redirect URL to the sign-in function
    await signInWithGoogle(redirectTo);
  };

  // Translate validation messages
  const getTranslatedError = (error: any) => {
    if (error?.message === 'must_agree_to_terms') {
      return t('must_agree_to_terms');
    }
    return error?.message;
  };

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiUserAddFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('lets_start')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('insert_your_email')}
          </p>
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
        <span className="ml-2 ">{t('sign_up_with_google')}</span>
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
              required
              {...forms.email.register('email')}
            />
          </Input.Root>
        </div>
        <div className="flex gap-2">
          <Checkbox
            checked={agree}
            // required
            onCheckedChange={(value) => setAgree(value.valueOf() as boolean)}
          />
          <p className="text-label-sm text-text-sub-600">
            {t.rich('i_agree', {
              terms: (text) => (
                <Link href={'/'} className="text-text-strong-950 underline">
                  {text}
                </Link>
              ),
              privacy: (text) => (
                <Link href={'/'} className="text-text-strong-950 underline">
                  {text}
                </Link>
              )
            })}
          </p>
        </div>
        {forms.email.formState.errors.agree && (
          <span className="text-paragraph-xs text-red-500">
            {getTranslatedError(forms.email.formState.errors.agree)}
          </span>
        )}
      </div>

      <Button
        className="w-full"
        variant={'neutral'}
        mode="filled"
        type="submit"
      >
        <span className="text-label-sm">{t('start')}</span>
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-paragraph-sm text-text-sub-600">
          {t('already_have_an_account')}
        </span>
        <Link
          className="text-label-sm text-text-strong-950 hover:border-b border-b-stroke-strong-950 transition"
          href={'/sign-in'}
        >
          {t('sign_in')}
        </Link>
      </div>
    </form>
  );
};

export default EmailForm;
