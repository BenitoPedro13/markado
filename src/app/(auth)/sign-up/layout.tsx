import { SignUpProvider } from '@/contexts/SignUpContext';
import { PropsWithChildren } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

export default async function SignUpLayout({children}: PropsWithChildren ) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const me = await getMeByUserId(session.user.id);

  return (
    <SignUpProvider initialUser={me}>
      {children}
    </SignUpProvider>
  );
}
