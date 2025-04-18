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

// Sign up form schema
const signUpFormSchema = z
  .object({
    email: z.string().nonempty('Email é obrigatório').email('Email inválido'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
    name: z.string().min(1, 'O nome é obrigatório'),
    timeZone: z.string().min(1, 'O fuso horário é obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

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
  form: UseFormReturn<SignUpFormData>;
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

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      name: '',
      timeZone: ''
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
    step,
    setStep,
    backStep,
    nextStep,
    form,
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
