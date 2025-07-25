import { SetStateAction, useCallback, useState } from "react";

import { useLocale } from "@/hooks/use-locale";
import type { RecurringEvent } from "@/types/Calendar";
import * as Button from "@/components/align-ui/ui/button";
import * as TextArea from "@/components/align-ui/ui/textarea";
import { RiCloseLine, RiInformationLine } from "@remixicon/react";
import { useTRPCClient } from "@/utils/trpc";

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
  const trpc = useTRPCClient();
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
          <label className="text-default font-medium pb-5">{t("cancellation_reason")}</label>
          <div className="pt-2">
            <TextArea.Root
              id={cancellationReason}
              data-testid="cancel_reason"
              ref={cancelBookingRef}
              placeholder={t("cancellation_reason_placeholder")}
              value={cancellationReason}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCancellationReason(e.target.value)}
              className="w-full"
              rows={2}
            >
            <TextArea.CharCounter
              current={cancellationReason.length}
              max={2000}
              className="text-text-sub-600 text-muted-foreground"
            />
            </TextArea.Root>
          </div>
          <div className="flex gap-2 pt-5">
            <RiInformationLine className="h-4 w-4" />
            <span className="text-text-sub-600 text-paragraph-xs text-muted-foreground">
              {t("cancel_feedback_description")}
            </span>
          </div>
          <div className="flex flex-col-reverse rtl:space-x-reverse ">
            <div className="pt-5 w-full space-x-4">
            <Button.Root
                variant="neutral"
                mode="stroke"
                className="ml-auto"
                onClick={() => props.setIsCancellationMode(false)}
                disabled={cancellationReason.length > 0}
            >
                {t("nevermind")}
              </Button.Root>
              <Button.Root
                variant="error"
                mode="stroke"
                data-testid="confirm_cancel"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await trpc.booking.cancelBooking.mutate({
                      uid: booking?.uid!,
                      cancellationReason,
                      allRemainingBookings,
                      seatReferenceUid,
                      cancelledBy: currentUserEmail,
                    });
                    window.location.reload();
                  } catch (err) {
                    setLoading(false);
                    setError(
                      `${t("error_with_status_code_occured", { status: "TRPC" })} ${t("please_try_again")}`
                    );
                  }
                }}
                disabled={cancellationReason.length === 0 || loading}
              >
                {props.allRemainingBookings ? t("cancel_all_remaining") : t("cancel_event")}
              </Button.Root>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
