'use server';

import type {Prisma} from '~/prisma/app/generated/prisma/client';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {prisma} from '@/lib/prisma';
import {EventTypeRepository} from '@/repositories/eventType';
import type {PrismaClient} from '~/prisma/app/generated/prisma/client';
import {SchedulingType, UserPermissionRole} from '~/prisma/enums';
import type {EventTypeLocation} from '~/trpc/server/schemas/services.schema';

import {TRPCError} from '@trpc/server';
import {userMetadataType} from '~/prisma/zod-utils';
import type {TCreateInputSchema} from '~/trpc/server/schemas/services.schema';
import { auth } from '@/auth';
import { UserRepository } from '@/repositories/user';

// Create

// type User = {
//   id: string;
//   // role: UserPermissionRole;
//   // organizationId: number | null;
//   // organization: {
//   //   isOrgAdmin: boolean;
//   // };
//   profile: {
//     id: number | null;
//   };
//   metadata: userMetadataType;
// };

type CreateOptions = {
  // ctx: {
  //   user: User;
  //   prisma: PrismaClient;
  // };
  input: TCreateInputSchema;
};

export const createServiceHandler = async ({input}: CreateOptions) => {
  const session = await auth();

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'createServiceHandler: Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'createServiceHandler: Not authenticated'
    });
  }

  const user = await UserRepository.findByIdOrThrow({id: session.user.id});
  const enrichedUser = await UserRepository.enrichUserWithItsProfile({user})

  const {
    schedulingType,
    teamId,
    metadata,
    locations: inputLocations,
    scheduleId,
    ...rest
  } = input;

  const userId = session.user.id;
  // const isManagedEventType = schedulingType === SchedulingType.MANAGED;
  // const isOrgAdmin = user?.organization?.isOrgAdmin;
  
  const locations: EventTypeLocation[] | undefined = inputLocations;

  const data: Prisma.EventTypeCreateInput = {
    ...rest,
    owner: teamId ? undefined : {connect: {id: userId}},
    metadata: (metadata as Prisma.InputJsonObject) ?? undefined,
    // Only connecting the current user for non-managed event types and non team event types
    users:
      // isManagedEventType || schedulingType
        // ? undefined
        // : 
        {connect: {id: userId}},
    locations,
    schedule: scheduleId ? {connect: {id: scheduleId}} : undefined
  };

  // if (teamId && schedulingType) {
  //   const hasMembership = await prisma.membership.findFirst({
  //     where: {
  //       userId,
  //       teamId: teamId,
  //       accepted: true
  //     }
  //   });

  //   const isSystemAdmin = ctx.user.role === 'ADMIN';

  //   if (
  //     !isSystemAdmin &&
  //     (!hasMembership?.role ||
  //       !(['ADMIN', 'OWNER'].includes(hasMembership.role) || isOrgAdmin))
  //   ) {
  //     console.warn(
  //       `User ${userId} does not have permission to create this new event type`
  //     );
  //     throw new TRPCError({code: 'UNAUTHORIZED'});
  //   }

  //   data.team = {
  //     connect: {
  //       id: teamId
  //     }
  //   };
  //   data.schedulingType = schedulingType;
  // }

  // If we are in an organization & they are not admin & they are not creating an event on a teamID
  // Check if evenTypes are locked.
  // if (
  //   ctx.user.organizationId &&
  //   !ctx.user?.organization?.isOrgAdmin &&
  //   !teamId
  // ) {
  //   const orgSettings = await prisma.organizationSettings.findUnique({
  //     where: {
  //       organizationId: ctx.user.organizationId
  //     },
  //     select: {
  //       lockEventTypeCreationForUsers: true
  //     }
  //   });

  //   const orgHasLockedEventTypes = !!orgSettings?.lockEventTypeCreationForUsers;
  //   if (orgHasLockedEventTypes) {
  //     console.warn(
  //       `User ${userId} does not have permission to create this new event type - Locked status: ${orgHasLockedEventTypes}`
  //     );
  //     throw new TRPCError({code: 'UNAUTHORIZED'});
  //   }
  // }
  const profile = enrichedUser.profile;
  try {
    const eventType = await EventTypeRepository.create({
      ...data,
      profileId: profile.id
    });
    return {eventType};
  } catch (e) {
    console.warn(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e.code === 'P2002' &&
        Array.isArray(e.meta?.target) &&
        e.meta?.target.includes('slug')
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'URL Slug already exists for given user.'
        });
      }
    }
    throw new TRPCError({code: 'BAD_REQUEST'});
  }
};
