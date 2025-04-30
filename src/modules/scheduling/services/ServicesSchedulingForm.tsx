'use client';

import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Badge from '@/components/align-ui/ui/badge';
import {useScheduling} from '@/contexts/SchedulingContext';
import {services as initialServices} from '@/data/services';
import {cn} from '@/utils/cn';
import {RiArrowRightSLine, RiTimeLine, RiFacebookLine, RiInstagramLine, RiTwitterXLine, RiLinkedinLine, RiGlobalLine, RiLinkedinFill, RiFacebookFill  } from '@remixicon/react';
import Link from 'next/link';
import { useBusiness } from '@/components/settings/business/Business';
import { ServiceBadgeColor } from '@/types/service';
import type { VariantProps } from '@/utils/tv';
import { badgeVariants } from '@/components/align-ui/ui/badge';
import * as Skeleton from '@/components/align-ui/ui/skeleton';

type BadgeColor = NonNullable<VariantProps<typeof badgeVariants>['color']>;

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

const mapServiceColorToBadgeColor = (color: ServiceBadgeColor | undefined): BadgeColor => {
  switch (color) {
    case 'faded':
      return 'gray';
    case 'information':
      return 'blue';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    case 'away':
      return 'orange';
    case 'feature':
      return 'purple';
    case 'verified':
      return 'sky';
    case 'highlighted':
      return 'pink';
    case 'stable':
      return 'teal';
    default:
      return 'blue';
  }
};

type ServicesSchedulingFormProps = {
  fullHeight?: boolean;
};

const ServicesSchedulingForm = ({ fullHeight = true }: ServicesSchedulingFormProps) => {
  const {profileUser, isLoading, error} = useScheduling();
  const { businessName, businessColor, businessDescription, socialLinks } = useBusiness();

  if (isLoading) {
    return (
      <div className={cn("w-full flex flex-col justify-center items-center", fullHeight && "min-h-screen")}>
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

  if (error || !profileUser) {
    return (
      <div className={cn("w-full flex flex-col justify-center items-center", fullHeight && "min-h-screen")}>
        <p className="text-text-sub-600">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex flex-col justify-center items-center", fullHeight && "min-h-screen")}>
      <main className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-[624px]">
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start gap-4">
          <Avatar.Root size={'48'} fallbackText={businessName || profileUser.name || ''}>
            <Avatar.Image
              src={profileUser.image || ''}
              alt={businessName || profileUser.name || 'User'}
            />
          </Avatar.Root>

          <h1 className="text-label-lg text-text-strong-950">
            {businessName || profileUser.name}
          </h1>

          <p className="text-label-sm text-text-sub-600">
            {businessDescription || profileUser.biography}
          </p>
          {/** Social icons */}
          <div className="flex flex-row items-center gap-3">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-text-sub-600 hover:text-text-strong-950 transition-colors">
                <RiInstagramLine size={20} />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-sub-600 hover:text-text-strong-950 transition-colors">
                <RiLinkedinFill size={20} />
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-text-sub-600 hover:text-text-strong-950 transition-colors">
                <RiTwitterXLine size={20} />
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-text-sub-600 hover:text-text-strong-950 transition-colors">
                <RiFacebookFill size={20} />
              </a>
            )}
            {socialLinks?.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-text-sub-600 hover:text-text-strong-950 transition-colors">
                <RiGlobalLine size={20} />
              </a>
            )}
          </div>
        </div>
        <div className="bg-bg-white-0 w-full md:min-w-[332px] md:flex-1 overflow-hidden flex flex-col rounded-3xl border border-stroke-soft-200">
          {initialServices.map((service, index) => (
            <Link
              key={service.slug}
              href={`/${profileUser.username}/${service.slug}`}
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
                  <Badge.Root variant="light" color={mapServiceColorToBadgeColor(businessColor)} size="medium">
                    <Badge.Icon as={RiTimeLine} />
                    {formatDuration(service.duration)}
                  </Badge.Root>

                  <p className="text-label-sm text-text-sub-600">
                    {formatPrice(service.price)}
                  </p>
                </div>
              </div>
              <RiArrowRightSLine size={24} color="var(--text-sub-600)" />
            </Link>
          ))}
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default ServicesSchedulingForm;
