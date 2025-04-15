'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import Image from 'next/image';



export default function UserProfile() {
  const trpc = useTRPC();
  const { data: session, isLoading, error } = useQuery(trpc.getSession.queryOptions());

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  if (error) {
    return <div>Error loading session: {error.message}</div>;
  }

  if (!session || !session.user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-1 p-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
        )}
        <div className='flex flex-col items-start'>
          <p className="text-text-strong-950 text-label-sm">{session.user.name}</p>
          <p className="text-text-sub-600 text-paragraph-xs">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
} 