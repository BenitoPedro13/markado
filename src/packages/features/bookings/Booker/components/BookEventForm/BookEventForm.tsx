import type { TFunction } from "next-i18next";
import { useMemo, useState } from "react";
import type { FieldError } from "react-hook-form";

import type { BookerEvent } from "@/packages/features/bookings/types";
import getPaymentAppData from "@/packages/lib/getPaymentAppData";
import { useLocale } from "@/hooks/use-locale";
import * as Alert from "@/components/align-ui/ui/alert";
import * as Button from "@/components/align-ui/ui/button";
import { EmptyScreen } from "@/components/align-ui/ui/empty-screen";
import { Form } from "@/packages/ui";
// EmptyScreen, Form
import { useBookerStore } from "../../store";
import type { UseBookingFormReturnType } from "../hooks/useBookingForm";
import type { IUseBookingErrors, IUseBookingLoadingStates } from "../hooks/useBookings";
import { BookingFields } from "./BookingFields";
import { FormSkeleton } from "./Skeleton";

type BookEventFormProps = {
  onCancel?: () => void;
  onSubmit: () => void;
  errorRef: React.RefObject<HTMLDivElement>;
  errors: UseBookingFormReturnType["errors"] & IUseBookingErrors;
  loadingStates: IUseBookingLoadingStates;
  children?: React.ReactNode;
  bookingForm: UseBookingFormReturnType["bookingForm"];
  renderConfirmNotVerifyEmailButtonCond: boolean;
  extraOptions: Record<string, string | string[]>;
  isPlatform?: boolean;
  isVerificationCodeSending: boolean;
};

export const BookEventForm = ({
  onCancel,
  eventQuery,
  rescheduleUid,
  onSubmit,
  errorRef,
  errors,
  loadingStates,
  renderConfirmNotVerifyEmailButtonCond,
  bookingForm,
  children,
  extraOptions,
  isVerificationCodeSending,
  isPlatform = false,
}: Omit<BookEventFormProps, "event"> & {
  eventQuery: {
    isError: boolean;
    isPending: boolean;
    data?: Pick<BookerEvent, "price" | "currency" | "metadata" | "bookingFields" | "locations"> | null;
  };
  rescheduleUid: string | null;
}) => {
  const eventType = eventQuery.data;
  const setFormValues = useBookerStore((state) => state.setFormValues);
  const bookingData = useBookerStore((state) => state.bookingData);
  const timeslot = useBookerStore((state) => state.selectedTimeslot);
  const username = useBookerStore((state) => state.username);
  const isInstantMeeting = useBookerStore((state) => state.isInstantMeeting);

  const [responseVercelIdHeader] = useState<string | null>(null);
  const { t } = useLocale();

  const isPaidEvent = useMemo(() => {
    if (!eventType?.price) return false;
    const paymentAppData = getPaymentAppData(eventType);
    return eventType?.price > 0 && !Number.isNaN(paymentAppData.price) && paymentAppData.price > 0;
  }, [eventType]);

  if (eventQuery.isError) return <Alert.Root status="warning">{t("error_booking_event")}</Alert.Root>;
  if (eventQuery.isPending || !eventQuery.data) return <FormSkeleton />;
  if (!timeslot)
    return (
      <EmptyScreen
        headline={t("timeslot_missing_title")}
        description={t("timeslot_missing_description")}
        Icon="calendar"
        buttonText={t("timeslot_missing_cta")}
        buttonOnClick={onCancel}
      />
    );

  if (!eventType) {
    console.warn("No event type found for event", extraOptions);
    return <Alert.Root status="warning">{t("error_booking_event")}</Alert.Root>;
  }

  return (
    <div className="flex h-full flex-col">
      <Form
        className="flex h-full flex-col"
        onChange={() => {
          // Form data is saved in store. This way when user navigates back to
          // still change the timeslot, and comes back to the form, all their values
          // still exist. This gets cleared when the form is submitted.
          const values = bookingForm.getValues();
          setFormValues(values);
        }}
        form={bookingForm}
        handleSubmit={onSubmit}
        noValidate>
        <BookingFields
          isDynamicGroupBooking={!!(username && username.indexOf("+") > -1)}
          fields={eventType.bookingFields}
          locations={eventType.locations}
          rescheduleUid={rescheduleUid || undefined}
          bookingData={bookingData}
        />
        {(errors.hasFormErrors || errors.hasDataErrors) && (
          <div data-testid="booking-fail">
            <Alert.Root
              ref={errorRef}
              className="my-2"
              status="information"
              title={rescheduleUid ? t("reschedule_fail") : t("booking_fail")}
            >
              {getError(
                Object.values(errors.formErrors)[0] as FieldError | undefined,
                errors.dataErrors,
                t,
                responseVercelIdHeader
              )}
            </Alert.Root>
          </div>
        )}

        <div className="modalsticky mt-auto flex justify-end space-x-2 rtl:space-x-reverse">
          {isInstantMeeting ? (
            <Button.Root type="submit" color="primary" disabled={loadingStates.creatingInstantBooking}>
              {loadingStates.creatingInstantBooking
                ? t("loading")
                : isPaidEvent
                ? t("pay_and_book")
                : t("confirm")}
            </Button.Root>
          ) : (
            <>
              {!!onCancel && (
                <Button.Root color="minimal" type="button" onClick={onCancel} data-testid="back">
                  {t("back")}
                </Button.Root>
              )}
              <Button.Root
                type="submit"
                color="primary"
                disabled={
                  loadingStates.creatingBooking ||
                  loadingStates.creatingRecurringBooking ||
                  isVerificationCodeSending
                }
                data-testid={
                  rescheduleUid && bookingData ? "confirm-reschedule-button" : "confirm-book-button"
                }>
                {(loadingStates.creatingBooking ||
                  loadingStates.creatingRecurringBooking ||
                  isVerificationCodeSending)
                  ? t("loading")
                  : rescheduleUid && bookingData
                  ? t("reschedule")
                  : renderConfirmNotVerifyEmailButtonCond
                  ? isPaidEvent
                    ? t("pay_and_book")
                    : t("confirm")
                  : t("verify_email_email_button")}
              </Button.Root>
            </>
          )}
        </div>
      </Form>
      {children}
    </div>
  );
};

const getError = (
  globalError: FieldError | undefined,
  // It feels like an implementation detail to reimplement the types of useMutation here.
  // Since they don't matter for this function, I'd rather disable them then giving you
  // the cognitive overload of thinking to update them here when anything changes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataError: any,
  t: ReturnType<typeof useLocale>["t"],
  responseVercelIdHeader: string | null
) => {
  if (globalError) return globalError?.message;

  const error = dataError;

  return error?.message ? (
    <>
      {responseVercelIdHeader ?? ""} {t(error.message)}
    </>
  ) : (
    <>{t("can_you_try_again")}</>
  );
};
