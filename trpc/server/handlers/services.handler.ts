'use server';

import {Prisma} from '~/prisma/app/generated/prisma/client';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {prisma} from '@/lib/prisma';
import {EventTypeRepository} from '@/repositories/eventType';
import {generateHashedLink} from '@/lib/generateHashedLink';
import {SchedulingType} from '~/prisma/enums';
import type {
  EventTypeLocation,
  TDeleteInputSchema,
  TDuplicateInputSchema,
  TGetEventTypesFromGroupSchema,
  TGetInputSchema
} from '~/trpc/server/schemas/services.schema';
import {TRPCError} from '@trpc/server';
import type {TCreateInputSchema} from '~/trpc/server/schemas/services.schema';
import {auth} from '@/auth';
import {UserRepository} from '@/repositories/user';
import {safeStringify} from '@/lib/safeStringify';
import {hasFilter, mapEventType} from '~/trpc/server/utils/services/util';
import {revalidatePath} from 'next/cache';
import getEventTypeBySlug from '@/packages/event-types/getEventTypeBySlug';
import {validateIntervalLimitOrder} from '@/packages/lib';
import {validateBookerLayouts} from '@/packages/lib/validateBookerLayouts';
import {
  ensureUniqueBookingFields,
  ensureEmailOrPhoneNumberIsPresent,
  handleCustomInputs,
  handlePeriodType
} from '~/trpc/server/utils/services/util';
import {TUpdateInputSchema} from '~/trpc/server/schemas/services.schema';
import { baseServices } from '@/data/services';
import { log } from 'console';

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

