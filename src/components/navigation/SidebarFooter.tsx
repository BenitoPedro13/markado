'use client';

import Image from 'next/image';
import SidebarFooterSkeleton from './SidebarFooterSkeleton';
import { useSessionStore } from '@/providers/session-store-provider';

export default function SidebarFooter() {
  const user = useSessionStore((state) => state.user);
  const isLoading = useSessionStore((state) => state.isLoading);

  if (isLoading) {
    return <SidebarFooterSkeleton />;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-4 w-full">
      <div className="flex items-center gap-3">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
        )}
        <div className='flex flex-col items-start'>
          <p className="text-text-strong-950 text-label-sm">{user.name}</p>
          <p className="text-text-sub-600 text-paragraph-xs">{user.email}</p>
        </div>
      </div>
    </div>
  );
} 