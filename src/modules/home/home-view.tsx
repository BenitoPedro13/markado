import Link from 'next/link';
// import * as Button from '@/components/align-ui/ui/button';
// import {RiGithubFill} from '@remixicon/react';
import SignIn from '@/components/auth/sign-in';
import UserProfile from '@/components/auth/user-profile';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  const isAuthenticated = session?.user;

  return (
    <div className="container mx-auto flex-1 px-5">
      {isAuthenticated ? (
        <UserProfile />
      ) : (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Welcome</h3>
          <p className="mb-4">Please sign in to continue</p>
          <SignIn />
        </div>
      )}
    </div>
  );
}
