import { useMutation } from "@tanstack/react-query";

import { SUCCESS_STATUS } from "@/packages/platform/constants";
import type { BookingResponse } from "@/packages/platform/lib/types";
import type { ApiResponse, ApiErrorResponse, ApiSuccessResponse } from "@/packages/platform/types/api";
import type { BookingCreateBody } from "~/prisma/zod-utils";

import http from "../../lib/http";

export type UseCreateBookingInput = BookingCreateBody & { locationUrl?: string };

interface IUseCreateBooking {
  onSuccess?: (res: ApiSuccessResponse<BookingResponse>) => void;
  onError?: (err: ApiErrorResponse | Error) => void;
}
export const useCreateBooking = (
  { onSuccess, onError }: IUseCreateBooking = {
    onSuccess: () => {
      return;
    },
    onError: () => {
      return;
    },
  }
) => {
  const createBooking = useMutation<ApiResponse<BookingResponse>, Error, UseCreateBookingInput>({
    mutationFn: (data) => {
      return http.post<ApiResponse<BookingResponse>>("/bookings", data).then((res) => {
        if (res.data.status === SUCCESS_STATUS) {
          return res.data;
        }
        throw new Error(res.data.error.message);
      });
    },
    onSuccess: (data) => {
      if (data.status === SUCCESS_STATUS) {
        onSuccess?.(data);
      } else {
        onError?.(data);
      }
    },
    onError: (err) => {
      onError?.(err);
    },
  });
  return createBooking;
};
