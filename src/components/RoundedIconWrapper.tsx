'use client';

import { PropsWithChildren } from 'react';

const RoundedIconWrapper = ({children}: PropsWithChildren) => {

  // TODO: Background gradient effect
  return (
    <div className="rounded-icon-wrapper w-[96px] h-[96px] flex justify-center items-center">
      <div className="w-[64px] h-[64px] flex justify-center items-center rounded-full border border-text-soft-200">
        {children}
      </div>
    </div>
  );
};

export default RoundedIconWrapper;
