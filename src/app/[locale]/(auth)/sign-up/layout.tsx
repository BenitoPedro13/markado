"use client"

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState
} from 'react';

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
};

const initialState: SignUpProps = {
  step: 'EMAIL',
  setStep: () => {}
};

export const SignUpContext = createContext<SignUpProps>(initialState);

const SignUpProvider = ({children}: PropsWithChildren) => {
  const [step, setStep] = useState<SignUpStep>('EMAIL');

  const value = {
    step,
    setStep
  };

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
};

export default function SignUpLayout({children}: PropsWithChildren) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
