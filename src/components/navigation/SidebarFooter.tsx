'use client';

import Image from 'next/image';
import SidebarFooterSkeleton from './SidebarFooterSkeleton';
import { useSessionStore } from '@/providers/session-store-provider';
import { useSidebarStore } from '@/store/useSidebarStore';

export default function SidebarFooter() {
  const user = useSessionStore((state) => state.user);
  const isLoading = useSessionStore((state) => state.isLoading);
  const {isCollapsed, toggleCollapse} = useSidebarStore();

  if (isLoading) {
    return <SidebarFooterSkeleton />;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-4 w-full overflow-hidden">
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={isCollapsed ? 48 : 40}
            height={isCollapsed ? 48 : 40}
            className="rounded-full transition-all duration-300"
            priority
          />
        )}
        <div className={`flex flex-col items-start ${isCollapsed ? 'hidden' : ''}`}>
          <p className="text-text-strong-950 text-label-sm">{user.name}</p>
          <p className="text-text-sub-600 text-paragraph-xs">{user.email}</p>
        </div>
      </div>
    </div>
  );
} 