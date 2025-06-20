import type {LocationObject} from '@/packages/core/location';
import { workflowSelect } from "@/packages/features/workflows/lib/getAllWorkflows";
import {getBookingFieldsWithSystemFields} from '@/packages/features/bookings/lib/getBookingFields';
import {parseRecurringEvent} from '@/packages/lib';
import {prisma} from '@/lib/prisma';
import {credentialForCalendarServiceSelect} from '~/prisma/selects/credential';
import {userSelect} from '~/prisma/selects';
import {EventTypeMetaDataSchema, customInputSchema} from '~/prisma/zod-utils';

export const getEventTypesFromDB = async (eventTypeId: number) => {
  const eventType = await prisma.eventType.findUniqueOrThrow({
    where: {
      id: eventTypeId
    },
    select: {
      id: true,
      customInputs: true,
      disableGuests: true,
      users: {
        select: {
          credentials: {
            select: credentialForCalendarServiceSelect
          },
          ...userSelect.select
        }
      },
      slug: true,
      profile: {
        select: {
          organizationId: true
        }
      },
      teamId: true,
      team: {
        select: {
          id: true,
          name: true,
          parentId: true,
          bookingLimits: true,
          includeManagedEventsInLimits: true
        }
      },
      bookingFields: true,
      title: true,
      length: true,
      eventName: true,
      schedulingType: true,
      description: true,
      periodType: true,
      periodStartDate: true,
      periodEndDate: true,
      periodDays: true,
      periodCountCalendarDays: true,
      lockTimeZoneToggleOnBookingPage: true,
      requiresConfirmation: true,
      requiresBookerEmailVerification: true,
      minimumBookingNotice: true,
      userId: true,
      price: true,
      currency: true,
      metadata: true,
      destinationCalendar: true,
      hideCalendarNotes: true,
      hideCalendarEventDetails: true,
      seatsPerTimeSlot: true,
      recurringEvent: true,
      seatsShowAttendees: true,
      seatsShowAvailabilityCount: true,
      bookingLimits: true,
      durationLimits: true,
      // rescheduleWithSameRoundRobinHost: true,
      assignAllTeamMembers: true,
      // isRRWeightsEnabled: true,
      beforeEventBuffer: true,
      afterEventBuffer: true,
      parentId: true,
      parent: {
        select: {
          teamId: true,
          team: {
            select: {
              id: true,
              bookingLimits: true,
              includeManagedEventsInLimits: true
            }
          }
        }
      },
      useEventTypeDestinationCalendarEmail: true,
      owner: {
        select: {
          hideBranding: true
        }
      },
      workflows: {
        select: {
          workflow: {
            select: workflowSelect
          }
        }
      },
      locations: true,
      timeZone: true,
      schedule: {
        select: {
          id: true,
          availability: true,
          timeZone: true
        }
      },
      hosts: {
        select: {
          isFixed: true,
          priority: true,
          weight: true,
          createdAt: true,
          user: {
            select: {
              credentials: {
                select: credentialForCalendarServiceSelect
              },
              ...userSelect.select
            }
          },
          schedule: {
            select: {
              availability: {
                select: {
                  date: true,
                  startTime: true,
                  endTime: true,
                  days: true
                }
              },
              timeZone: true,
              id: true
            }
          }
        }
      },
      availability: {
        select: {
          date: true,
          startTime: true,
          endTime: true,
          days: true
        }
      },
      secondaryEmailId: true,
      secondaryEmail: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });

  let profile: {organizationId: number} | null;

  if ('profile' in eventType) {
    const {profile: usrProfile} = eventType;
    profile = usrProfile as {organizationId: number};
  }

  const isOrgTeamEvent =
    'team' in eventType && !!eventType?.team && !!profile!?.organizationId;

  return {
    ...eventType,
    metadata: EventTypeMetaDataSchema.parse(eventType?.metadata || {}),
    recurringEvent: parseRecurringEvent(eventType?.recurringEvent),
    customInputs: customInputSchema.array().parse(eventType?.customInputs || []),
    // customInputs: customInputSchema.array().parse([]),
    locations: (eventType?.locations ?? []) as LocationObject[],
    bookingFields: getBookingFieldsWithSystemFields({
      ...eventType,
      isOrgTeamEvent
    }),
    isDynamic: false
  };
};

export type getEventTypeResponse = Awaited<
  ReturnType<typeof getEventTypesFromDB>
>;
