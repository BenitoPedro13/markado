'use client';

import GoogleLogo from '@/../public/images/google_logo.svg';
import VerticalStripesPattern from '@/../public/patterns/vertical_stripes.svg';
import {
  Root as Button
} from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiUserAddFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent } from 'react';

const SignInForm = () => {
  const t = useTranslations('SignInForm');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      <Button className="w-full" variant="neutral" mode="stroke">
        <Image src={GoogleLogo} alt="" width={20} height={20} />
        <span className="text-label-sm">
          {t('enter_with_your_google_account')}
        </span>
      </Button>

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
          href={'/sign-up'}
        >
          {t('create')}
        </Link>
      </div>
    </form>
  );
};

const SignInPage = () => {
  const t = useTranslations('SignInPage');

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div className="relative flex flex-col flex-grow px-6 py-4">
        <main className="flex flex-grow justify-center">
          <SignInForm />
        </main>

        <div className="absolute bottom-0 -z-10 flex justify-center items-center min-w-full">
          <Image
            className=""
            draggable={false}
            alt=""
            src={VerticalStripesPattern}
            width={964}
          />
        </div>

        <footer className="self-end w-full flex justify-between items-center">
          <p className="text-paragraph-sm text-text-sub-600">
            &copy;{`${currentYear} ${t('markado')}`}
          </p>
          <LocaleSwitcher />
        </footer>
      </div>
    </div>
  );
};

export default SignInPage;
