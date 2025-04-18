'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import {
  signUpWithEmailPassword
} from '@/components/auth/auth-actions';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { cn } from '@/utils/cn';
import { useTRPC } from '@/utils/trpc';
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiLockFill
} from '@remixicon/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FormEvent,
  useEffect,
  useRef,
  useState
} from 'react';

const PasswordForm = () => {
  const {forms, setStep, nextStep} = useSignUp();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const t = useTranslations('SignUpPage.PasswordForm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const trpc = useTRPC();

  const password = forms.password.watch('password');
  const confirmPassword = forms.password.watch('confirmPassword');
  const email = forms.email.watch('email');
  const passwordsMatch = password === confirmPassword;

  const sendVerificationEmailMutation = useMutation(
    trpc.auth.sendVerificationEmail.mutationOptions({
      onSuccess: () => {
        // Redirect to check-email page
        // router.push(`/check-email?email=${encodeURIComponent(email)}`);
        // nextStep();
      },
      onError: () => {
        setError('Failed to send verification email. Please try again.');
        setIsLoading(false);
      }
    })
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setIsLoading(true);
    setError('');

    try {
      // Complete the registration process
      await signUpWithEmailPassword(email, password);

      // Send verification email
      // sendVerificationEmailMutation.mutate({email});
        nextStep();

     
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
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
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
              {...forms.password.register('password')}
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
              {...forms.password.register('confirmPassword')}
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

export default PasswordForm;
