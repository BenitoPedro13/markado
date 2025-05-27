'use server';

import {Prisma} from '~/prisma/app/generated/prisma/client';
// import type {Prisma as PrismaType}  from '~/prisma/app/generated/prisma/client';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {prisma} from '@/lib/prisma';
import {EventTypeRepository} from '@/repositories/eventType';
import {generateHashedLink} from '@/lib/generateHashedLink';
// import {setDestinationCalendarHandler} from './destinationCalendar.handler';
import type {PrismaClient} from '~/prisma/app/generated/prisma/client';
import {SchedulingType, UserPermissionRole} from '~/prisma/enums';
import type {
  EventTypeLocation,
  TDeleteInputSchema,
  TDuplicateInputSchema,
  TGetEventTypesFromGroupSchema,
  TGetInputSchema
} from '~/trpc/server/schemas/services.schema';

import {TRPCError} from '@trpc/server';
import {userMetadataType} from '~/prisma/zod-utils';
import type {TCreateInputSchema} from '~/trpc/server/schemas/services.schema';
import {auth} from '@/auth';
import {UserRepository} from '@/repositories/user';
import {safeStringify} from '@/lib/safeStringify';
import {hasFilter, mapEventType} from '~/trpc/server/utils/services/util';
import {revalidatePath} from 'next/cache';
import getEventTypeBySlug from '@/packages/event-types/getEventTypeBySlug';

// Create

type CreateOptions = {
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
  const enrichedUser = await UserRepository.enrichUserWithItsProfile({user});

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

type GetOptions = {
  input: TGetInputSchema;
};

// get detailed service by slug or id
export const getServiceHandler = async ({input}: GetOptions) => {
  try {
    const session = await auth();

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'getServiceHandler: Could not get the user session'
      });
    }

    if (!session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'getServiceHandler: Not authenticated'
      });
    }

    const user = await UserRepository.findByIdOrThrow({id: session.user.id});
    const enrichedUser = await UserRepository.enrichUserWithItsProfile({user});
    const userProfile = enrichedUser.profile;



    return await getEventTypeBySlug({
      currentOrganizationId: userProfile.organizationId ?? null,
      eventTypeSlug: input.slug,
      userId: session.user.id,
      prisma: prisma,
      // isTrpcCall: true,
      isUserOrganizationAdmin: false // !!enrichedUser?.organization?.isOrgAdmin
    });
  } catch (error) {
    console.error('Error in getServiceHandler:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve service details'
    });
  }
};

// get all services

type GetByViewerOptions = {
  input: TGetEventTypesFromGroupSchema;
};

type EventType = Awaited<
  ReturnType<typeof EventTypeRepository.findAllByUpId>
>[number];
type MappedEventType = Awaited<ReturnType<typeof mapEventType>>;
type EnrichedUser = Awaited<
  ReturnType<
    typeof UserRepository.enrichUserWithItsProfile<
      Awaited<ReturnType<typeof UserRepository.findByIdOrThrow>>
    >
  >
>;

export const getEventTypesFromGroup = async ({
  // ctx,
  input
}: GetByViewerOptions): Promise<{
  eventTypes: MappedEventType[];
  nextCursor: number | null | undefined;
}> => {
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
  const enrichedUser = await UserRepository.enrichUserWithItsProfile({user});

  const userProfile = enrichedUser.profile;
  const {group, limit, cursor, filters, searchQuery} = input;
  const {teamId} = group;

  const isFilterSet = (filters && hasFilter(filters)) || !!teamId;
  const isUpIdInFilter = filters?.upIds?.includes(userProfile.upId);

  const shouldListUserEvents =
    !isFilterSet ||
    isUpIdInFilter ||
    (isFilterSet && filters?.upIds && !isUpIdInFilter);

  const eventTypes: MappedEventType[] = [];
  const currentCursor = cursor;
  let nextCursor: number | null | undefined = undefined;
  let isFetchingForFirstTime = true;

  const fetchAndFilterEventTypes = async () => {
    const batch = await fetchEventTypesBatch(
      enrichedUser,
      input,
      shouldListUserEvents,
      currentCursor,
      searchQuery
    );
    const filteredBatch = await filterEventTypes(
      batch.eventTypes,
      enrichedUser.id,
      shouldListUserEvents,
      teamId
    );
    eventTypes.push(...filteredBatch);
    nextCursor = batch.nextCursor;
  };

  while (eventTypes.length < limit && (nextCursor || isFetchingForFirstTime)) {
    await fetchAndFilterEventTypes();
    isFetchingForFirstTime = false;
  }

  return {
    eventTypes,
    nextCursor: nextCursor ?? undefined
  };
};

