"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// import dayjs from "@calcom/dayjs";
// // TODO: Use browser locale, implement Intl in Dayjs maybe?
// import "@calcom/dayjs/locales";
// import { getPlaceholderAvatar } from "@calcom/lib/defaultAvatarImage";
// import { useCompatSearchParams } from "@calcom/lib/hooks/useCompatSearchParams";
// import { useLocale } from "@calcom/lib/hooks/useLocale";
// import type { RouterOutputs } from "@calcom/trpc/react";
// import { useMeQuery } from "@calcom/trpc/react/hooks/useMeQuery";
// import { Avatar } from "@calcom/ui";

// import { Sheet, SheetContent } from "~/components/ui/sheet";

interface BookingDetailsDrawerProps {
  booking: RouterOutputs["viewer"]["bookings"]["get"]["bookings"][0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookinsDetailsDrawer = ({ booking, open, onOpenChange }: BookingDetailsDrawerProps) => {
  const { t, i18n } = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useCompatSearchParams();
  const user = useMeQuery();

  const userAvatar = getPlaceholderAvatar(user?.data?.avatar, user?.data?.name ?? t("nameless_user"));

  const attendeesAvatars = booking?.attendees?.map((attendee) => {
    const url = getPlaceholderAvatar(null, attendee?.name ?? t("nameless_user"), "681219", "FFC0C5");

    console.log(attendee, url);

    return url;
  });

  console.log(booking);

  if (booking === null) {
    return null;
  }

  function setIsCancellationMode(value: boolean) {
    const _searchParams = new URLSearchParams(searchParams ?? undefined);

    if (value) {
      _searchParams.set("cancel", "true");
    } else {
      if (_searchParams.get("cancel")) {
        _searchParams.delete("cancel");
      }
    }

    router.replace(`${pathname}?${_searchParams.toString()}`);
  }

  return (
    <Sheet open={open} onOpenChange={(open) => onOpenChange(open)}>
      <SheetContent>
        <div className="bg-white-0 inline-flex w-full flex-col items-start justify-start overflow-hidden">
          <div className="bg-white-0 inline-flex w-full items-center justify-start gap-3 overflow-hidden p-5">
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
              <div className="inline-flex items-center justify-start gap-2 self-stretch">
                <div className="text-strong-950 font-jakarta text-lg font-medium leading-normal">
                  {t("modal_booking_details")}
                </div>
              </div>
            </div>
            <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-strong-950 absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9.99956 8.93906L13.7121 5.22656L14.7726 6.28706L11.0601 9.99956L14.7726 13.7121L13.7121 14.7726L9.99956 11.0601L6.28706 14.7726L5.22656 13.7121L8.93906 9.99956L5.22656 6.28706L6.28706 5.22656L9.99956 8.93906Z"
                  fill="var(--cal-sub-600)"
                />
              </svg>
              <span className="sr-only">{t("close")}</span>
            </SheetPrimitive.Close>
          </div>
          <div className="bg-weak-50 inline-flex items-center justify-center gap-1.5 self-stretch px-5 py-1.5">
            <div className="text-soft-400 font-jakarta shrink grow basis-0 text-xs font-medium uppercase leading-none tracking-wide">
              {t("date_and_hour")}
            </div>
          </div>
          <div className="bg-white-0 flex flex-col items-start justify-center gap-1 self-stretch overflow-hidden p-5">
            <div className="text-strong-950 font-jakarta self-stretch text-3xl font-medium leading-10">
              {t("time_until_time", {
                start: dayjs(booking.startTime).format("HH:mm"),
                end: dayjs(booking.endTime).format("HH:mm"),
              })}
            </div>
            <div className="text-strong-950 font-jakarta self-stretch text-sm font-medium leading-tight">
              {t("modal_date", {
                date: dayjs(booking.startTime).locale(i18n.language).format("DD"),
                month: dayjs(booking.startTime).locale(i18n.language).format("MMMM"),
                year: dayjs(booking.startTime).locale(i18n.language).format("YYYY"),
              })}
            </div>
          </div>
        </div>
        <div className="bg-weak-50 inline-flex w-full items-center justify-center gap-1.5 self-stretch px-5 py-1.5">
          <div className="text-soft-400 font-jakarta shrink grow basis-0 text-xs font-medium uppercase leading-none tracking-wide">
            {t("employer")}
          </div>
        </div>
        <div className="bg-white-0 inline-flex w-full items-center justify-start gap-4 self-stretch overflow-hidden p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
            <Avatar alt="Avatar" imageSrc={userAvatar} size="lg" />
          </div>
          {booking.user && (
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
              <div className="text-strong-950 font-jakarta self-stretch text-lg font-medium leading-normal">
                {booking.user.name ?? ""}
              </div>
              <div className="text-sub-600 font-jakarta self-stretch text-sm font-normal leading-tight">
                {booking.user.email ?? ""}
              </div>
            </div>
          )}
        </div>
        <div className="bg-weak-50 inline-flex w-full items-center justify-center gap-1.5 self-stretch px-5 py-1.5">
          <div className="text-soft-400 font-jakarta shrink grow basis-0 text-xs font-medium uppercase leading-none tracking-wide">
            {t("modal_guest")}
          </div>
        </div>
        <div className="bg-white-0 inline-flex w-full items-center justify-start gap-4 self-stretch overflow-hidden p-5">
          {attendeesAvatars?.map((avatar, index) => (
            <div
              key={index}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200 py-3">
              <Avatar alt="Avatar" imageSrc={avatar} size="lg" />
            </div>
          ))}

          {booking.responses && typeof booking.responses === "object" && (
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
              {booking.responses && (
                <div className="text-strong-950 font-jakarta self-stretch text-lg font-medium leading-normal">
                  {(booking.responses as unknown as { name?: string; email?: string })?.name ??
                    t("nameless_user")}
                </div>
              )}

              {booking.responses && (
                <div className="text-sub-600 font-jakarta self-stretch text-sm font-normal leading-tight">
                  {(booking.responses as unknown as { name?: string; email?: string })?.email ??
                    t("user_without_email")}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-weak-50 inline-flex w-full items-center justify-center gap-1.5 self-stretch px-5 py-1.5">
          <div className="text-soft-400 font-jakarta shrink grow basis-0 text-xs font-medium uppercase leading-none tracking-wide">
            {t("details")}
          </div>
        </div>
        <div className="bg-white-0 flex w-full  flex-col items-start justify-start gap-3 self-stretch overflow-hidden p-5">
          <div className="flex flex-col items-start justify-center gap-1 self-stretch">
            <div className="text-soft-400 font-jakarta self-stretch text-xs font-medium uppercase leading-none tracking-wide">
              {t("subject")}
            </div>
            <div className="text-strong-950 font-jakarta self-stretch text-sm font-medium leading-tight">
              {booking.eventType.title}
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2 self-stretch">
            <div className="bg-soft-200 h-px shrink grow basis-0" />
          </div>
          <div className="flex flex-col items-start justify-center gap-1 self-stretch">
            <div className="text-soft-400 font-jakarta self-stretch text-xs font-medium uppercase leading-none tracking-wide">
              {t("local")}
            </div>
            <div className="text-strong-950 font-jakarta self-stretch text-sm font-medium leading-tight">
              Google Meet
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2 self-stretch">
            <div className="bg-soft-200 h-px shrink grow basis-0" />
          </div>
          <div className="flex  flex-col items-start justify-center gap-1 self-stretch">
            <div className="text-soft-400 font-jakarta self-stretch text-xs font-medium uppercase leading-none tracking-wide">
              {t("description")}
            </div>
            <div className="text-strong-950 font-jakarta self-stretch text-sm font-medium leading-tight">
              {booking.description ? booking.description : t("an_email_with_details_has_been_sent")}
            </div>
          </div>
        </div>
        <div className="flex w-full shrink grow basis-0 flex-col items-center justify-end self-stretch">
          <div className="bg-bg-weak-50 inline-flex items-center justify-center gap-1.5 self-stretch px-5 py-1.5">
            <div className="text-soft-400 font-jakarta shrink grow basis-0 text-xs font-medium uppercase leading-none tracking-wide">
              {t("needs_changing")}
            </div>
          </div>

          <div className="border-soft-200 inline-flex w-96 items-center justify-start gap-4 overflow-hidden border-t bg-white p-5">
            {booking.user && (
              <div className="flex shrink grow basis-0 items-center justify-center gap-4">
                <button
                  data-testid="cancel"
                  onClick={() => setIsCancellationMode(true)}
                  className="flex shrink grow basis-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-red-600 bg-white p-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none">
                    <path
                      d="M9.99956 8.93906L13.7121 5.22656L14.7726 6.28706L11.0601 9.99956L14.7726 13.7121L13.7121 14.7726L9.99956 11.0601L6.28706 14.7726L5.22656 13.7121L8.93906 9.99956L5.22656 6.28706L6.28706 5.22656L9.99956 8.93906Z"
                      fill="#FB3748"
                    />
                  </svg>
                  <div className="font-jakarta flex items-center justify-center px-1 text-sm font-medium leading-tight text-[#FB3748]">
                    {t("cancel")}
                  </div>
                </button>
                <button className="border-soft-200 flex shrink grow basis-0 items-center justify-center gap-1 overflow-hidden rounded-lg border bg-white p-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none">
                    <path
                      d="M7.375 4.375V3.125H8.625V4.375H12.375V3.125H13.625V4.375H16.125C16.4702 4.375 16.75 4.65482 16.75 5V8.125H15.5V5.625H13.625V6.875H12.375V5.625H8.625V6.875H7.375V5.625H5.5V14.375H9.25V15.625H4.875C4.52982 15.625 4.25 15.3452 4.25 15V5C4.25 4.65482 4.52982 4.375 4.875 4.375H7.375ZM13.625 10C12.2443 10 11.125 11.1193 11.125 12.5C11.125 13.8807 12.2443 15 13.625 15C15.0057 15 16.125 13.8807 16.125 12.5C16.125 11.1193 15.0057 10 13.625 10ZM9.875 12.5C9.875 10.4289 11.5539 8.75 13.625 8.75C15.6961 8.75 17.375 10.4289 17.375 12.5C17.375 14.5711 15.6961 16.25 13.625 16.25C11.5539 16.25 9.875 14.5711 9.875 12.5ZM13 10.625V12.7589L14.4331 14.1919L15.3169 13.3081L14.25 12.2411V10.625H13Z"
                      fill="var(--cal-sub-600)"
                    />
                  </svg>
                  <div className="flex items-center justify-center px-1">
                    <span
                      className="text-sub-600 font-jakarta text-sm font-medium leading-tight"
                      data-testid="reschedule-link">
                      <Link
                        href={`/reschedule/${booking?.uid}${
                          booking.user?.email
                            ? `?rescheduledBy=${encodeURIComponent(booking.user?.email)}`
                            : ""
                        }`}
                        legacyBehavior>
                        {t("reschedule")}
                      </Link>
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookinsDetailsDrawer;
