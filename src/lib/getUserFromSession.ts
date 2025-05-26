import {UserRepository} from '@/repositories/user';
import {prisma} from '@/lib/prisma';
import type {Session} from 'next-auth';
import {teamMetadataSchema, userMetadata} from '~/prisma/zod-utils';

type Maybe<T> = T | null | undefined;

export async function getUserFromSession(session: Maybe<Session>) {
  if (!session) {
    return null;
  }

  if (!session.user?.id) {
    return null;
  }

  const userFromDb = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      // Locked users can't login
      locked: false
    },
    select: {
      id: true,
      username: true,
      businessAccountType: true,
      name: true,
      email: true,
      emailVerified: true,
      biography: true,
      image: true,
      timeZone: true,
      weekStart: true,
      defaultScheduleId: true,
      bufferTime: true,
      theme: true,
      hideBranding: true,
      identityProvider: true,
      identityProviderId: true,
      brandColor: true,
      darkBrandColor: true,
      movedToProfileId: true,
      selectedCalendars: {
        select: {
          externalId: true,
          integration: true
        }
      },
      completedOnboarding: true,
      destinationCalendar: true,
      locale: true,
      timeFormat: true,
      trialEndsAt: true,
      role: true,
      allowDynamicBooking: true,
      allowSEOIndexing: true,
      profiles: true
    }
  });

  // some hacks to make sure `username` and `email` are never inferred as `null`
  if (!userFromDb) {
    return null;
  }

  const user = await UserRepository.enrichUserWithTheProfile({
    user: userFromDb,
    upId: `usr-${session.user.id}`
  });

  const {email, username, id} = user;
  if (!email || !id) {
    return null;
  }

  const userMetaData = userMetadata.parse(
    // user.metadata ||
    {}
  );
  const orgMetadata = teamMetadataSchema.parse(
    user.profile?.organization?.metadata || {}
  );
  // This helps to prevent reaching the 4MB payload limit by avoiding base64 and instead passing the avatar url

  const locale = user?.locale ?? 'pt';

  const isOrgAdmin = !!user.profile?.organization?.members.filter(
    (member) =>
      (member.role === 'ADMIN' || member.role === 'OWNER') &&
      member.userId === user.id
  ).length;

  // Want to reduce the amount of data being sent
  if (isOrgAdmin && user.profile?.organization?.members) {
    user.profile.organization.members = [];
  }

  const organization = {
    ...user.profile?.organization,
    id: user.profile?.organization?.id ?? null,
    isOrgAdmin,
    metadata: orgMetadata,
    requestedSlug: orgMetadata?.requestedSlug ?? null
  };

  return {
    ...user,
    organization,
    organizationId: organization.id,
    id,
    email,
    username,
    locale,
    defaultBookerLayouts: userMetaData?.defaultBookerLayouts || null
  };
}

export type UserFromSession = Awaited<ReturnType<typeof getUserFromSession>>;