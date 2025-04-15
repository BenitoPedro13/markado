'use client';

import GoogleLogo from '@/../public/images/google_logo.svg';
import {Root as Button} from '@/components/align-ui/ui/button';
import {Root as Checkbox} from '@/components/align-ui/ui/checkbox';
import * as Input from '@/components/align-ui/ui/input';
import {Asterisk, Root as Label} from '@/components/align-ui/ui/label';
import OrDivider from '@/components/OrDivider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {cn} from '@/utils/cn';
import {
  RiArrowLeftSLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiLockFill,
  RiUserAddFill
} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {SignUpContext, SignUpStep} from './layout';

const EmailForm = () => {
  const {form, setStep} = useContext(SignUpContext);

  const t = useTranslations('SignUpPage.EmailForm');

  const [agree, setAgree] = useState(false);

  // Get the email value from the form
  const email = form.watch('email');

  // Check if the email is valid (not empty)
  const isEmailValid = email && email.trim() !== '';

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

      <Button className="w-full" variant="neutral" mode="stroke" type="button">
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
            <Input.Input
              type="email"
              placeholder="hello@markado.co"
              {...form.register('email')}
            />
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
        variant={agree && isEmailValid ? 'primary' : 'neutral'}
        mode="filled"
        type="submit"
        disabled={!agree || !isEmailValid}
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

const PasswordForm = () => {
  const {form, setStep} = useContext(SignUpContext);

  const t = useTranslations('SignUpPage.PasswordForm');

  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  const passwordsMatch = password === confirmPassword;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    setStep('FUNCTION');
  };

  const StrengthBarIndicator = () => {
    const [criteria, setCriteria] = useState({
      length: false,
      uppercase: false,
      number: false
    });

    const previousCriteriaRef = useRef(criteria);

    useEffect(() => {
      const newCriteria = {
        length: password?.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password)
      };

      // Só atualiza se algum critério mudou
      const criteriaChanged = Object.keys(newCriteria).some(
        (key) =>
          newCriteria[key as keyof typeof newCriteria] !==
          previousCriteriaRef.current[key as keyof typeof newCriteria]
      );

      if (criteriaChanged) {
        previousCriteriaRef.current = newCriteria;
        setCriteria(newCriteria);
      }
    }, [password]);

    const strength = Object.values(criteria).filter(Boolean).length;

    const colors = [
      'bg-gray-300',
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500'
    ];

    const requirements = [
      {
        label: t('at_least_eight_characters'),
        passed: criteria.length
      },
      {
        label: t('one_uppercase_letter'),
        passed: criteria.uppercase
      },
      {
        label: t('at_least_one_number'),
        passed: criteria.number
      }
    ];

    console.log(
      'confirmPassword.length > 0 && !passwordsMatch',
      confirmPassword.length > 0 && !passwordsMatch
    );

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1 flex-1 rounded transition-all duration-300',
                strength >= level ? colors[strength] : colors[0]
              )}
            />
          ))}
        </div>
        <p className="text-paragraph-xs text-text-sub-600">
          {t('must_have_at_least')}
        </p>
        <div className="flex flex-col gap-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {req.passed ? (
                <RiCheckboxCircleFill className="text-green-500 w-4 h-4" />
              ) : (
                <RiCloseCircleFill className="text-gray-400 w-4 h-4" />
              )}
              <span className={'text-paragraph-xs text-text-sub-600'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-8 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiLockFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('create_password')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('set_a_password')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>
            {t('create_password_label')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="password"
              placeholder="• • • • • • • • • • "
              {...form.register('password')}
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-1">
          <Label>
            {t('confirm_password_label')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="password"
              placeholder="• • • • • • • • • • "
              {...form.register('confirmPassword')}
            />
          </Input.Root>
          <p
            className={`${confirmPassword.length <= 0 || !passwordsMatch ? 'opacity-100 h-auto' : 'opacity-0 h-0'} text-paragraph-xs text-red-500 disabled:cursor transition-all duration-300`}
          >
            {t('passwords_do_not_match')}
          </p>
          <StrengthBarIndicator />
        </div>
      </div>

      <Button
        className="w-full"
        variant="primary"
        mode="filled"
        type="submit"
        disabled={confirmPassword.length <= 0 || !passwordsMatch}
      >
        <span className="text-label-sm">{t('continue')}</span>
      </Button>
    </form>
  );
};

const SignUpPage = () => {
  const {step, setStep} = useContext(SignUpContext);

  const steps: Record<SignUpStep, ReactNode> = {
    EMAIL: <EmailForm />,
    PASSWORD: <PasswordForm />,
    FUNCTION: undefined,
    PERSONAL: undefined,
    CONNECT: undefined,
    AVAILABILITY: undefined,
    ENDING: undefined
  };

  const previousStep: Record<SignUpStep, SignUpStep> = {
    EMAIL: 'EMAIL',
    PASSWORD: 'EMAIL',
    FUNCTION: 'PASSWORD',
    PERSONAL: 'PASSWORD',
    CONNECT: 'PERSONAL',
    AVAILABILITY: 'CONNECT',
    ENDING: 'AVAILABILITY'
  };

  const renderStep = () => {
    return steps[step];
  };

  return (
    <>
      {step !== 'EMAIL' && (
        <div className="absolute left-24 top-8">
          <Button
            variant="neutral"
            mode="stroke"
            onClick={() => setStep(previousStep[step]!)}
          >
            <RiArrowLeftSLine size={20} color="var(--text-sub-600)" />
            <span className="text-text-sub-600">Voltar</span>
          </Button>
        </div>
      )}

      {renderStep()}
    </>
  );
};

export default SignUpPage;
