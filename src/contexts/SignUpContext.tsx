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
  useEffect,
  useMemo,
  useState
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { type AppRouter } from '~/trpc/server';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

// Sign up email form schema
const signUpEmailFormSchema = z.object({
  email: z
    .string()
    .nonempty('SignUpPage.EmailForm.email_required')
    .email('SignUpPage.EmailForm.invalid_email'),
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
  timeZone: z.string().min(1, 'SignUpPage.PersonalForm.timezone_required')
});

// Sign up availability form schema
const signUpAvailabilityFormSchema = z.object({
  schedules: z.record(z.enum([
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]), z.object({
    enabled: z.boolean(),
    timeWindows: z.array(z.object({
      startTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'SignUpPage.AvailabilityForm.invalid_time_format'),
      endTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'SignUpPage.AvailabilityForm.invalid_time_format')
    })).default([])
  }))
});

export type SignUpEmailFormData = z.infer<typeof signUpEmailFormSchema>;
export type SignUpPasswordFormData = z.infer<typeof signUpPasswordFormSchema>;
export type SignUpPersonalFormData = z.infer<typeof signUpPersonalFormSchema>;
export type SignUpAvailabilityFormData = z.infer<typeof signUpAvailabilityFormSchema>;

// Sign up context
export type SignUpStep =
  | '/sign-up/email'
  | '/sign-up/password'
  | '/sign-up/personal'
  | '/sign-up/calendar'
  | '/sign-up/availability'
  | '/sign-up/ending';

// Infer the output type of the user.me procedure
type MeResponse = inferRouterOutputs<AppRouter>['user']['me'];

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
    user: MeResponse;
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
  // isAnyQueryLoading: () => boolean;
  // hasAnyQueryError: () => boolean;
};

const SignUpContext = createContext<SignUpContextType | null>(null);

type SignUpProviderProps = {
  children: React.ReactNode;
  initialUser: Awaited<ReturnType<typeof getMeByUserId>> | null;
};

export function SignUpProvider({
  children,
  initialUser
}: SignUpProviderProps) {
  const trpc = useTRPC();
  const router = useRouter();

  // Replace the query with state initialized from the prop
  const [userData, setUserData] = useState<SignUpProviderProps['initialUser']>(initialUser);
  const [agree, setAgree] = useState(true);

  const emailForm = useForm<SignUpEmailFormData>({
    resolver: zodResolver(signUpEmailFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      agree: true
    }
  });

  const passwordForm = useForm<SignUpPasswordFormData>({
    resolver: zodResolver(signUpPasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const personalForm = useForm<SignUpPersonalFormData>({
    resolver: zodResolver(signUpPersonalFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      username: '',
      timeZone: ''
    }
  });
  const availabilityForm = useForm<SignUpAvailabilityFormData>({
    resolver: zodResolver(signUpAvailabilityFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      schedules: {
        'sunday': {
          enabled: false,
          timeWindows: []
        },
        'monday': {
          enabled: false,
          timeWindows: []
        },
        'tuesday': {
          enabled: false,
          timeWindows: []
        },
        'wednesday': {
          enabled: false,
          timeWindows: []
        },
        'thursday': {
          enabled: false,
          timeWindows: []
        },
        'friday': {
          enabled: false,
          timeWindows: []
        },
        'saturday': {
          enabled: false,
          timeWindows: []
        }
      }
    }   
  });

  const previousStepMap: Partial<Record<SignUpStep, SignUpStep>> = {
    '/sign-up/password': '/sign-up/email',
    '/sign-up/personal': '/sign-up/password',
    '/sign-up/calendar': '/sign-up/personal',
    '/sign-up/availability': '/sign-up/calendar',
    '/sign-up/ending': '/sign-up/availability'
  };

  const nextStepMap: Partial<Record<SignUpStep, SignUpStep>> = {
    '/sign-up/email': '/sign-up/password',
    '/sign-up/password': '/sign-up/personal',
    '/sign-up/personal': '/sign-up/calendar',
    '/sign-up/calendar': '/sign-up/availability',
    '/sign-up/availability': '/sign-up/ending'
  };

  // Initialize step based on the current path if possible
  const [step, setStep] = useState<SignUpStep>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Check if the current path is a valid SignUpStep
      const allSteps = [...Object.keys(nextStepMap), ...Object.values(nextStepMap)];
      if (allSteps.includes(path as SignUpStep)) {
        return path as SignUpStep;
      }
    }
    return '/sign-up/email'; // Default fallback
  });

  const backStep = () => {
    const prevStep = previousStepMap[step]!;
    setStep(prevStep);
    router.push(prevStep);
  };

  const nextStep = () => {
    const nextStep = nextStepMap[step]!;
    setStep(nextStep);
    router.push(nextStep);
  };

  // Remove the conditional fetching during render
  const userQuery = useQuery({
    ...trpc.user.me.queryOptions(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Move state update to useEffect
  useEffect(() => {
    if (!userData && userQuery.data) {
      setUserData(userQuery.data);
    }
  }, [userQuery.data]);  // Remove userData from dependencies to prevent rerender loops

  // Memoize the context value to prevent unnecessary re-renders of children
  const value = useMemo<SignUpContextType>(() => ({
    queries: {
      user: userData!
    },
    forms: {
      email: emailForm,
      password: passwordForm,
      personal: personalForm,
      availability: availabilityForm
    },
    step,
    setStep,
    backStep,
    nextStep,
    agree,
    setAgree,
  }), [
    userData,
    emailForm,
    passwordForm,
    personalForm,
    availabilityForm,
    step,
    agree
  ]);

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
}

export function useSignUp() {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
}
