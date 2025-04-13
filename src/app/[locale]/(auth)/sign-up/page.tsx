'use client';

import GoogleLogo from '@/../public/images/google_logo.svg';
import { Root as Button } from '@/components/align-ui/ui/button';
import { Root as Checkbox } from '@/components/align-ui/ui/checkbox';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { RiUserAddFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, ReactNode, useContext, useState } from 'react';
import { SignUpContext, SignUpStep } from './layout';

const EmailForm = () => {
  const {setStep} = useContext(SignUpContext);

  const t = useTranslations('SignUpPage.EmailForm');

  const [agree, setAgree] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStep('PASSWORD');
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
            {t('lets_start')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('insert_your_email')}
          </p>
        </div>
      </div>

      <Button className="w-full" variant="neutral" mode="stroke">
        <Image src={GoogleLogo} alt="" width={20} height={20} />
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
        <div className="flex gap-2">
          <Checkbox
            checked={agree}
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
      </div>

      <Button
        className="w-full"
        variant={agree ? "primary" : "neutral"}
        mode="filled"
        type="submit"
        disabled={!agree}
      >
        <span className="text-label-sm">{t('start')}</span>
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-paragraph-sm text-text-sub-600">
          {t('already_have_an_account')}
        </span>
        <Link
          className="text-label-sm text-text-strong-950 hover:border-b border-b-stroke-strong-950 transition"
          href={'/pt/sign-in'}
        >
          {t('sign_in')}
        </Link>
      </div>
    </form>
  );
};

const SignUpPage = () => {
  const {step, setStep} = useContext(SignUpContext);

  const steps: Record<SignUpStep, ReactNode> = {
    EMAIL: <EmailForm />
  };

  const renderStep = () => {
    return steps[step];
  };

  return <>{renderStep()}</>;
};

export default SignUpPage;
