'use client';

import React from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <div
      className={
        'w-full min-h-screen flex flex-col justify-center items-center'
      }
    >
      <p className="text-text-sub-600">Usuário não encontrado</p>
      <p>{error.message}</p>
    </div>
  );
}
