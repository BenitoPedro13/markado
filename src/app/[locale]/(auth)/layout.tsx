'use client';

import { PropsWithChildren } from 'react';
import Header from './_components/Header';

export default async function AuthLayout({children}: PropsWithChildren) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
