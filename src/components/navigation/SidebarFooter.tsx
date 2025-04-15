'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import Image from 'next/image';
import SidebarFooterSkeleton from './SidebarFooterSkeleton';


export default function UserProfile() {
  const trpc = useTRPC();
  const { data: session, isLoading, error } = useQuery(trpc.getSession.queryOptions());

  if (isLoading) {
    return <SidebarFooterSkeleton />;
  }

  if (error) {
    return <div>Error loading session: {error.message}</div>;
  }

  if (!session || !session.user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-4 w-full">
      
      <div className="flex items-center gap-3">
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