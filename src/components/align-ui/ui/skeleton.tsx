// AlignUI Skeleton v0.0.0

import * as React from 'react';
import { cn } from '@/utils/cn';

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-md bg-bg-soft-200',
        className
      )}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    lines?: number;
    lineHeight?: string;
  }
>(({ className, lines = 1, lineHeight = 'h-4', ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn(lineHeight, 'w-full')} />
      ))}
    </div>
  );
});
SkeletonText.displayName = 'SkeletonText';

export { Skeleton as Root, SkeletonText as Text }; 