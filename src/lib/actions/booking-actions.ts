'use server';

import getBooking from '@/packages/features/bookings/lib/get-booking';
import { prisma } from '@/lib/prisma';

export async function getBookingByUid(uid: string) {
  try {
    if (!uid) {
      throw new Error('UID é obrigatório');
    }

    const booking = await getBooking(prisma, uid);
    
    if (!booking) {
      throw new Error('Booking não encontrado');
    }

    return booking;
  } catch (error) {
    console.error('Erro ao buscar booking:', error);
    throw error;
  }
}