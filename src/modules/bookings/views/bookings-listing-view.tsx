"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { WipeMyCalActionButton } from "@calcom/app-store/wipemycalother/components";
import dayjs from "@calcom/dayjs";
import { FilterToggle } from "@calcom/features/bookings/components/FilterToggle";
import { FiltersContainer } from "@calcom/features/bookings/components/FiltersContainer";
import type { filterQuerySchema } from "@calcom/features/bookings/lib/useFilterQuery";
import { useFilterQuery } from "@calcom/features/bookings/lib/useFilterQuery";
import Shell from "@calcom/features/shell/Shell";
import { useInViewObserver } from "@calcom/lib/hooks/useInViewObserver";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import type { RouterOutputs } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import type { HorizontalTabItemProps, VerticalTabItemProps } from "@calcom/ui";
import { Alert, Button, EmptyScreen, Icon, TextField, ToggleGroup } from "@calcom/ui";

import type { BookingsView } from "@lib/hooks/useBookingsView";
import useBookingsView from "@lib/hooks/useBookingsView";
import useMeQuery from "@lib/hooks/useMeQuery";

import BookingListItem from "@components/booking/BookingListItem";
import SkeletonLoader from "@components/booking/SkeletonLoader";

import "~/../styles/globals.css";
import { validStatuses } from "~/bookings/lib/validStatuses";

import BookingDetailsDrawer from "./_components/BookingDetailsDrawer";
import CustomTimeGridEvent from "./_components/CustomTimeGridEvent";

type BookingListingStatus = z.infer<NonNullable<typeof filterQuerySchema>>["status"];
type BookingOutput = RouterOutputs["viewer"]["bookings"]["get"]["bookings"][0];

type RecurringInfo = {
  recurringEventId: string | null;
  count: number;
  firstDate: Date | null;
  bookings: { [key: string]: Date[] };
};

interface AllEventsStateItem {
  id: number;
  title: string;
  start: string;
  end: string;
  booking: BookingOutput;
}

const tabs: (VerticalTabItemProps | HorizontalTabItemProps)[] = [
  {
    name: "upcoming",
    href: "/bookings/upcoming",
  },
  {
    name: "unconfirmed",
    href: "/bookings/unconfirmed",
  },
  {
    name: "recurring",
    href: "/bookings/recurring",
  },
  {
    name: "past",
    href: "/bookings/past",
  },
  {
    name: "cancelled",
    href: "/bookings/cancelled",
  },
];

const descriptionByStatus: Record<NonNullable<BookingListingStatus>, string> = {
  upcoming: "upcoming_bookings",
  recurring: "recurring_bookings",
  past: "past_bookings",
  cancelled: "cancelled_bookings",
  unconfirmed: "unconfirmed_bookings",
};

const querySchema = z.object({
  status: z.enum(validStatuses),
});