const fetchEventTypesBatch = async (
  user: EnrichedUser,
  input: GetByViewerOptions['input'],
  shouldListUserEvents: boolean | undefined,
  cursor: TGetEventTypesFromGroupSchema['cursor'],
  searchQuery: TGetEventTypesFromGroupSchema['searchQuery']
) => {
  const userProfile = user.profile;
  const {group, limit, filters} = input;
  const {teamId, parentId} = group;
  const isFilterSet = (filters && hasFilter(filters)) || !!teamId;

  const eventTypes: EventType[] = [];

  if (shouldListUserEvents || !teamId) {
    const userEventTypes =
      (await EventTypeRepository.findAllByUpId(
        {
          upId: userProfile.upId,
          userId: user.id
        },
        {
          where: {
            teamId: null,
            schedulingType: null,
            ...(searchQuery
              ? {title: {contains: searchQuery, mode: 'insensitive'}}
              : {})
          },
          orderBy: [
            {
              position: 'desc'
            },
            {
              id: 'asc'
            }
          ],
          limit,
          cursor
        }
      )) ?? [];

    eventTypes.push(...userEventTypes);
  }

  if (teamId) {
    const teamEventTypes =
      (await EventTypeRepository.findTeamEventTypes({
        teamId,
        parentId,
        userId: user.id,
        limit,
        cursor,
        where: {
          ...(isFilterSet && !!filters?.schedulingTypes
            ? {
                schedulingType: {in: filters.schedulingTypes}
              }
            : null),
          ...(searchQuery
            ? {title: {contains: searchQuery, mode: 'insensitive'}}
            : {})
        },
        orderBy: [
          {
            position: 'desc'
          },
          {
            id: 'asc'
          }
        ]
      })) ?? [];

    eventTypes.push(...teamEventTypes);
  }

  let nextCursor: number | null | undefined = undefined;
  if (eventTypes.length > limit) {
    const nextItem = eventTypes.pop();
    nextCursor = nextItem?.id;
  }

  const mappedEventTypes = await Promise.all(eventTypes.map(mapEventType));

  return {eventTypes: mappedEventTypes, nextCursor: nextCursor ?? undefined};
};

const filterEventTypes = async (
  eventTypes: MappedEventType[],
  userId: string,
  shouldListUserEvents: boolean | undefined,
  teamId: number | null | undefined
) => {
  const filteredEventTypes = eventTypes.filter((eventType) => {
    if (!eventType.parentId) {
      return true;
    }
    // A child event only has one user
    const childEventAssignee = eventType.users[0];

    if (!childEventAssignee || childEventAssignee.id !== userId) {
      return false;
    }
    return true;
  });

  console.info(
    'mappedEventTypes before and after filtering',
    safeStringify({
      beforeFiltering: eventTypes,
      afterFiltering: filteredEventTypes
    })
  );

  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      teamId: teamId ?? 0,
      accepted: true,
      role: 'MEMBER'
    },
    include: {
      team: {
        select: {
          isPrivate: true
        }
      }
    }
  });

  if (membership && membership.team.isPrivate)
    filteredEventTypes.forEach((evType) => {
      evType.users = [];
      evType.hosts = [];
    });

  console.info(
    'filteredEventTypes',
    safeStringify({
      filteredEventTypes
    })
  );

  return filteredEventTypes;
};

// Delete

export const deleteService = async (input: TDeleteInputSchema) => {
  const session = await auth();
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'deleteService: Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'deleteService: Not authenticated'
    });
  }

  const {id} = input;

  const existingService = await prisma.eventType.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  });

  if (!existingService) {
    throw new Error(
      "Service not found or you don't have permission to delete it"
    );
  }

  console.log(`Deleting Service for user ${session.user.id}:`, id);

  await prisma.eventTypeCustomInput.deleteMany({
    where: {
      eventTypeId: id
    }
  });

  await prisma.eventType.delete({
    where: {
      id
    }
  });
  revalidatePath('/services'); // revalidate the list page

  return {
    id
  };
};

export const submitDeleteService = async (serviceId: number) => {
  try {
    const serviceResult = await deleteService({id: serviceId});

    if (!serviceResult.id) return;

    return serviceResult;
  } catch (error) {
    console.error('Error deleting Service:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete service'
    });
  }
};

// Duplicate

