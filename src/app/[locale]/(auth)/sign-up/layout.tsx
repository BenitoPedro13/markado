'use client';

import { PropsWithChildren } from 'react';
import { SignUpProvider } from './SignUpContext';

export default function SignUpLayout({children}: PropsWithChildren) {
  return <SignUpProvider>{children}</SignUpProvider>;
}
