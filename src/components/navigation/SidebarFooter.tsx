'use client';

import Image from 'next/image';
import SidebarFooterSkeleton from './SidebarFooterSkeleton';
import {useSessionStore} from '@/providers/session-store-provider';
import {useSidebarStore} from '@/stores/sidebar-store';
import * as Avatar from '@/components/align-ui/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';

export default function SidebarFooter() {
  const user = useSessionStore((state) => state.user);
  const isLoading = useSessionStore((state) => state.isLoading);
  const {isCollapsed, toggleCollapse} = useSidebarStore();

  const trpc = useTRPC()

  const {data: me, isPending} = useQuery(trpc.user.me.queryOptions())

  if (isLoading || isPending) {
    return <SidebarFooterSkeleton />;
  }

  if (!user || !me) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-4 w-full overflow-hidden">
      <div
        className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}
      >
        <Avatar.Root
          size={isCollapsed ? '48' : '40'}
          fallbackText={me.name || user.name || ''}
        >
          <Avatar.Image
            src={me.image || user.image || ''}
            alt={me.name || user.name || 'User Icon'}
            
          />
        </Avatar.Root>
        <div
          className={`flex flex-col items-start ${isCollapsed ? 'hidden' : ''}`}
        >
          <p className="text-text-strong-950 text-label-sm">
            {me.name ?? user.name}
          </p>
          <p className="text-text-sub-600 text-paragraph-xs">
            {me.email ?? user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
