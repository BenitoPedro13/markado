// import { m } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

// import { Timezone as PlatformTimezoneSelect } from "@/atoms/monorepo";
// import { useEmbedUiConfig, useIsEmbed } from "@/embed-core/embed-iframe";
import { EventDetails, EventMembers, EventMetaSkeleton, EventTitle } from "@/packages/features/bookings";
import { SeatsAvailabilityText } from "@/packages/features/bookings/components/SeatsAvailabilityText";
import { EventMetaBlock } from "@/packages/features/bookings/components/event-meta/Details";
import { useTimePreferences } from "@/packages/features/bookings/lib";
import type { BookerEvent } from "@/packages/features/bookings/types";
import { useLocaleI18 } from "@/hooks/use-locale";

// import { fadeInUp } from "../config";
import { useBookerStore } from "../store";
import { FromToTime } from "../utils/dates";

// const WebTimezoneSelect = dynamic(
//   () => import("@/components/form/timezone-select/TimezoneSelect").then((mod) => mod.TimezoneSelect),
//   {
//     ssr: false,
//   }
// );

export const EventMeta = ({
  event,
  isPending,
  isPlatform = false,
  classNames,
}: {
  event?: Pick<
    BookerEvent,
    | "lockTimeZoneToggleOnBookingPage"
    | "schedule"
    | "seatsPerTimeSlot"
    | "users"
    | "length"
    | "schedulingType"
    | "profile"
    | "entity"
    | "description"
    | "title"
    | "metadata"
    | "locations"
    | "currency"
    | "requiresConfirmation"
    | "recurringEvent"
    | "price"
    | "isDynamic"
  > | null;
  isPending: boolean;
  isPlatform?: boolean;
  classNames?: {
    eventMetaContainer?: string;
    eventMetaTitle?: string;
    eventMetaTimezoneSelect?: string;
  };
}) => {
  const {setTimezone, timeFormat, timezone} = useTimePreferences();
  const selectedDuration = useBookerStore((state) => state.selectedDuration);
  const selectedTimeslot = useBookerStore((state) => state.selectedTimeslot);
  const bookerState = useBookerStore((state) => state.state);
  const bookingData = useBookerStore((state) => state.bookingData);
  const rescheduleUid = useBookerStore((state) => state.rescheduleUid);
  const [seatedEventData, setSeatedEventData] = useBookerStore(
    useShallow((state) => [state.seatedEventData, state.setSeatedEventData])
  );
  const {i18n, t} = useLocaleI18();
  // const embedUiConfig = useEmbedUiConfig();
  // const isEmbed = useIsEmbed();
  // const hideEventTypeDetails = isEmbed ? embedUiConfig.hideEventTypeDetails : false;
  const hideEventTypeDetails = false;

  // const TimezoneSelect = WebTimezoneSelect;

  useEffect(() => {
    //In case the event has lockTimeZone enabled ,set the timezone to event's attached availability timezone
    if (
      event &&
      event?.lockTimeZoneToggleOnBookingPage &&
      event?.schedule?.timeZone
    ) {
      setTimezone(event.schedule?.timeZone);
    }
  }, [event, setTimezone]);

  if (hideEventTypeDetails) {
    return null;
  }
  // If we didn't pick a time slot yet, we load bookingData via SSR so bookingData should be set
  // Otherwise we load seatedEventData from useBookerStore
  const bookingSeatAttendeesQty =
    seatedEventData?.attendees || bookingData?.attendees.length;
  const eventTotalSeats =
    seatedEventData?.seatsPerTimeSlot || event?.seatsPerTimeSlot;

  const isHalfFull =
    bookingSeatAttendeesQty &&
    eventTotalSeats &&
    bookingSeatAttendeesQty / eventTotalSeats >= 0.5;
  const isNearlyFull =
    bookingSeatAttendeesQty &&
    eventTotalSeats &&
    bookingSeatAttendeesQty / eventTotalSeats >= 0.83;

  const colorClass = isNearlyFull
    ? 'text-rose-600'
    : isHalfFull
      ? 'text-yellow-500'
      : 'text-bookinghighlight';

  return (
    <div
      className={`${classNames?.eventMetaContainer || ''} relative z-10 md:px-6`}
      data-testid="event-meta"
    >
      {isPending && (
        <div
          // {...fadeInUp}
          // initial="visible"
          // layout
        >
          <EventMetaSkeleton />
        </div>
      )}
      {!isPending && !!event && (
        <div
          // {...fadeInUp}
          // layout
          // transition={{ ...fadeInUp.transition, delay: 0.3 }}
          className="flex flex-col gap-5"
        >
          {!isPlatform && (
            <EventMembers
              schedulingType={event.schedulingType}
              users={event.users}
              profile={event.profile}
              entity={event.entity}
            />
          )}
          <div className="flex flex-col gap-2.5">
            <EventTitle className={`${classNames?.eventMetaTitle}`}>
              {event?.title}
            </EventTitle>
            {event.description && (
              <EventMetaBlock contentClassName="mb-8 break-words max-w-full max-h-[180px] scroll-bar pr-4">
                <div dangerouslySetInnerHTML={{__html: event.description}} />
              </EventMetaBlock>
            )}
            <div className="flex flex-col gap-2.5 font-medium rtl:-mr-2">
              {rescheduleUid && bookingData && (
                <EventMetaBlock icon="calendar">
                  {t('former_time')}
                  <br />
                  <span className="line-through" data-testid="former_time_p">
                    <FromToTime
                      date={bookingData.startTime.toString()}
                      duration={null}
                      timeFormat={timeFormat}
                      timeZone={timezone}
                      language={i18n.language}
                    />
                  </span>
                </EventMetaBlock>
              )}
              {selectedTimeslot && (
                <EventMetaBlock icon="calendar">
                  <FromToTime
                    date={selectedTimeslot}
                    duration={selectedDuration || event.length}
                    timeFormat={timeFormat}
                    timeZone={timezone}
                    language={i18n.language}
                  />
                </EventMetaBlock>
              )}
              <EventDetails event={event} />
              <EventMetaBlock
                className="text-strong-950 cursor-pointer [&_.current-timezone:before]:focus-within:opacity-100 [&_.current-timezone:before]:hover:opacity-100"
                contentClassName="relative max-w-[90%]"
                icon="globe"
              >
                {bookerState === 'booking' ? (
                  <>{timezone}</>
                ) : (
                  <span
                    className={`current-timezone before:bg-subtle min-w-32 -mt-[2px] flex h-6 max-w-full items-center justify-start before:absolute before:inset-0 before:bottom-[-3px] before:left-[-30px] before:top-[-3px] before:w-[calc(100%_+_35px)] before:rounded-md before:py-3 before:opacity-0 before:transition-opacity ${
                      event.lockTimeZoneToggleOnBookingPage
                        ? 'cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {/* <TimezoneSelect
                      menuPosition="absolute"
                      timezoneSelectCustomClassname={
                        classNames?.eventMetaTimezoneSelect
                      }
                      classNames={{
                        control: () =>
                          '!min-h-0 p-0 w-full border-0 bg-transparent focus-within:ring-0',
                        menu: () => 'text-sub-600 !w-64 max-w-[90vw] mb-1 ',
                        singleValue: () => 'text-sub-600 py-1',
                        indicatorsContainer: () => 'text-sub-600 ml-auto',
                        container: () => 'max-w-full'
                      }}
                      value={timezone}
                      onChange={(tz) => setTimezone(tz.value)}
                      isDisabled={event.lockTimeZoneToggleOnBookingPage}
                    /> */}
                  </span>
                )}
              </EventMetaBlock>
              {bookerState === 'booking' &&
              eventTotalSeats &&
              bookingSeatAttendeesQty ? (
                <EventMetaBlock icon="user" className={`${colorClass}`}>
                  <div className="text-bookinghighlight flex items-start text-sm">
                    <p>
                      <SeatsAvailabilityText
                        showExact={!!seatedEventData.showAvailableSeatsCount}
                        totalSeats={eventTotalSeats}
                        bookedSeats={bookingSeatAttendeesQty || 0}
                        variant="fraction"
                      />
                    </p>
                  </div>
                </EventMetaBlock>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