export const createServicesBatch = async () => {
  const session = await auth();

  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "createServicesBatch: Not authenticated",
    });
  }

  const user = await UserRepository.findByIdOrThrow({ id: session.user.id });
  const enrichedUser = await UserRepository.enrichUserWithItsProfile({ user });

  try {
    for (const service of baseServices) {
      const input = {
        title: service.title,
        slug: service.slug,
        description: service.description,
        length: service.length,
        price: service.price,
        badgeColor: service.badgeColor,
        hidden: false,
        // locations: service.locations ? service.locations.map(location => ({
        //   type: 'integrations:google:meet',
        //   address: location
        // })) : undefined,
        locations: service.locations,
      };

      await createServiceHandler({ input });
    }

  } catch (e) {
    console.warn("Erro ao criar batch de serviços:", e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e.code === "P2002" &&
        Array.isArray(e.meta?.target) &&
        e.meta.target.includes("slug")
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more service slugs already exist for the user.",
        });
      }
    }
    throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to create services batch." });
  }
}

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

  // Primeiro, verificar se o usuário tem algum serviço no banco (sem filtros)
  // const hasAnyServices = await prisma.eventType.findFirst({
  //   where: {
  //     userId: user.id,
  //     teamId: null,
  //     schedulingType: null
  //   }
  // });

  // // Se não tem nenhum serviço, criar os serviços padrão
  // if (!hasAnyServices) {
  //   await createServicesBatch();
  // }

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
  console.log('eventTypes', eventTypes);

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
              : {}),
            ...(filters && filters.hidden !== null 
              ? {hidden: filters.hidden} 
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

// Update

type UpdateOptions = {
  input: TUpdateInputSchema;
};

export type UpdateEventTypeReturn = Awaited<
  ReturnType<typeof updateServiceHandler>
>;

export const updateServiceHandler = async ({input}: UpdateOptions) => {
  const session = await auth();

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'updateServiceHandler: Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'updateServiceHandler: Not authenticated'
    });
  }

  const user = await UserRepository.findByIdOrThrow({id: session.user.id});
  const enrichedUser = await UserRepository.enrichUserWithItsProfile({user});

  const userProfile = enrichedUser.profile;

  const {
    schedule,
    instantMeetingSchedule,
    periodType,
    locations,
    bookingLimits,
    durationLimits,
    destinationCalendar,
    customInputs,
    recurringEvent,
    eventTypeColor,
    users,
    children,
    assignAllTeamMembers,
    hosts,
    id,
    multiplePrivateLinks,
    // Extract this from the input so it doesn't get saved in the db
    // eslint-disable-next-line
    userId,
    bookingFields,
    offsetStart,
    secondaryEmailId,
    aiPhoneCallConfig,
    isRRWeightsEnabled,
    ...rest
  } = input;

  const eventType = await prisma.eventType.findUniqueOrThrow({
    where: {id},
    select: {
      title: true,
      // isRRWeightsEnabled: true,
      hosts: {
        select: {
          userId: true,
          priority: true,
          weight: true,
          isFixed: true
        }
      },
      // aiPhoneCallConfig: {
      //   select: {
      //     generalPrompt: true,
      //     beginMessage: true,
      //     enabled: true,
      //     llmId: true
      //   }
      // },
      children: {
        select: {
          userId: true
        }
      },
      workflows: {
        select: {
          workflowId: true
        }
      },
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
          parent: {
            select: {
              slug: true
            }
          },
          members: {
            select: {
              role: true,
              accepted: true,
              user: {
                select: {
                  name: true,
                  id: true,
                  email: true,
                  eventTypes: {
                    select: {
                      slug: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (
    input.teamId &&
    eventType.team?.id &&
    input.teamId !== eventType.team.id
  ) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }

  const teamId = input.teamId || eventType.team?.id;

  ensureUniqueBookingFields(bookingFields);
  ensureEmailOrPhoneNumberIsPresent(bookingFields);

  const data: Prisma.EventTypeUpdateInput = {
    ...rest,
    bookingFields,
    // isRRWeightsEnabled,
    metadata:
      rest.metadata === null
        ? Prisma.DbNull
        : (rest.metadata as Prisma.InputJsonObject),
    eventTypeColor:
      eventTypeColor === null
        ? Prisma.DbNull
        : (eventTypeColor as Prisma.InputJsonObject)
  };
  data.locations = locations ?? undefined;
  if (periodType) {
    data.periodType = handlePeriodType(periodType);
  }

  if (recurringEvent) {
    data.recurringEvent = {
      dstart: recurringEvent.dtstart as unknown as Prisma.InputJsonObject,
      interval: recurringEvent.interval,
      count: recurringEvent.count,
      freq: recurringEvent.freq,
      until: recurringEvent.until as unknown as Prisma.InputJsonObject,
      tzid: recurringEvent.tzid
    };
  } else if (recurringEvent === null) {
    data.recurringEvent = Prisma.DbNull;
  }

  // if (destinationCalendar) {
  //   /** We connect or create a destination calendar to the event type instead of the user */
  //   await setDestinationCalendarHandler({
  //     ctx,
  //     input: {
  //       ...destinationCalendar,
  //       eventTypeId: id
  //     }
  //   });
  // }

  if (customInputs) {
    data.customInputs = handleCustomInputs(customInputs, id);
  }

  if (bookingLimits) {
    const isValid = validateIntervalLimitOrder(bookingLimits);
    if (!isValid)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Booking limits must be in ascending order.'
      });
    data.bookingLimits = bookingLimits;
  }

  if (durationLimits) {
    const isValid = validateIntervalLimitOrder(durationLimits);
    if (!isValid)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Duration limits must be in ascending order.'
      });
    data.durationLimits = durationLimits;
  }

  if (offsetStart !== undefined) {
    if (offsetStart < 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Offset start time must be zero or greater.'
      });
    }
    data.offsetStart = offsetStart;
  }

  const bookerLayoutsError = validateBookerLayouts(
    input.metadata?.bookerLayouts || null
  );
  if (bookerLayoutsError) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'bookerLayoutsError: ' + bookerLayoutsError
    });
  }

  if (schedule) {
    // Check that the schedule belongs to the user
    const userScheduleQuery = await prisma.schedule.findFirst({
      where: {
        userId: user.id,
        id: schedule
      }
    });
    if (userScheduleQuery) {
      data.schedule = {
        connect: {
          id: schedule
        }
      };
    }
  }
  // allows unsetting a schedule through { schedule: null, ... }
  else if (null === schedule) {
    data.schedule = {
      disconnect: true
    };
  }

  if (instantMeetingSchedule) {
    data.instantMeetingSchedule = {
      connect: {
        id: instantMeetingSchedule
      }
    };
  } else if (schedule === null) {
    data.instantMeetingSchedule = {
      disconnect: true
    };
  }

  if (users?.length) {
    data.users = {
      set: [],
      connect: users.map((userId: string) => ({id: userId}))
    };
  }

  if (teamId && hosts) {
    // check if all hosts can be assigned (memberships that have accepted invite)
    const memberships =
      (await prisma.membership.findMany({
        where: {
          teamId,
          accepted: true
        }
      })) || [];
    const teamMemberIds = memberships.map((membership) => membership.userId);
    // guard against missing IDs, this may mean a member has just been removed
    // or this request was forged.
    // we let this pass through on organization sub-teams
    if (
      !hosts.every((host) => teamMemberIds.includes(host.userId)) &&
      !eventType.team?.parentId
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN'
      });
    }

    // // weights were already enabled or are enabled now
    // const isWeightsEnabled =
    //   isRRWeightsEnabled ||
    //   (typeof isRRWeightsEnabled === 'undefined' &&
    //     eventType.isRRWeightsEnabled);

    const oldHostsSet = new Set(
      eventType.hosts.map((oldHost) => oldHost.userId)
    );
    const newHostsSet = new Set(hosts.map((oldHost) => oldHost.userId));

    const existingHosts = hosts.filter((newHost) =>
      oldHostsSet.has(newHost.userId)
    );
    const newHosts = hosts.filter(
      (newHost) => !oldHostsSet.has(newHost.userId)
    );
    const removedHosts = eventType.hosts.filter(
      (oldHost) => !newHostsSet.has(oldHost.userId)
    );

    data.hosts = {
      deleteMany: {
        OR: removedHosts.map((host) => ({
          userId: host.userId,
          eventTypeId: id
        }))
      },
      create: newHosts.map((host) => {
        return {
          ...host,
          isFixed:
            data.schedulingType === SchedulingType.COLLECTIVE || host.isFixed,
          priority: host.priority ?? 2,
          weight: host.weight ?? 100
        };
      }),
      update: existingHosts.map((host) => ({
        where: {
          userId_eventTypeId: {
            userId: host.userId,
            eventTypeId: id
          }
        },
        data: {
          isFixed:
            data.schedulingType === SchedulingType.COLLECTIVE || host.isFixed,
          priority: host.priority ?? 2,
          weight: host.weight ?? 100
        }
      }))
    };
  }

  if (input.metadata?.disableStandardEmails?.all) {
    if (!eventType?.team?.parentId) {
      input.metadata.disableStandardEmails.all.host = false;
      input.metadata.disableStandardEmails.all.attendee = false;
    }
  }

  // if (input.metadata?.disableStandardEmails?.confirmation) {
  //   //check if user is allowed to disabled standard emails
  //   const workflows = await ctx.prisma.workflow.findMany({
  //     where: {
  //       activeOn: {
  //         some: {
  //           eventTypeId: input.id
  //         }
  //       },
  //       trigger: WorkflowTriggerEvents.NEW_EVENT
  //     },
  //     include: {
  //       steps: true
  //     }
  //   });

  //   if (input.metadata?.disableStandardEmails.confirmation?.host) {
  //     if (!allowDisablingHostConfirmationEmails(workflows)) {
  //       input.metadata.disableStandardEmails.confirmation.host = false;
  //     }
  //   }

  //   if (input.metadata?.disableStandardEmails.confirmation?.attendee) {
  //     if (!allowDisablingAttendeeConfirmationEmails(workflows)) {
  //       input.metadata.disableStandardEmails.confirmation.attendee = false;
  //     }
  //   }
  // }

  // for (const appKey in input.metadata?.apps) {
  //   const app = input.metadata?.apps[appKey as keyof typeof appDataSchemas];
  //   // There should only be one enabled payment app in the metadata
  //   if (app.enabled && app.price && app.currency) {
  //     data.price = app.price;
  //     data.currency = app.currency;
  //     break;
  //   }
  // }
  const connectedLinks = await prisma.hashedLink.findMany({
    where: {
      eventTypeId: input.id
    },
    select: {
      id: true,
      link: true
    }
  });

  const connectedMultiplePrivateLinks = connectedLinks.map((link) => link.link);

  if (multiplePrivateLinks && multiplePrivateLinks.length > 0) {
    const multiplePrivateLinksToBeInserted = multiplePrivateLinks.filter(
      (link) => !connectedMultiplePrivateLinks.includes(link)
    );
    const singleLinksToBeDeleted = connectedMultiplePrivateLinks.filter(
      (link) => !multiplePrivateLinks.includes(link)
    );
    if (singleLinksToBeDeleted.length > 0) {
      await prisma.hashedLink.deleteMany({
        where: {
          eventTypeId: input.id,
          link: {
            in: singleLinksToBeDeleted
          }
        }
      });
    }
    if (multiplePrivateLinksToBeInserted.length > 0) {
      await prisma.hashedLink.createMany({
        data: multiplePrivateLinksToBeInserted.map((link) => {
          return {
            link: link,
            eventTypeId: input.id
          };
        })
      });
    }
  } else {
    // Delete all the single-use links for this event.
    if (connectedMultiplePrivateLinks.length > 0) {
      await prisma.hashedLink.deleteMany({
        where: {
          eventTypeId: input.id,
          link: {
            in: connectedMultiplePrivateLinks
          }
        }
      });
    }
  }

  if (assignAllTeamMembers !== undefined) {
    data.assignAllTeamMembers = assignAllTeamMembers;
  }

  // Validate the secondary email
  if (secondaryEmailId) {
    const secondaryEmail = await prisma.secondaryEmail.findUnique({
      where: {
        id: secondaryEmailId,
        userId: user.id
      }
    });
    // Make sure the secondary email id belongs to the current user and its a verified one
    if (secondaryEmail && secondaryEmail.emailVerified) {
      data.secondaryEmail = {
        connect: {
          id: secondaryEmailId
        }
      };
      // Delete the data if the user selected his original email to send the events to, which means the value coming will be -1
    } else if (secondaryEmailId === -1) {
      data.secondaryEmail = {
        disconnect: true
      };
    }
  }

  // if (aiPhoneCallConfig) {
  //   if (aiPhoneCallConfig.enabled) {
  //     await ctx.prisma.aIPhoneCallConfiguration.upsert({
  //       where: {
  //         eventTypeId: id
  //       },
  //       update: {
  //         ...aiPhoneCallConfig,
  //         guestEmail: !!aiPhoneCallConfig?.guestEmail
  //           ? aiPhoneCallConfig.guestEmail
  //           : null,
  //         guestCompany: !!aiPhoneCallConfig?.guestCompany
  //           ? aiPhoneCallConfig.guestCompany
  //           : null
  //       },
  //       create: {
  //         ...aiPhoneCallConfig,
  //         guestEmail: !!aiPhoneCallConfig?.guestEmail
  //           ? aiPhoneCallConfig.guestEmail
  //           : null,
  //         guestCompany: !!aiPhoneCallConfig?.guestCompany
  //           ? aiPhoneCallConfig.guestCompany
  //           : null,
  //         eventTypeId: id
  //       }
  //     });
  //   } else if (!aiPhoneCallConfig.enabled && eventType.aiPhoneCallConfig) {
  //     await ctx.prisma.aIPhoneCallConfiguration.delete({
  //       where: {
  //         eventTypeId: id
  //       }
  //     });
  //   }
  // }

  const updatedEventTypeSelect = Prisma.validator<Prisma.EventTypeSelect>()({
    slug: true,
    schedulingType: true
  });
  let updatedEventType: Prisma.EventTypeGetPayload<{
    select: typeof updatedEventTypeSelect;
  }>;

  try {
    updatedEventType = await prisma.eventType.update({
      where: {id},
      data,
      select: updatedEventTypeSelect
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // instead of throwing a 500 error, catch the conflict and throw a 400 error.
        throw new TRPCError({
          message: 'error_event_type_url_duplicate',
          code: 'BAD_REQUEST'
        });
      }
    }
    throw e;
  }
  const updatedValues = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      // @ts-expect-error Element implicitly has any type
      acc[key] = value;
    }
    return acc;
  }, {});

  // Handling updates to children event types (managed events types)
  // await updateChildrenEventTypes({
  //   eventTypeId: id,
  //   currentUserId: ctx.user.id,
  //   oldEventType: eventType,
  //   updatedEventType,
  //   children,
  //   profileId: ctx.user.profile.id,
  //   prisma: ctx.prisma,
  //   updatedValues
  // });

  // const res = ctx.res as NextApiResponse;
  // if (typeof res?.revalidate !== 'undefined') {
  //   try {
  //     await res?.revalidate(`/${ctx.user.username}/${updatedEventType.slug}`);
  //   } catch (e) {
  //     // if reach this it is because the event type page has not been created, so it is not possible to revalidate it
  //     console.debug((e as Error)?.message);
  //   }
  // }

  revalidatePath('/services'); // revalidate the list page
  revalidatePath(`/${user.username}/${updatedEventType.slug}`); // revalidate the service page
  revalidatePath(`/${userProfile.username}/${updatedEventType.slug}`); // revalidate the service page
  return {eventType};
};

// Delete

type ChangeServiceHiddenStatusOptions = {
  input: {id: number; hidden: boolean};
};
export const changeServiceHiddenStatus = async ({
  input: {id, hidden}
}: ChangeServiceHiddenStatusOptions) => {
  const session = await auth();

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'changeServiceHiddenStatus: Could not get the user session'
    });
  }

  if (!session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'changeServiceHiddenStatus: Not authenticated'
    });
  }

  const existingService = await prisma.eventType.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  });

  if (!existingService) {
    throw new Error(
      "Service not found or you don't have permission to edit it"
    );
  }

  console.log(`Updating Service for user ${session.user.id}:`, id);

  await prisma.eventType.update({
    where: {
      id,
      userId: session.user.id
    },
    data: {
      id,
      hidden
    }
  });
  revalidatePath('/services'); // revalidate the list page

  return {id};
};

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

    revalidatePath('/services'); // revalidate the list page
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