export default function Bookings() {
  const params = useParamsWithFallback();
  const { data: filterQuery } = useFilterQuery();
  const { status } = params ? querySchema.parse(params) : { status: "upcoming" as const };
  const { t } = useLocale();
  const user = useMeQuery().data;

  const router = useRouter();
  const pathname = usePathname();

  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false);

  const query = trpc.viewer.bookings.get.useInfiniteQuery(
    {
      limit: 10,
      filters: {
        ...filterQuery,
        status: filterQuery.status ?? status,
      },
    },
    {
      enabled: true,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // Animate page (tab) transitions to look smoothing

  const buttonInView = useInViewObserver(() => {
    if (!query.isFetching && query.hasNextPage && query.status === "success") {
      query.fetchNextPage();
    }
  });

  const isEmpty = !query.data?.pages[0]?.bookings.length;

  const shownBookings: Record<string, BookingOutput[]> = {};
  const filterBookings = (booking: BookingOutput) => {
    if (status === "recurring" || status == "unconfirmed" || status === "cancelled") {
      if (!booking.recurringEventId) {
        return true;
      }
      if (
        shownBookings[booking.recurringEventId] !== undefined &&
        shownBookings[booking.recurringEventId].length > 0
      ) {
        shownBookings[booking.recurringEventId].push(booking);
        return false;
      }
      shownBookings[booking.recurringEventId] = [booking];
    } else if (status === "upcoming") {
      return dayjs(booking.startTime).tz(user?.timeZone).isSameOrAfter(dayjs().tz(user?.timeZone), "day");
    }
    return true;
  };

  let recurringInfoToday: RecurringInfo | undefined;

  const bookingsToday =
    query.data?.pages.map((page) =>
      page.bookings.filter((booking: BookingOutput) => {
        recurringInfoToday = page.recurringInfo.find(
          (info) => info.recurringEventId === booking.recurringEventId
        );

        return (
          dayjs(booking.startTime).tz(user?.timeZone).format("YYYY-MM-DD") ===
          dayjs().tz(user?.timeZone).format("YYYY-MM-DD")
        );
      })
    )[0] || [];

  const [animationParentRef] = useAutoAnimate<HTMLDivElement>();

  // Booking status
  const pathSegments = pathname?.split("/").filter(Boolean);
  const lastSegment = pathSegments?.[pathSegments.length - 1] as unknown as BookingListingStatus;

  const [bookingStatus, setBookingStatus] = useState<NonNullable<BookingListingStatus>>(lastSegment!);
  const [bookingDetailsModalOpen, setBookingDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<null | BookingOutput>(null);

  // Mode switch
  const [mode, setMode] = useBookingsView();

  // Calendar view
  const [allEvents, setAllEvents] = useState<AllEventsStateItem[]>([]);

  const eventsService = useState(() => createEventsServicePlugin())[0];

  const timeFormat = user?.timeFormat || 12;

  const [count, setCount] = useState(0);

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewMonthAgenda(), createViewMonthGrid(), createViewWeek()],
    defaultView: viewWeek.name,
    weekOptions: {
      nDays: 7,
      // firstDayOfWeek: 0,
      eventWidth: 100,
      timeAxisFormatOptions: timeFormat === 24 ? { hour: "2-digit", minute: "2-digit" } : { hour: "2-digit" },
    },
    callbacks: {
      onEventClick: (event: any) => {
        setSelectedBooking(event.booking);
        setBookingDetailsModalOpen((prev) => !prev);
      },
    },
    isResponsive: false,
    locale: timeFormat === 24 ? "en-GB" : "en-US",
    events: [],
    plugins: [eventsService],
  });

  calendar.setTheme("light");

  useEffect(() => {
    if (count > 0) {
      return;
    }

    // get all events
    const data =
      query?.data?.pages?.flatMap((page) => {
        return page.bookings.filter(filterBookings).map((booking: BookingOutput) => ({
          id: booking.id,
          title: booking.title,
          start: dayjs(booking.startTime).format("YYYY-MM-DD HH:mm"),
          end: dayjs(booking.endTime).format("YYYY-MM-DD HH:mm"),
          booking,
        }));
      }) ?? [];

    if (query.status === "success" && !isEmpty) {
      setAllEvents(data);
      eventsService.set(data);

      setCount((c) => (c += 1));
      console.log(count);
    }
  }, [query.status, isEmpty, mode]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    return searchTerm === ""
      ? allEvents
      : allEvents.filter((event: any) => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allEvents]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== undefined) {
      setSearchTerm(e.target.value);
    }
  }, []);

  useEffect(() => {
    eventsService.set(filteredEvents);
  }, [filteredEvents]);

  console.log("Teste de renderização");

  return (
    <Shell
      withoutMain={false}
      hideHeadingOnMobile
      heading={t("bookings")}
      subtitle={t("bookings_description")}
      title={t("bookings")}
      description={t("bookings_description")}>
      <div className="flex flex-col">
        <div className="flex flex-row flex-wrap justify-between gap-4">
          <ToggleGroup
            className="h-9 max-w-min"
            customItemClassNames="flex-grow px-4 justify-center items-center w-min"
            isFullWidth
            defaultValue={bookingStatus}
            value={bookingStatus}
            onValueChange={(value) => {
              router.push(`/bookings/${value}`);
              setBookingStatus(value as NonNullable<BookingListingStatus>);
            }}
            options={tabs.map((tab) => {
              return {
                value: tab.name,
                label: t(tab.name),
                tooltip: t(descriptionByStatus[tab.name as NonNullable<BookingListingStatus>]),
                checkedValue: bookingStatus,
              };
            })}
          />
          {/**
           * Legacy horizontal tabs
           *
          <HorizontalTabs tabs={tabs} />
           */}
          <div className="flex gap-3">
            <TextField
              className="max-w-64 bg-white-0 !border-soft-200 mb-4 mr-auto rounded-lg !pl-0 shadow-sm focus:!ring-offset-0"
              addOnLeading={<Icon name="search" className="text-subtle h-4 w-4" />}
              addOnClassname="!border-soft-200 border-r-0"
              containerClassName="max-w-64 focus:!ring-offset-0 mb-4"
              type="search"
              value={searchTerm}
              autoComplete="false"
              onChange={handleSearchChange}
              placeholder={t("search")}
            />

            <FilterToggle setIsFiltersVisible={setIsFiltersVisible} />

            <ToggleGroup
              className="h-9 w-[68px]"
              customItemClassNames="flex-grow"
              isFullWidth
              defaultValue={mode as string}
              value={mode as string}
              onValueChange={(value) => setMode(value as BookingsView)}
              options={[
                {
                  value: "calendar",
                  tooltip: t(""),
                  iconLeft: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none">
                      <path
                        d="M13.75 3.25H16.75C16.9489 3.25 17.1397 3.32902 17.2803 3.46967C17.421 3.61032 17.5 3.80109 17.5 4V16C17.5 16.1989 17.421 16.3897 17.2803 16.5303C17.1397 16.671 16.9489 16.75 16.75 16.75H3.25C3.05109 16.75 2.86032 16.671 2.71967 16.5303C2.57902 16.3897 2.5 16.1989 2.5 16V4C2.5 3.80109 2.57902 3.61032 2.71967 3.46967C2.86032 3.32902 3.05109 3.25 3.25 3.25H6.25V1.75H7.75V3.25H12.25V1.75H13.75V3.25ZM12.25 4.75H7.75V6.25H6.25V4.75H4V7.75H16V4.75H13.75V6.25H12.25V4.75ZM16 9.25H4V15.25H16V9.25Z"
                        fill={mode === "calendar" ? "var(--cal-strong-950)" : "var(--cal-soft-400)"}
                      />
                    </svg>
                  ),
                },
                {
                  value: "list",
                  tooltip: t(""),
                  iconLeft: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none">
                      <path
                        d="M7 4H16.75V5.5H7V4ZM4.375 5.875C4.07663 5.875 3.79048 5.75647 3.5795 5.5455C3.36853 5.33452 3.25 5.04837 3.25 4.75C3.25 4.45163 3.36853 4.16548 3.5795 3.9545C3.79048 3.74353 4.07663 3.625 4.375 3.625C4.67337 3.625 4.95952 3.74353 5.1705 3.9545C5.38147 4.16548 5.5 4.45163 5.5 4.75C5.5 5.04837 5.38147 5.33452 5.1705 5.5455C4.95952 5.75647 4.67337 5.875 4.375 5.875ZM4.375 11.125C4.07663 11.125 3.79048 11.0065 3.5795 10.7955C3.36853 10.5845 3.25 10.2984 3.25 10C3.25 9.70163 3.36853 9.41548 3.5795 9.2045C3.79048 8.99353 4.07663 8.875 4.375 8.875C4.67337 8.875 4.95952 8.99353 5.1705 9.2045C5.38147 9.41548 5.5 9.70163 5.5 10C5.5 10.2984 5.38147 10.5845 5.1705 10.7955C4.95952 11.0065 4.67337 11.125 4.375 11.125ZM4.375 16.3C4.07663 16.3 3.79048 16.1815 3.5795 15.9705C3.36853 15.7595 3.25 15.4734 3.25 15.175C3.25 14.8766 3.36853 14.5905 3.5795 14.3795C3.79048 14.1685 4.07663 14.05 4.375 14.05C4.67337 14.05 4.95952 14.1685 5.1705 14.3795C5.38147 14.5905 5.5 14.8766 5.5 15.175C5.5 15.4734 5.38147 15.7595 5.1705 15.9705C4.95952 16.1815 4.67337 16.3 4.375 16.3ZM7 9.25H16.75V10.75H7V9.25ZM7 14.5H16.75V16H7V14.5Z"
                        fill={mode === "list" ? "var(--cal-strong-950)" : "var(--cal-soft-400)"}
                      />
                    </svg>
                  ),
                },
              ]}
            />
          </div>
        </div>
        <FiltersContainer isFiltersVisible={isFiltersVisible} />
        <main className="w-full">
          <div className="flex w-full flex-col" ref={animationParentRef}>
            {query.status === "error" && (
              <Alert severity="error" title={t("something_went_wrong")} message={query.error.message} />
            )}
            {(query.status === "pending" || query.isPaused) && <SkeletonLoader />}

            {query.status === "success" && !isEmpty && mode === "list" && (
              <>
                {!!bookingsToday.length && status === "upcoming" && (
                  <div className="mb-6 pt-2 xl:pt-0">
                    <WipeMyCalActionButton bookingStatus={status} bookingsEmpty={isEmpty} />
                    <p className="text-subtle mb-2 text-xs font-medium uppercase leading-4">{t("today")}</p>
                    <div className="border-subtle overflow-hidden rounded-md border">
                      <table className="w-full max-w-full table-fixed">
                        <tbody className="bg-default divide-subtle divide-y" data-testid="today-bookings">
                          <Fragment>
                            {bookingsToday.map((booking: BookingOutput) => (
                              <BookingListItem
                                key={booking.id}
                                loggedInUser={{
                                  userId: user?.id,
                                  userTimeZone: user?.timeZone,
                                  userTimeFormat: user?.timeFormat,
                                  userEmail: user?.email,
                                }}
                                listingStatus={status}
                                recurringInfo={recurringInfoToday}
                                {...booking}
                              />
                            ))}
                          </Fragment>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="pt-2 xl:pt-0">
                  <div className="border-subtle overflow-hidden rounded-md border">
                    <table data-testid={`${status}-bookings`} className="w-full max-w-full table-fixed">
                      <tbody className="bg-default divide-subtle divide-y" data-testid="bookings">
                        {query.data.pages.map((page, index) => (
                          <Fragment key={index}>
                            {page.bookings
                              .filter((booking: BookingOutput) => {
                                return !bookingsToday.some((todayBooking) => todayBooking.id === booking.id);
                              })
                              .map((booking: BookingOutput) => {
                                const recurringInfo = page.recurringInfo.find(
                                  (info) => info.recurringEventId === booking.recurringEventId
                                );
                                return (
                                  <BookingListItem
                                    key={booking.id}
                                    loggedInUser={{
                                      userId: user?.id,
                                      userTimeZone: user?.timeZone,
                                      userTimeFormat: user?.timeFormat,
                                      userEmail: user?.email,
                                    }}
                                    listingStatus={status}
                                    recurringInfo={recurringInfo}
                                    {...booking}
                                  />
                                );
                              })}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-default p-4 text-center" ref={buttonInView.ref}>
                    <Button
                      color="minimal"
                      loading={query.isFetchingNextPage}
                      disabled={!query.hasNextPage}
                      onClick={() => query.fetchNextPage()}>
                      {query.hasNextPage ? t("load_more_results") : t("no_more_results")}
                    </Button>
                  </div>
                </div>
              </>
            )}
            {query.status === "success" && !isEmpty && mode === "calendar" && (
              <>
                <ScheduleXCalendar
                  customComponents={{
                    timeGridEvent: CustomTimeGridEvent,
                  }}
                  calendarApp={calendar}
                />
              </>
            )}

            {query.status === "success" && isEmpty && (
              <div className="flex items-center justify-center pt-2 xl:pt-0">
                <EmptyScreen
                  Icon="calendar"
                  headline={t("no_status_bookings_yet", { status: t(status).toLowerCase() })}
                  description={t("no_status_bookings_yet_description", {
                    status: t(status).toLowerCase(),
                    description: t(descriptionByStatus[status]),
                  })}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <BookingDetailsDrawer
        booking={selectedBooking}
        open={bookingDetailsModalOpen}
        onOpenChange={(open) => {
          setBookingDetailsModalOpen(open);
          if (open === false) {
            setSelectedBooking(null);
          }
        }}
      />
    </Shell>
  );
}
