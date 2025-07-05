import {notFound} from 'next/navigation';
import {UserRepository} from '@/repositories/user';
import eventHandler from '~/trpc/server/handlers/events.handler';
import type {GetBookingType} from '@/packages/features/bookings/lib/get-booking';
import type {getPublicEvent} from '@/packages/features/eventtypes/lib/getPublicEvent';

type Props = {
  eventData: Pick<
    NonNullable<Awaited<ReturnType<typeof getPublicEvent>>>,
    | 'id'
    | 'length'
    | 'metadata'
    | 'title'
    | 'slug'
    | 'price'
    | 'hidden'
    | 'badgeColor'
  >;
  booking?: GetBookingType;
  rescheduleUid: string | null;
  bookingUid: string | null;
  user: string;
  slug: string;
  isBrandingHidden: boolean;
  isSEOIndexable: boolean | null;
  themeBasis: null | string;
  orgBannerUrl: null;
};

export async function getUserPageProps({
  username,
  slug
}: {
  username: string;
  slug: string;
}) {
  const [user] = await UserRepository.findUsersByUsername({
    usernameList: [username],
    orgSlug: null
  });

  if (!user) {
    return notFound();
  }

  const org = null;

  const eventData = await eventHandler({
    input: {
      username,
      eventSlug: slug,
      org,
      fromRedirectOfNonOrgLink: false
    }
  });

  if (!eventData) {
    return notFound();
  }

  const props: Props = {
    eventData: {
      id: eventData.id,
      length: eventData.length,
      metadata: eventData.metadata,
      title: eventData.title,
      slug: eventData.slug,
      hidden: eventData.hidden,
      badgeColor: eventData.badgeColor,
      price: eventData.price
    },
    user: username,
    slug,
    isBrandingHidden: user?.hideBranding,
    isSEOIndexable: user?.allowSEOIndexing,
    themeBasis: username,
    bookingUid: null,
    rescheduleUid: null,
    orgBannerUrl: eventData?.owner?.profile?.organization?.bannerUrl ?? null
  };

  return {
    props
  };
} 