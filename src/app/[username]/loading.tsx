import * as Skeleton from '@/components/align-ui/ui/skeleton';
import {cn} from '@/utils/cn';
import React from 'react';

export default function LoadingPage() {
  return (
    <div
      className={
        'min-h-screen w-full flex flex-col justify-center items-center'
      }
    >
      <main className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-[624px]">
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start gap-4">
          <Skeleton.Root className="w-12 h-12 rounded-full" />
          <Skeleton.Text lines={1} className="w-32" />
          <Skeleton.Text lines={2} className="w-full" />
          <div className="flex flex-row items-center gap-3">
            <Skeleton.Root className="w-5 h-5 rounded-full" />
            <Skeleton.Root className="w-5 h-5 rounded-full" />
            <Skeleton.Root className="w-5 h-5 rounded-full" />
          </div>
        </div>
        <div className="bg-bg-white-0 w-full md:min-w-[332px] md:flex-1 overflow-hidden flex flex-col rounded-3xl border border-stroke-soft-200">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn(
                'p-4 flex gap-4 justify-between items-center',
                index !== 3 && 'border-b border-stroke-soft-200'
              )}
            >
              <div className="flex flex-col gap-2">
                <Skeleton.Text lines={1} className="w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton.Root className="w-16 h-6 rounded-full" />
                  <Skeleton.Root className="w-20 h-4" />
                </div>
              </div>
              <Skeleton.Root className="w-6 h-6 rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
