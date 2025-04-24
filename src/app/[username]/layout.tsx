'use client';

import { SchedulingProvider } from '@/contexts/SchedulingContext';

interface SchedulingLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  };
}

export default function SchedulingLayout({ children, params }: SchedulingLayoutProps) {
  return (
    <SchedulingProvider username={params.username}>
      {children}
    </SchedulingProvider>
  );
} 