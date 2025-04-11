'use client';

import { PropsWithChildren } from 'react';
import Footer from './_components/Footer';
import Header from './_components/Header';

export default function AuthLayout({children}: PropsWithChildren) {
  return (
    <>
      <Header />

      <div className="w-full h-full px-11 py-6 flex flex-col justify-between">
        <div className="flex justify-center">{children}</div>

        <Footer />
      </div>
    </>
  );
}
