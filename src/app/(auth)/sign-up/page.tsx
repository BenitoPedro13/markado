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
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {SignUpContext, SignUpProvider, SignUpStep, useSignUp} from './SignUpContext';
import {
  signInWithGoogle,
  signUpWithEmailPassword,
  signInWithEmailPassword
} from '@/components/auth/auth-actions';
import {IconGoogle} from '@/components/auth/sign-in';
import * as SocialButton from '@/components/align-ui/ui/social-button';
import {useSearchParams, useRouter} from 'next/navigation';
import AuthSkeleton from '@/components/skeletons/AuthSkeleton';
import { useTRPC } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';

const EmailForm = () => {
  const {form, setStep} = useContext(SignUpContext);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const t = useTranslations('SignUpPage.EmailForm');

  const [agree, setAgree] = useState(false);

  // Get the email value from the form
  const email = form.watch('email');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStep('PASSWORD');
  };

  const handleGoogleSignIn = async () => {
    // Pass the redirect URL to the sign-in function
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
              {...form.register('email')}
            />
          </Input.Root>
        </div>
        <div className="flex gap-2">
          <Checkbox
            checked={agree}
            required
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
        variant={'neutral'}
        mode="filled"
        type="submit"
        // disabled={!agree}
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

const PasswordForm = () => {
    const {
      form,
      setStep,
    } = useSignUp();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const t = useTranslations('SignUpPage.PasswordForm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const trpc = useTRPC();

  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  const email = form.watch('email');
  const passwordsMatch = password === confirmPassword;

  const sendVerificationEmailMutation = useMutation(trpc.sendVerificationEmail.mutationOptions({
    onSuccess: () => {
      // Redirect to check-email page
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    },
    onError: () => {
      setError('Failed to send verification email. Please try again.');
      setIsLoading(false);
    }
  }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setIsLoading(true);
    setError('');

    try {
      // Complete the registration process
      await signUpWithEmailPassword(email, password);

      // Send verification email
      sendVerificationEmailMutation.mutate({ email });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
      setIsLoading(false);
    }
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
          {(!error || confirmPassword.length > 0) && !passwordsMatch && (
            <p
              className={`${confirmPassword.length <= 0 || !passwordsMatch ? 'opacity-100' : 'opacity-0'} text-paragraph-xs text-red-500 disabled:cursor transition-all duration-300`}
            >
            {t('passwords_do_not_match')}
            </p>
          )}

          <div
            className={`${error ? 'opacity-100' : 'opacity-0'} text-paragraph-xs text-red-500 disabled:cursor transition-all duration-300`}
          >
            {error}
          </div>

          <StrengthBarIndicator />
        </div>
      </div>

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        type="submit"
        disabled={isLoading || confirmPassword.length <= 0 || !passwordsMatch}
      >
        <span className="text-label-sm">
          {isLoading ? t('creating_account') : t('continue')}
        </span>
      </Button>
    </form>
  );
};

const SignUpSteps = () => {
    const {
      step,
      setStep,
      queries: {user},
      isAnyQueryLoading
    } = useSignUp();

  const steps: Record<SignUpStep, ReactNode> = {
    EMAIL: (
      <Suspense fallback={<AuthSkeleton />}>
        <EmailForm />
      </Suspense>
    ),
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

function SignUpPage() {
  return (
    <SignUpProvider>
      <SignUpSteps />
    </SignUpProvider>
  );
}

export default SignUpPage;
