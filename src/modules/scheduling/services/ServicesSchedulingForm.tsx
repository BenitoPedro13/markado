'use client';

import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Badge from '@/components/align-ui/ui/badge';
import { services as initialServices } from '@/data/services';
import { useSessionStore } from '@/providers/session-store-provider';
import { cn } from '@/utils/cn';
import { RiArrowRightSLine, RiTimeLine } from '@remixicon/react';

const formatDuration = (minutes: number): string => {
  if (minutes >= 24 * 60) {
    // Mais de 24 horas
    return `${Math.floor(minutes / (24 * 60))}d`;
  } else if (minutes >= 60) {
    // Mais de 1 hora
    return `${Math.floor(minutes / 60)}h`;
  } else {
    // Menos de 1 hora
    return `${minutes}m`;
  }
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const ServicesSchedulingForm = () => {
  // TODO: Change to a query to fetch the user image
  const user = useSessionStore((state) => state.user);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <main className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-[624px]">
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start gap-4">
          <Avatar.Root size={'48'} fallbackText={user?.name || ''}>
            <Avatar.Image src={user?.image || ''} alt={user?.name || 'User'} />
          </Avatar.Root>

          <h1 className="text-label-lg text-text-strong-950">{user?.name}</h1>

          <p className="text-label-sm text-text-sub-600">{user?.biography}</p>
          {/** Social icons */}
          <div className="flex flex-row items-center gap-3"></div>
        </div>
        <div className="w-full md:min-w-[332px] md:flex-1 overflow-hidden flex flex-col rounded-3xl border border-stroke-soft-200">
          {initialServices.map((service, index) => (
            <div
              key={service.slug}
              className={cn(
                'p-4 flex gap-4 justify-between items-center hover:bg-stroke-soft-200 transition hover:cursor-pointer',
                index !== initialServices.length - 1 &&
                  'border-b border-stroke-soft-200'
              )}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-label-lg text-text-strong-950">
                  {service.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge.Root
                    variant={'light'}
                    color={'blue'}
                    className="lowercase"
                  >
                    {/** TODO: Change the color of the icon based on the badge color */}
                    <RiTimeLine size={12} color="blue" />

                    {formatDuration(service.duration)}
                  </Badge.Root>

                  <p className="text-label-sm text-text-sub-600">
                    {formatPrice(service.price)}
                  </p>
                </div>
              </div>
              <RiArrowRightSLine size={24} color="var(--text-sub-600)" />
            </div>
          ))}
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default ServicesSchedulingForm;
