'use server';

import {cookies} from 'next/headers';
import {v4 as uuid} from 'uuid';

import dayjs from '@/lib/dayjs';
import {MINUTES_TO_BOOK} from '@/constants';
import {prisma} from '@/lib/prisma';

import type {TReserveSlotInputSchema} from '~/trpc/server/schemas/public/reserveSlot.schema';
import type {TRemoveSelectedSlotInputSchema} from '~/trpc/server/schemas/public/removeSelectedSlot.schema';

export const reserveSlotAction = async (input: TReserveSlotInputSchema) => {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value || uuid();
  const {slotUtcStartDate, slotUtcEndDate, eventTypeId, bookingUid} = input;
  const releaseAt = dayjs
    .utc()
    .add(parseInt(MINUTES_TO_BOOK), 'minutes')
    .format();
  const eventType = await prisma.eventType.findUnique({
    where: {id: eventTypeId},
    select: {users: {select: {id: true}}, seatsPerTimeSlot: true}
  });

  if (!eventType) {
    throw new Error('Event type not found');
  }

  let shouldReserveSlot = true;

  // If this is a seated event then don't reserve a slot
  if (eventType.seatsPerTimeSlot) {
    // Check to see if this is the last attendee
    const bookingWithAttendees = await prisma.booking.findFirst({
      where: {uid: bookingUid},
      select: {attendees: true}
    });
    const bookingAttendeesLength = bookingWithAttendees?.attendees?.length;
    if (bookingAttendeesLength) {
      const seatsLeft = eventType.seatsPerTimeSlot - bookingAttendeesLength;
      if (seatsLeft < 1) shouldReserveSlot = false;
    } else {
      // If there is no booking yet then don't reserve the slot
      shouldReserveSlot = false;
    }
  }

  if (eventType && shouldReserveSlot) {
    try {
      await Promise.all(
        eventType.users.map((user) =>
          prisma.selectedSlots.upsert({
            where: {
              selectedSlotUnique: {
                userId: user.id,
                slotUtcStartDate,
                slotUtcEndDate,
                uid
              }
            },
            update: {
              slotUtcStartDate,
              slotUtcEndDate,
              releaseAt,
              eventTypeId
            },
            create: {
              userId: user.id,
              eventTypeId,
              slotUtcStartDate,
              slotUtcEndDate,
              uid,
              releaseAt,
              isSeat: eventType.seatsPerTimeSlot !== null
            }
          })
        )
      );
    } catch (error) {
      throw new Error('Erro ao reservar slot');
    }
  }

  // Define o cookie usando cookies() do Next.js
  cookieStore.set('uid', uid, {
    path: '/',
    sameSite: 'lax'
  });

  return {
    uid: uid
  };
};

export const removeSelectedSlotAction = async (input: TRemoveSelectedSlotInputSchema) => {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value || input.uid;
  
  if (uid) {
    try {
      await prisma.selectedSlots.deleteMany({ 
        where: { 
          uid: { 
            equals: uid 
          } 
        } 
      });
    } catch (error) {
      throw new Error('Erro ao remover slots selecionados');
    }
  }
  
  return;
};