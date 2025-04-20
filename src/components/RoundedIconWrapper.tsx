'use client';

import { PropsWithChildren } from 'react';

const RoundedIconWrapper = ({children}: PropsWithChildren) => {

  // TODO: Background gradient effect
  return (
    <div className="p-4 rounded-icon-wrapper w-24 h-24 flex justify-center items-center mb-2">
      <div className="w-16 h-16 flex justify-center items-center rounded-full border border-bg-soft-200">
        {children}
      </div>
    </div>
  );
};

export default RoundedIconWrapper;
