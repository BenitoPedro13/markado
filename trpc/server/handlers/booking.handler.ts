'use server';

import {Booking, bookings} from '@/data/bookings';
import {revalidatePath} from 'next/cache';

export async function getAllBookings() {
  if (!bookings) {
    throw new Error('Error fetching bookings');
  }

  return bookings;
}

export async function getBookingById(id: Booking['id']) {
  const booking = bookings.find((booking) => booking.id === id);

  if (!booking) {
    throw new Error('Booking not found');
  }

  return booking;
}

export async function getBookingsByStatus(status: Booking['status']) {
  const filteredBookings = bookings.filter(
    (booking) => booking.status === status
  );

  return filteredBookings;
}

export async function updateBookingStatus(
  id: Booking['id'],
  status: Booking['status']
) {
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  bookings[bookingIndex].status = status;

  revalidatePath('/bookings', 'layout');

  return bookings[bookingIndex];
}

export async function updateBookingType(
  id: Booking['id'],
  type: Booking['type']
) {
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  bookings[bookingIndex].type = type;

  revalidatePath('/bookings', 'layout');

  return bookings[bookingIndex];
}

export async function createBooking(booking: Omit<Booking, 'id' | 'status'>) {
  const newBooking: Booking = {
    ...booking,
    id: (bookings.length + 1).toString(),
    status: 'confirmed'
  };

  bookings.push(newBooking);

  revalidatePath('/bookings', 'layout');

  return newBooking;
}
