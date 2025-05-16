'use client';

import React from 'react';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

interface ServiceUserDataFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
  scheduleDate: Date;
}

export default function ServiceUserDataForm({
  host,
  service,
  scheduleDate
}: Readonly<ServiceUserDataFormProps>) {
  return (
    <div className="overflow-hidden h-full gap-5 md:gap-0 md:max-h-[548px] flex flex-col md:grid md:grid-cols-4 p-6 w-full max-w-[1024px] md:border md:border-bg-soft-200 md:rounded-[24px]">
      {JSON.stringify(host)}
      {JSON.stringify(service)}
      {JSON.stringify(scheduleDate)}
    </div>
  );
}
