import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import handleCancelBooking from "@/packages/features/bookings/lib/handleCancelBooking";

export const bookingRouter = router({
  cancelBooking: publicProcedure
    .input(z.object({
      uid: z.string(),
      cancellationReason: z.string().optional(),
      allRemainingBookings: z.boolean().optional(),
      seatReferenceUid: z.string().optional(),
      cancelledBy: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const req = {
        body: input,
        userId: ctx.session?.user?.id,
        method: "POST",
        url: "",
        headers: {},
      } as any;
      return handleCancelBooking(req);
    }),
}); 