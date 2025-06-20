import { ErrorCode } from "@/packages/lib/errorCodes";
import {HttpError} from '@/packages/lib/http-error';
import { BookingStatus } from "~/prisma/enums";

import { type OriginalRescheduledBooking } from "./getOriginalRescheduledBooking";

export const validateOriginalRescheduledBooking = async (
  originalRescheduledBooking: OriginalRescheduledBooking
) => {
  if (!originalRescheduledBooking) {
    throw new HttpError({ statusCode: 404, message: "Could not find original booking" });
  }

  if (
    originalRescheduledBooking.status === BookingStatus.CANCELLED &&
    !originalRescheduledBooking.rescheduled
  ) {
    throw new HttpError({ statusCode: 403, message: ErrorCode.CancelledBookingsCannotBeRescheduled });
  }
};
