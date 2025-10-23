'use client';

import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Badge from '@/components/align-ui/ui/badge';
import { badgeVariants } from '@/components/align-ui/ui/badge';
import * as Skeleton from '@/components/align-ui/ui/skeleton';
import { useBusiness } from '@/components/settings/business/Business';
import { services as initialServices } from '@/data/services';
import { ServiceBadgeColor } from '@/types/service';
import { cn } from '@/utils/cn';
import type { VariantProps } from '@/utils/tv';
import {
  RiArrowRightSLine,
  RiTimeLine
} from '@remixicon/react';
import Link from 'next/link';

import { UserProfile } from '@/types/UserProfile';
import type { EventTypeMetaDataSchema } from '~/prisma/zod-utils';
import {
  // RedirectType,
  type EventType,
  type User
} from '~/prisma/app/generated/prisma/client';
import { z } from 'zod';
import { getHostUserByUsername } from '~/trpc/server/handlers/user.handler';
import SocialIcons from '@/components/SocialIcons';

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

const mapServiceColorToBadgeColor = (
  color: ServiceBadgeColor | undefined
): BadgeColor => {
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

type SchedulingPageProps = {
  profile: {
    name: string;
    image: string | null;
    theme: string | null;
    // brandColor: string;
    // darkBrandColor: string;
    organization: {
      requestedSlug: string | null;
      slug: string | null;
      id: number | null;
    } | null;
    allowSEOIndexing: boolean;
    username: string | null;
  };
  users: (Pick<
    User,
    'name' | 'username' | 'biography' | 'verified' | 'image'
  > & {
    profile: UserProfile;
  })[];
  themeBasis: string | null;
  markdownStrippedBio: string;
  safeBio: string;
  // entity: {
  //   logoUrl?: string | null;
  //   considerUnpublished: boolean;
  //   orgSlug?: string | null;
  //   name?: string | null;
  //   teamSlug?: string | null;
  // };
  eventTypes: ({
    descriptionAsSafeHTML: string;
    metadata: z.infer<typeof EventTypeMetaDataSchema>;
  } & Pick<
    EventType,
    | 'id'
    | 'title'
    | 'slug'
    | 'length'
    | 'hidden'
    | 'badgeColor'
    | 'lockTimeZoneToggleOnBookingPage'
    | 'requiresConfirmation'
    | 'requiresBookerEmailVerification'
    | 'price'
    | 'currency'
    | 'recurringEvent'
  >)[];
};

type ServicesSchedulingFormProps = {
  fullHeight?: boolean;
  host?: Awaited<ReturnType<typeof getHostUserByUsername>>;
  servicesSchedulingFormProps?: SchedulingPageProps;
};

const ServicesSchedulingForm = ({
  fullHeight = true,
  host,
  servicesSchedulingFormProps
}: ServicesSchedulingFormProps) => {
  const businessContext = useBusiness();

  const businessName = businessContext.businessName || host?.name || '';
  const businessColor = businessContext.businessColor || 'faded';
  const businessDescription = businessContext.businessDescription || host?.biography || '';

  const socialLinks = Object.keys(businessContext.socialLinks || {}).length > 0
    ? businessContext.socialLinks
    : {
      instagram: host?.instagram || undefined,
      linkedin: host?.linkedin || undefined,
      twitter: host?.twitter || undefined,
      facebook: host?.facebook || undefined,
      website: host?.website || undefined
    };

  const services = servicesSchedulingFormProps?.eventTypes ?? initialServices;

  return (
    <main className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-[624px]">
      <div className="w-full md:flex-1 flex flex-col items-center md:items-start gap-4">
        <Avatar.Root
          size={'48'}
          fallbackText={businessName || host?.name || ''}
        >
          <Avatar.Image
            src={host?.image || ''}
            alt={businessName || host?.name || 'User'}
          />
        </Avatar.Root>

        <h1 className="text-label-lg text-text-strong-950">
          {businessName || host?.name}
        </h1>

        <p className="text-label-sm text-text-sub-600">
          {businessDescription || host?.biography}
        </p>
        <SocialIcons socialLinks={socialLinks} />
      </div>
      <div className="bg-bg-white-0 w-full md:min-w-[332px] md:flex-1 overflow-hidden flex flex-col rounded-3xl border border-stroke-soft-200">
        {services.map((service, index) => (
          <Link
            key={service.slug}
            href={`/${host?.username}/${service.slug}`}
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
                  variant="light"
                  color={mapServiceColorToBadgeColor(service.badgeColor ?? businessColor)}
                  size="medium"
                >
                  <Badge.Icon as={RiTimeLine} />
                  {formatDuration(service.length)}
                </Badge.Root>

                {service.price > 0 && <p className="text-label-sm text-text-sub-600">
                  {formatPrice(service.price)}
                </p>}
              </div>
            </div>
            <RiArrowRightSLine size={24} color="var(--text-sub-600)" />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ServicesSchedulingForm;
