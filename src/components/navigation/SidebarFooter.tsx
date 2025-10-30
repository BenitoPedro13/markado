'use client';

import Image from 'next/image';
import SidebarFooterSkeleton from './SidebarFooterSkeleton';
import {useSessionStore} from '@/providers/session-store-provider';
import {useSidebarStore} from '@/stores/sidebar-store';
import * as Avatar from '@/components/align-ui/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';

export default function SidebarFooter({isMobile}: {isMobile?: boolean}) {
  const user = useSessionStore((state) => state.user);
  const isLoading = useSessionStore((state) => state.isLoading);
  const {isCollapsed, toggleCollapse} = useSidebarStore();

  if (isLoading) {
    return <SidebarFooterSkeleton />;
  }

  if (!user) {
    return <SidebarFooterSkeleton />;
  }

  return (
    <div className={`${isMobile ? 'p-0' : 'p-4'} w-full overflow-hidden`}>
      <div
        className={`flex items-center gap-3 ${isMobile? '' : isCollapsed ? 'justify-center' : ''}`}
      >
        <Avatar.Root
          size={isMobile ? '32' : isCollapsed ? '48' : '40'}
          fallbackText={user.name || ''}
        >
          <Avatar.Image
            src={user.image || ''}
            alt={user.name || 'User Icon'}
            
          />
        </Avatar.Root>
        <div
          className={`flex flex-col items-start ${ isCollapsed || isMobile ? 'hidden' : ''}`}
        >
          <p className="text-text-strong-950 text-label-sm">
            {user.name}
          </p>
          <p className="text-text-sub-600 text-paragraph-xs">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
