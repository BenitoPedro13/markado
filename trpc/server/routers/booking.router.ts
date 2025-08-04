import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import handleCancelBooking from "@/packages/features/bookings/lib/handleCancelBooking";
import { ZGetInputSchema } from "../schemas/bookings/get.schema";
import {getHandler} from "../handlers/bookings/get.handler"

export const bookingRouter = router({
  get: publicProcedure.input(ZGetInputSchema).query(async ({ input, ctx }) => {
    // if (!UNSTABLE_HANDLER_CACHE.get) {
      // UNSTABLE_HANDLER_CACHE.get = await import("./get.handler").then((mod) => mod.getHandler);
    // }

    // Unreachable code but required for type safety
    // if (!UNSTABLE_HANDLER_CACHE.get) {
    //   throw new Error("Failed to load handler");
    // }

    // return UNSTABLE_HANDLER_CACHE.get({
    //   ctx,
    //   input,
    // });

    return getHandler({input})
  }),
  
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