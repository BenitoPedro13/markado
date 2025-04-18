'use client';

export default function AuthSkeleton() {
  return (
    <div className="flex justify-center my-auto">
      <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="rounded-icon-wrapper w-16 h-16 flex justify-center items-center mb-8">
            <div className="w-16 h-16 flex justify-center items-center rounded-full border border-bg-soft-200 animate-pulse bg-bg-soft-200" />
          </div>
          <div className="flex flex-col gap-1 justify-center items-center text-center">
            <div className="h-7 w-40 bg-bg-soft-200 rounded-md animate-pulse" />
            <div className="h-5 w-64 bg-bg-soft-200 rounded-md animate-pulse mt-1" />
          </div>
        </div>

        <div className="w-full h-10 bg-bg-soft-200 rounded-10 animate-pulse" />

        <div className="w-full flex flex-row gap-2.5 items-center">
          <span className="w-full h-[1px] bg-bg-soft-200" />
          <span className="uppercase text-bg-soft-200 text-subheading-2xs">Ou</span>
          <span className="w-full h-[1px] bg-bg-soft-200" />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-16 bg-bg-soft-200 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-bg-soft-200 rounded-10 animate-pulse mt-1" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="h-5 w-20 bg-bg-soft-200 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-bg-soft-200 rounded-10 animate-pulse mt-1" />
          </div>
        </div>

        <div className="h-10 w-full bg-bg-soft-200 rounded-10 animate-pulse" />

        <div className="flex items-center gap-1">
          <div className="h-5 w-32 bg-bg-soft-200 rounded-md animate-pulse" />
          <div className="h-5 w-16 bg-bg-soft-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
