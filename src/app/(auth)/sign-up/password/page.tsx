'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import {
  signInWithEmailPassword,
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
  useState
} from 'react';

// Define password criteria type
type PasswordCriteria = {
  length: boolean;
  uppercase: boolean;
  number: boolean;
};

// Move StrengthBarIndicator outside PasswordForm
const StrengthBarIndicator = ({
  criteria,
  t
}: {
  criteria: PasswordCriteria;
  t: any;
}) => {
  // Debug
  console.log('StrengthBarIndicator rendered with criteria:', criteria);
  
  // Calculate strength based on how many criteria are met
  const strength = Object.values(criteria).filter(Boolean).length;
  console.log('Calculated strength:', strength);

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
  const passwordsMatch = !forms.password.formState.errors.confirmPassword;
  
  // Move criteria state to parent component
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    number: false
  });

  // Update criteria when password changes - with extra safeguards
  // Commenting out since we're now handling this directly in the input onChange
  /*
  useEffect(() => {
    console.log('Password changed effect triggered:', password);
    
    // Force criteria evaluation
    const newCriteria = {
      length: Boolean(password && password.length >= 8),
      uppercase: Boolean(password && /[A-Z]/.test(password)),
      number: Boolean(password && /[0-9]/.test(password))
    };
    
    console.log('New criteria calculated:', newCriteria);
    setPasswordCriteria(newCriteria);
  }, [password]);
  */

  // Debug render cycle
  console.log('Rendering PasswordForm, passwordCriteria:', passwordCriteria);

  // Add debugging for React Hook Form
  console.log('Form values:', forms.password.getValues());
  console.log('Form errors:', forms.password.formState.errors);

  const sendVerificationEmailMutation = useMutation(
    trpc.auth.sendVerificationEmail.mutationOptions({
      onSuccess: () => {
        // Redirect to check-email page
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
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
    // Let React Hook Form handle validation
    const isValid = await forms.password.trigger();
    if (!isValid) return;

    setIsLoading(true);
    setError('');

    try {
      // Complete the registration process
      await signUpWithEmailPassword(email, password);
      // await signInWithEmailPassword(email, password);

      // Send verification email
      sendVerificationEmailMutation.mutate({email});
        // nextStep();
        // router.push('/');

     
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
      setIsLoading(false);
    }
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
              autoComplete="off"
              placeholder="• • • • • • • • • • "
              {...forms.password.register('password', {
                onChange: (e) => {
                  console.log('RHF password change:', e.target.value);
                  // Update criteria immediately for faster feedback
                  const val = e.target.value;
                  setPasswordCriteria({
                    length: Boolean(val && val.length >= 8),
                    uppercase: Boolean(val && /[A-Z]/.test(val)),
                    number: Boolean(val && /[0-9]/.test(val))
                  });

                  forms.password.trigger();
                }
              })}
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
              autoComplete="off"
              placeholder="• • • • • • • • • • "
              {...forms.password.register('confirmPassword', {
                onChange: (e) => {
                  console.log('RHF confirmPassword change:', e.target.value);
                  // Update criteria immediately for faster feedback
                  const val = e.target.value;
                  setPasswordCriteria({
                    length: Boolean(val && val.length >= 8),
                    uppercase: Boolean(val && /[A-Z]/.test(val)),
                    number: Boolean(val && /[0-9]/.test(val))
                  });

                  forms.password.trigger();
                }
              })}
            />
          </Input.Root>
          {forms.password.formState.errors.confirmPassword && (
            <p className="text-paragraph-xs text-red-500">
              {t('passwords_do_not_match')}
            </p>
          )}

          <div
            className={`${error ? 'opacity-100' : 'opacity-0'} text-paragraph-xs text-red-500 disabled:cursor transition-all duration-300`}
          >
            {error}
          </div>

          <StrengthBarIndicator criteria={passwordCriteria} t={t} />
        </div>
      </div>

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        type="submit"
        disabled={
          isLoading ||
          // !forms.password.formState.isValid ||
          !password ||
          !confirmPassword
        }
      >
        <span className="text-label-sm">
          {isLoading ? t('creating_account') : t('continue')}
        </span>
      </Button>
    </form>
  );
};

export default PasswordForm;
