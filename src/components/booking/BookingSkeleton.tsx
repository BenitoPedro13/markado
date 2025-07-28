import React from "react";
import { Text as SkeletonText } from "@/components/align-ui/ui/skeleton";

export default function BookingSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center bg-[url('/patterns/vertical_stripes.svg')] bg-no-repeat bg-[auto_500px] bg-bottom" data-testid="success-page">
      <main className="mx-auto max-w-3xl">
        <div className="overflow-y-auto z-50">
          <div className="text-center flex items-end justify-center px-4 pb-20 pt-4 sm:flex sm:p-0">
            <div className="main my-4 flex flex-col transition-opacity sm:my-0 inset-0">
              <div className="main bg-bg-white-0 inline-block transform overflow-hidden rounded-lg md:border md:border-bg-soft-200 md:rounded-[24px] sm:my-8 sm:max-w-xl px-8 pb-4 pt-5 text-left align-bottom transition-all sm:w-full sm:py-8 sm:align-middle">
                
                {/* Logo section */}
                <div className="mx-auto flex h-full w-18 items-center justify-center rounded-full">
                  <div className="w-16 h-16 rounded-full bg-bg-soft-200 animate-pulse" />
                </div>

                {/* Title section */}
                <div className="mb-8 mt-6 text-center last:mb-0">
                  <SkeletonText lines={1} className="w-48 mx-auto mb-3" />
                  <div className="mt-3">
                    <SkeletonText lines={1} className="w-64 mx-auto" />
                  </div>
                </div>

                {/* Details grid */}
                <div className="text-default grid grid-cols-2 border-t-2 border-t-bg-soft-200 pt-8 mt-4 text-left rtl:text-right">
                  {/* What */}
                  <div className="font-medium">
                    <SkeletonText lines={1} className="w-16" />
                  </div>
                  <div className="mb-6 last:mb-0">
                    <SkeletonText lines={1} className="w-40" />
                  </div>

                  {/* When */}
                  <div className="font-medium">
                    <SkeletonText lines={1} className="w-16" />
                  </div>
                  <div className="mb-6 last:mb-0">
                    <SkeletonText lines={1} className="w-48" />
                  </div>

                  {/* Who */}
                  <div className="font-medium">
                    <SkeletonText lines={1} className="w-16" />
                  </div>
                  <div className="last:mb-0">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <SkeletonText lines={1} className="w-24" />
                        <div className="w-12 h-5 rounded bg-bg-soft-200 animate-pulse" />
                      </div>
                      <SkeletonText lines={1} className="w-32" />
                    </div>
                  </div>

                  {/* Where */}
                  <div className="font-medium">
                    <SkeletonText lines={1} className="w-16" />
                  </div>
                  <div className="mb-6 last:mb-0">
                    <SkeletonText lines={1} className="w-36" />
                  </div>
                </div>

                {/* Loading indicator */}
                <div className="flex justify-center items-center gap-2 pt-6">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>

                <div className="text-center mt-4">
                  <SkeletonText lines={1} className="w-48 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 