export const duplicateHandler = async (input: TDuplicateInputSchema) => {
  try {
    const session = await auth();
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'deleteService: Could not get the user session'
      });
    }

    if (!session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'deleteService: Not authenticated'
      });
    }

    const {
      id: originalEventTypeId,
      title: newEventTitle,
      slug: newSlug,
      description: newDescription,
      length: newLength
    } = input;
    const eventType = await prisma.eventType.findUnique({
      where: {
        id: originalEventTypeId
      },
      include: {
        customInputs: true,
        schedule: true,
        users: {
          select: {
            id: true
          }
        },
        hosts: true,
        team: true,
        workflows: true,
        webhooks: true,
        hashedLink: true,
        destinationCalendar: true
      }
    });

    if (!eventType) {
      throw new TRPCError({code: 'NOT_FOUND'});
    }

    // Validate user is owner of event type or in the team
    if (eventType.userId !== session.user.id) {
      if (eventType.teamId) {
        const isMember = await prisma.membership.findFirst({
          where: {
            userId: session.user.id,
            teamId: eventType.teamId
          }
        });
        if (!isMember) {
          throw new TRPCError({code: 'FORBIDDEN'});
        }
      }
    }

    const {
      customInputs,
      users,
      locations,
      team,
      hosts,
      recurringEvent,
      bookingLimits,
      durationLimits,
      eventTypeColor,
      metadata,
      workflows,
      hashedLink,
      destinationCalendar,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id: _id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      webhooks: _webhooks,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      schedule: _schedule,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
      // @ts-ignore - descriptionAsSafeHTML is added on the fly using a prisma middleware it shouldn't be used to create event type. Such a property doesn't exist on schema
      descriptionAsSafeHTML: _descriptionAsSafeHTML,
      secondaryEmailId,
      instantMeetingScheduleId: _instantMeetingScheduleId,
      ...rest
    } = eventType;

    const data: Prisma.EventTypeCreateInput = {
      ...rest,
      title: newEventTitle,
      slug: newSlug,
      description: newDescription,
      length: newLength,
      locations: locations ?? undefined,
      team: team ? {connect: {id: team.id}} : undefined,
      users: users
        ? {connect: users.map((user) => ({id: user.id}))}
        : undefined,
      hosts: hosts
        ? {
            createMany: {
              data: hosts.map(({eventTypeId: _, ...rest}) => rest)
            }
          }
        : undefined,

      recurringEvent: recurringEvent || undefined,
      bookingLimits: bookingLimits ?? undefined,
      durationLimits: durationLimits ?? undefined,
      eventTypeColor: eventTypeColor ?? undefined,
      metadata: metadata === null ? Prisma.DbNull : metadata,
      bookingFields:
        eventType.bookingFields === null
          ? Prisma.DbNull
          : eventType.bookingFields
    };

    // Validate the secondary email
    if (!!secondaryEmailId) {
      const secondaryEmail = await prisma.secondaryEmail.findUnique({
        where: {
          id: secondaryEmailId,
          userId: session.user.id
        }
      });
      // Make sure the secondary email id belongs to the current user and its a verified one
      if (secondaryEmail && secondaryEmail.emailVerified) {
        data.secondaryEmail = {
          connect: {
            id: secondaryEmailId
          }
        };
      }
    }

    const newEventType = await EventTypeRepository.create(data);

    // Create custom inputs
    if (customInputs) {
      const customInputsData = customInputs.map((customInput) => {
        const {id: _, options, ...rest} = customInput;
        return {
          options: options ?? undefined,
          ...rest,
          eventTypeId: newEventType.id
        };
      });
      await prisma.eventTypeCustomInput.createMany({
        data: customInputsData
      });
    }

    if (hashedLink) {
      await prisma.hashedLink.create({
        data: {
          link: generateHashedLink(users[0]?.id ?? newEventType.teamId),
          eventType: {
            connect: {id: newEventType.id}
          }
        }
      });
    }

    if (workflows.length > 0) {
      const relationCreateData = workflows.map((workflow) => {
        return {eventTypeId: newEventType.id, workflowId: workflow.workflowId};
      });

      await prisma.workflowsOnEventTypes.createMany({
        data: relationCreateData
      });
    }

    revalidatePath('/services'); // revalidate the list page
    // if (destinationCalendar) {
    //   await setDestinationCalendarHandler({
    //     ctx,
    //     input: {
    //       ...destinationCalendar,
    //       eventTypeId: newEventType.id
    //     }
    //   });
    // }

    // return {
    //   eventType: newEventType
    // };
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Error duplicating event type ${error}`
    });
  }
};
