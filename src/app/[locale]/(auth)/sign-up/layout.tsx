'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Sign up form schema
const signUpFormSchema = z.object({
  email: z.string().nonempty('Email é obrigatório').email('Email inválido'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

// Sign up context
export type SignUpStep =
  | 'EMAIL'
  | 'PASSWORD'
  | 'FUNCTION'
  | 'PERSONAL'
  | 'CONNECT'
  | 'AVAILABILITY'
  | 'ENDING';

type SignUpProps = {
  step: SignUpStep;
  setStep: Dispatch<SetStateAction<SignUpStep>>;
  form: UseFormReturn<SignUpFormData>;
};

export const SignUpContext = createContext<SignUpProps>({
  step: 'EMAIL',
  setStep: () => {},
  form: {} as UseFormReturn<SignUpFormData>
});

const SignUpProvider = ({children}: PropsWithChildren) => {
  const [step, setStep] = useState<SignUpStep>('EMAIL');

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onSubmit'
  });

  const value = {
    step,
    setStep,
    form
  };

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
};

export default function SignUpLayout({children}: PropsWithChildren) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
