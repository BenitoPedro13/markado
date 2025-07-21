import { SetStateAction, useCallback, useState } from "react";

import { useLocale } from "@/hooks/use-locale";
import type { RecurringEvent } from "@/types/Calendar";
import * as Button from "@/components/align-ui/ui/button";
import * as TextArea from "@/components/align-ui/ui/textarea";
import { RiCloseLine } from "@remixicon/react";

type Props = {
  booking: {
    title?: string;
    uid?: string;
    id?: number;
  };
  profile: {
    name: string | null;
    slug: string | null;
  };
  recurringEvent: RecurringEvent | null;
  team?: string | null;
  setIsCancellationMode: (value: boolean) => void;
  theme: string | null;
  allRemainingBookings: boolean;
  seatReferenceUid?: string;
  currentUserEmail?: string;
  bookingCancelledEventProps: {
    booking: unknown;
    organizer: {
      name: string;
      email: string;
      timeZone?: string;
    };
    eventType: unknown;
  };
};

export default function CancelBooking(props: Props) {
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const { t } = useLocale();
  const { booking, allRemainingBookings, seatReferenceUid, bookingCancelledEventProps, currentUserEmail } =
    props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(booking ? null : t("booking_already_cancelled"));

  const cancelBookingRef = useCallback((node: HTMLTextAreaElement) => {
    if (node !== null) {
      // eslint-disable-next-line @/packages/eslint/no-scroll-into-view-embed -- CancelBooking is not usually used in embed mode
      node.scrollIntoView({ behavior: "smooth" });
      node.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {error && (
        <div className="mt-8">
          <div className="bg-error mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <RiCloseLine className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-emphasis text-lg font-medium leading-6" id="modal-title">
              {error}
            </h3>
          </div>
        </div>
      )}
      {!error && (
        <div className="mt-5 sm:mt-6">
          <label className="text-default font-medium">{t("cancellation_reason")}</label>
          <TextArea.Root
            data-testid="cancel_reason"
            ref={cancelBookingRef}
            placeholder={t("cancellation_reason_placeholder")}
            value={cancellationReason}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCancellationReason(e.target.value)}
            className="mb-4 mt-2 w-full "
            rows={3}
          />
          <div className="flex flex-col-reverse rtl:space-x-reverse ">
            <div className="ml-auto flex w-full space-x-4 ">
              <Button.Root
                className="ml-auto"
                variant="neutral"
                onClick={() => props.setIsCancellationMode(false)}>
                {t("nevermind")}
              </Button.Root>
              <Button.Root
                data-testid="confirm_cancel"
                onClick={async () => {
                  setLoading(true);

                  const res = await fetch("/api/cancel", {
                    body: JSON.stringify({
                      uid: booking?.uid,
                      cancellationReason: cancellationReason,
                      allRemainingBookings,
                      // @NOTE: very important this shouldn't cancel with number ID use uid instead
                      seatReferenceUid,
                      cancelledBy: currentUserEmail,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                  });

                  const bookingWithCancellationReason = {
                    ...(bookingCancelledEventProps.booking as object),
                    cancellationReason,
                  } as unknown;

                  if (res.status >= 200 && res.status < 300) {
                    // tested by apps/web/playwright/booking-pages.e2e.ts
                    window.location.reload();
                  } else {
                    setLoading(false);
                    setError(
                      `${t("error_with_status_code_occured", { status: res.status })} ${t(
                        "please_try_again"
                      )}`
                    );
                  }
                }}
                disabled={loading}>
                {props.allRemainingBookings ? t("cancel_all_remaining") : t("cancel_event")}
              </Button.Root>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
