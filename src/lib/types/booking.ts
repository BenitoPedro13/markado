export type BookingResponse = Awaited<
  ReturnType<typeof import("@/packages/features/bookings/lib/handleNewBooking").default>
>;
