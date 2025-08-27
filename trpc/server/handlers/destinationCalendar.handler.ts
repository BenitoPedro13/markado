import {
  getCalendarCredentials,
  getConnectedCalendars
} from '@/packages/core/CalendarManager';
import {getUsersCredentials} from '@/packages/lib/server/getUsersCredentials';
import {prisma} from '@/lib/prisma';

import type {TDestinationCalendarInputSchema} from '../schemas/destinationCalendar.schema';
import { TRPCError } from '@trpc/server';
import { UserFromSession } from '@/lib/getUserFromSession';

type SessionUser = NonNullable<UserFromSession>;
type User = {
  id: SessionUser['id'];
  selectedCalendars: SessionUser['selectedCalendars'];
};

type SetDestinationCalendarOptions = {
  user: User;
  input: TDestinationCalendarInputSchema;
};

export const setDestinationCalendarHandler = async ({
  user,
  input
}: SetDestinationCalendarOptions) => {
  const {integration, externalId, eventTypeId} = input;
  const credentials = await getUsersCredentials(user);
  const calendarCredentials = getCalendarCredentials(credentials);
  const {connectedCalendars} = await getConnectedCalendars(
    calendarCredentials,
    user.selectedCalendars
  );
  const allCals = connectedCalendars.map((cal) => cal.calendars ?? []).flat();

  const credentialId = allCals.find(
    (cal) =>
      cal.externalId === externalId &&
      cal.integration === integration &&
      cal.readOnly === false
  )?.credentialId;

  if (!credentialId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Could not find calendar ${input.externalId}`
    });
  }

  const primaryEmail =
    allCals.find((cal) => cal.primary && cal.credentialId === credentialId)
      ?.email ?? null;

  let where;

  if (eventTypeId) {
    if (
      !(await prisma.eventType.findFirst({
        where: {
          id: eventTypeId,
          userId: user.id
        }
      }))
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `You don't have access to event type ${eventTypeId}`
      });
    }

    where = {eventTypeId};
  } else where = {userId: user.id};

  await prisma.destinationCalendar.upsert({
    where,
    update: {
      integration,
      externalId,
      credentialId,
      primaryEmail
    },
    create: {
      ...where,
      integration,
      externalId,
      credentialId,
      primaryEmail
    }
  });
};
