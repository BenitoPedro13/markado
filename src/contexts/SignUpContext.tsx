'use client';

import { useTRPC } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { type inferRouterOutputs } from '@trpc/server';
import { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import { useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { type AppRouter } from '~/trpc/server';

// Sign up email form schema
const signUpEmailFormSchema = z.object({
  email: z.string().nonempty('SignUpPage.EmailForm.email_required').email('SignUpPage.EmailForm.invalid_email'),
  agree: z.boolean().refine((data) => data, {
    message: 'SignUpPage.EmailForm.must_agree_to_terms',
    path: ['agree']
  })
});

// Sign up password form schema
const signUpPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, 'SignUpPage.PasswordForm.min_length')
      .regex(/[A-Z]/, 'SignUpPage.PasswordForm.one_uppercase_letter')
      .regex(/[0-9]/, 'SignUpPage.PasswordForm.at_least_one_number'),
    confirmPassword: z
      .string()
      .min(8, 'SignUpPage.PasswordForm.min_length')
      .regex(/[A-Z]/, 'SignUpPage.PasswordForm.one_uppercase_letter')
      .regex(/[0-9]/, 'SignUpPage.PasswordForm.at_least_one_number')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'SignUpPage.PasswordForm.passwords_do_not_match',
    path: ['confirmPassword']
  });


// Sign up personal form schema
const signUpPersonalFormSchema = z.object({
  name: z.string().min(1, 'SignUpPage.PersonalForm.name_required'),
  username: z.string().min(1, 'SignUpPage.PersonalForm.username_required'),
  timeZone: z.string().min(1, 'SignUpPage.PersonalForm.timezone_required'),
});


export type SignUpEmailFormData = z.infer<typeof signUpEmailFormSchema>;
export type SignUpPasswordFormData = z.infer<typeof signUpPasswordFormSchema>;
export type SignUpPersonalFormData = z.infer<typeof signUpPersonalFormSchema>;

// Sign up context
export type SignUpStep =
  | '/sign-up/email'
  | '/sign-up/password'
  | '/sign-up/personal'
  | '/sign-up/connect'
  | '/sign-up/availability'
  | '/sign-up/ending';

// Infer the output type of the me procedure
type MeResponse = inferRouterOutputs<AppRouter>['me'];

type QueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: TRPCClientErrorLike<{
    transformer: false;
    errorShape: DefaultErrorShape;
  }> | null;
};

type SignUpContextType = {
  queries: {
    user: QueryState<MeResponse>;
    // Add other query states here as needed
    // example: profile: QueryState<Profile>;
  };
  step: SignUpStep;
  setStep: Dispatch<SetStateAction<SignUpStep>>;
  backStep: () => void;
  nextStep: () => void;
  forms: {
    email: UseFormReturn<SignUpEmailFormData>;
    password: UseFormReturn<SignUpPasswordFormData>;
    personal: UseFormReturn<SignUpPersonalFormData>;
  };
  agree: boolean;
  setAgree: Dispatch<SetStateAction<boolean>>;
  // Helper functions
  isAnyQueryLoading: () => boolean;
  hasAnyQueryError: () => boolean;
};

const SignUpContext = createContext<SignUpContextType | null>(null);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();   
  const userQuery = useQuery(trpc.me.queryOptions());
  const router = useRouter();

  // You can add more queries here
  // const profileQuery = useQuery(trpc.profile.queryOptions());

  const [step, setStep] = useState<SignUpStep>('/sign-up/email');
  const [agree, setAgree] = useState(false);

  const emailForm = useForm<SignUpEmailFormData>({
    resolver: zodResolver(signUpEmailFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    }
  });

  const passwordForm = useForm<SignUpPasswordFormData>({
    resolver: zodResolver(signUpPasswordFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const personalForm = useForm<SignUpPersonalFormData>({
    resolver: zodResolver(signUpPersonalFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      username: '',
      timeZone: '',
    }
  });

  const previousStepMap: Partial<Record<SignUpStep, SignUpStep>> = {
    '/sign-up/password': '/sign-up/email',
    '/sign-up/personal': '/sign-up/password',
    '/sign-up/connect': '/sign-up/personal',
    '/sign-up/availability': '/sign-up/connect',
    '/sign-up/ending': '/sign-up/availability'
  };

  const nextStepMap: Partial<Record<SignUpStep, SignUpStep>> = {
    '/sign-up/email': '/sign-up/password',
    '/sign-up/password': '/sign-up/personal',
    '/sign-up/personal': '/sign-up/connect',
    '/sign-up/connect': '/sign-up/availability',
    '/sign-up/availability': '/sign-up/ending',
  };

  const backStep = () => {
    setStep(previousStepMap[step]!);
    router.push(previousStepMap[step]!);
  };

  const nextStep = () => {
    setStep(nextStepMap[step]!);
    router.push(nextStepMap[step]!);
  };

  const value = {
    queries: {
      user: {
        data: userQuery.data ?? null,
        isLoading: userQuery.isLoading,
        error: userQuery.error
      },
      // Add other query states here
      // profile: {
      //   data: profileQuery.data ?? null,
      //   isLoading: profileQuery.isLoading,
      //   error: profileQuery.error
      // }
    },
    forms: {
      email: emailForm,
      password: passwordForm,
      personal: personalForm
    },
    step,
    setStep,
    backStep,
    nextStep,
    agree,
    setAgree,
    // Helper functions
    isAnyQueryLoading: () => Object.values(value.queries).some(q => q.isLoading),
    hasAnyQueryError: () => Object.values(value.queries).some(q => q.error !== null)
  };
  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUp() {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
}
