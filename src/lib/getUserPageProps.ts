import { auth } from '@/auth';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';
import { getHostUserByUsername } from '~/trpc/server/handlers/user.handler';
import eventHandler from '~/trpc/server/handlers/events.handler';
import { notFound } from 'next/navigation';

export async function getUserPageProps({
  username,
  slug
}: {
  username: string;
  slug: string;
}) {
  const session = await auth();
  const userId = session?.user.id || null;
  const user = userId ? await getMeByUserId(userId) : null;

  const host = await getHostUserByUsername(username);
  if (!host) {
    throw new Error('Host not found');
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

  return {
    props: {
      eventData: {
        id: eventData.id,
        length: eventData.length,
        metadata: eventData.metadata,
        title: eventData.title,
        slug: eventData.slug,
        hidden: eventData.hidden,
        badgeColor: eventData.badgeColor,
        price: eventData.price,
        entity: eventData.entity,
      },
      booking: null,
      isBrandingHidden: user?.hideBranding || false,
      orgBannerUrl: eventData?.owner?.profile?.organization?.bannerUrl ?? null,
      isSEOIndexable: user?.allowSEOIndexing || false,
      themeBasis: username
    }
  };
} 