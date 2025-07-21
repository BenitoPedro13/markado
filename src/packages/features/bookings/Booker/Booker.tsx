// import { AnimatePresence, LazyMotion, m } from "framer-motion";
import dynamic from 'next/dynamic';
import {useEffect, useMemo, useRef} from 'react';
// import { Toaster } from "react-hot-toast";
// import StickyBox from "react-sticky-box";
import {useShallow} from 'zustand/shallow';

// import BookingPageTagManager from "@/packages/app-store/BookingPageTagManager";
import dayjs from '@/lib/dayjs';
import {getQueryParam} from '@/packages/features/bookings/Booker/utils/query-param';
import {useNonEmptyScheduleDays} from '@/packages/features/schedules';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import {BookerLayouts} from '~/prisma/zod-utils';

// import { VerifyCodeDialog } from "../components/VerifyCodeDialog";
import {AvailableTimeSlots} from './components/AvailableTimeSlots';
// import { BookEventForm } from "./components/BookEventForm/BookEventForm";
// import { BookFormAsModal } from "./components/BookEventForm/BookFormAsModal";
import {EventMeta} from './components/EventMeta';
// import { HavingTroubleFindingTime } from "./components/HavingTroubleFindingTime";
// import { Header } from "./components/Header";
// import { InstantBooking } from "./components/InstantBooking";
// import { LargeCalendar } from "./components/LargeCalendar";
// import { OverlayCalendar } from "./components/OverlayCalendar/OverlayCalendar";
// import { RedirectToInstantMeetingModal } from "./components/RedirectToInstantMeetingModal";
import {BookerSection} from './components/Section';
// import { NotFound } from "./components/Unavailable";
// import { fadeInLeft, getBookerSizeClassNames, useBookerResizeAnimation } from "./config";
import {useBookerStore} from './store';
import type {BookerProps, WrappedBookerProps} from './types';

// const loadFramerFeatures = () => import("./framer-features").then((res) => res.default);
// const PoweredBy = dynamic(() => import("@/ee/components/PoweredBy"));
// const UnpublishedEntity = dynamic(() =>
//   import("@/ui/components/unpublished-entity/UnpublishedEntity").then((mod) => mod.UnpublishedEntity)
// );
const DatePicker = dynamic(
  () => import('./components/DatePicker').then((mod) => mod.DatePicker),
  {
    ssr: false
  }
);

// Create a wrapper component to ensure BookEventForm is properly loaded
const BookEventFormWrapper = dynamic(
  () =>
    import('./components/BookEventForm/BookEventForm').then((mod) => {
      const Component = mod.BookEventForm;
      return Component;
    }),
  {
    ssr: false,
    loading: () => <div>Carregando formulário...</div>
  }
);

const BookerComponent = ({
  username,
  eventSlug,
  hideBranding = true,
  entity,
  isInstantMeeting = false,
  onGoBackInstantMeeting,
  onConnectNowInstantMeeting,
  onOverlayClickNoCalendar,
  onClickOverlayContinue,
  onOverlaySwitchStateChange,
  sessionUsername,
  rescheduleUid,
  hasSession,
  extraOptions,
  bookings,
  verifyEmail,
  slots,
  calendars,
  bookerForm,
  event,
  bookerLayout,
  schedule,
  verifyCode,
  isPlatform = false,
  orgBannerUrl,
  customClassNames
}: BookerProps & WrappedBookerProps) => {
  const {t} = useLocale();
  const [bookerState, setBookerState] = useBookerStore(
    useShallow((state) => [state.state, state.setState])
  );
  const selectedDate = useBookerStore((state) => state.selectedDate);
  const {
    shouldShowFormInDialog,
    hasDarkBackground,
    extraDays,
    columnViewExtraDays,
    isMobile,
    layout,
    hideEventTypeDetails,
    isEmbed,
    bookerLayouts
  } = bookerLayout;

  const [seatedEventData, setSeatedEventData] = useBookerStore(
    useShallow((state) => [state.seatedEventData, state.setSeatedEventData])
  );
  const {selectedTimeslot, setSelectedTimeslot} = slots;

  // const [dayCount, setDayCount] = useBookerStore((state) => [state.dayCount, state.setDayCount], shallow);

  const slotsData = schedule?.data?.slots as any;
  const nonEmptyScheduleDays = useNonEmptyScheduleDays(slotsData).filter(
    (slot) => dayjs(selectedDate).diff(slot, 'day') <= 0
  );

  const totalWeekDays = 7;
  const addonDays =
    nonEmptyScheduleDays.length < extraDays
      ? (extraDays - nonEmptyScheduleDays.length + 1) * totalWeekDays
      : nonEmptyScheduleDays.length === extraDays
        ? totalWeekDays
        : 0;
  // Taking one more available slot(extraDays + 1) to calculate the no of days in between, that next and prev button need to shift.
  const availableSlots = nonEmptyScheduleDays.slice(0, extraDays + 1);
  if (nonEmptyScheduleDays.length !== 0)
    columnViewExtraDays.current =
      Math.abs(
        dayjs(selectedDate).diff(
          availableSlots[availableSlots.length - 2],
          'day'
        )
      ) + addonDays;

  const nextSlots =
    Math.abs(
      dayjs(selectedDate).diff(availableSlots[availableSlots.length - 1], 'day')
    ) + addonDays;

  // const animationScope = useBookerResizeAnimation(layout, bookerState);

  const timeslotsRef = useRef<HTMLDivElement>(null);
  // const StickyOnDesktop = isMobile ? "div" : StickyBox;

  const {
    bookerFormErrorRef,
    key,
    formEmail,
    bookingForm
    // , errors: formErrors
  } = bookerForm;

  const {
    handleBookEvent,
    errors,
    loadingStates,
    expiryTime,
    instantVideoMeetingUrl
  } = bookings;

  // const {
  //   isEmailVerificationModalVisible,
  //   setEmailVerificationModalVisible,
  //   handleVerifyEmail,
  //   renderConfirmNotVerifyEmailButtonCond,
  //   isVerificationCodeSending,
  // } = verifyEmail;

  const {
    overlayBusyDates,
    isOverlayCalendarEnabled,
    connectedCalendars,
    loadingConnectedCalendar,
    onToggleCalendar
  } = calendars;

  const scrolledToTimeslotsOnce = useRef(false);
  const scrollToTimeSlots = () => {
    if (isMobile && !isEmbed && !scrolledToTimeslotsOnce.current) {
      // eslint-disable-next-line @/eslint/no-scroll-into-view-embed -- Conditional within !isEmbed condition
      timeslotsRef.current?.scrollIntoView({behavior: 'smooth'});
      scrolledToTimeslotsOnce.current = true;
    }
  };

  useEffect(() => {
    if (event.isPending) return setBookerState('loading');
    console.log('event.isPending', event.isPending);
    if (!selectedDate) return setBookerState('selecting_date');
    console.log('selectedDate', selectedDate);
    if (!selectedTimeslot) return setBookerState('selecting_time');
    console.log('selectedTimeslot', selectedTimeslot);
    return setBookerState('booking');
  }, [event, selectedDate, selectedTimeslot, setBookerState]);

  const slot = getQueryParam('slot');
  useEffect(() => {
    setSelectedTimeslot(slot || null);
  }, [slot, setSelectedTimeslot]);

  const EventBooker = useMemo(() => {
    return bookerState === 'booking' ? (
      <div>
        {BookEventFormWrapper && (
          <BookEventFormWrapper
            key={key}
            onCancel={() => {
              setSelectedTimeslot(null);
              if (seatedEventData.bookingUid) {
                setSeatedEventData({
                  ...seatedEventData,
                  bookingUid: undefined,
                  attendees: undefined
                });
              }
            }}
            // onSubmit={renderConfirmNotVerifyEmailButtonCond ? handleBookEvent : handleVerifyEmail}
            onSubmit={handleBookEvent}
            errorRef={bookerFormErrorRef as React.RefObject<HTMLDivElement>}
            errors={{
              hasFormErrors: false,
              formErrors: {},
              ...errors
            }}
            loadingStates={loadingStates}
            renderConfirmNotVerifyEmailButtonCond={
              // renderConfirmNotVerifyEmailButtonCond
              true
            }
            bookingForm={bookingForm}
            eventQuery={event}
            extraOptions={extraOptions}
            rescheduleUid={rescheduleUid}
            isVerificationCodeSending={
              // isVerificationCodeSending
              false
            }
            isPlatform={isPlatform}
          >
            <>
              {/* {verifyCode && formEmail ? (
                <VerifyCodeDialog
                  isOpenDialog={isEmailVerificationModalVisible}
                  setIsOpenDialog={setEmailVerificationModalVisible}
                  email={formEmail}
                  isUserSessionRequiredToVerify={false}
                  verifyCodeWithSessionNotRequired={verifyCode.verifyCodeWithSessionNotRequired}
                  verifyCodeWithSessionRequired={verifyCode.verifyCodeWithSessionRequired}
                  error={verifyCode.error}
                  resetErrors={verifyCode.resetErrors}
                  isPending={verifyCode.isPending}
                  setIsPending={verifyCode.setIsPending}
                />
              ) : (
                <></>
              )} */}
              {/* {!isPlatform && (
                <RedirectToInstantMeetingModal
                  expiryTime={expiryTime}
                  bookingId={parseInt(getQueryParam("bookingId") || "0")}
                  instantVideoMeetingUrl={instantVideoMeetingUrl}
                  onGoBack={() => {
                    onGoBackInstantMeeting();
                  }}
                  orgName={event.data?.entity?.name}
                />
              )} */}
            </>
          </BookEventFormWrapper>
        )}
      </div>
    ) : (
      <></>
    );
  }, [
    bookerFormErrorRef,
    instantVideoMeetingUrl,
    bookerState,
    bookingForm,
    errors,
    event,
    expiryTime,
    extraOptions,
    formEmail,
    // formErrors,
    handleBookEvent,
    // handleVerifyEmail,
    // isEmailVerificationModalVisible,
    key,
    loadingStates,
    onGoBackInstantMeeting,
    // renderConfirmNotVerifyEmailButtonCond,
    rescheduleUid,
    seatedEventData,
    // setEmailVerificationModalVisible,
    setSeatedEventData,
    setSelectedTimeslot,
    // verifyCode?.error,
    // verifyCode?.isPending,
    // verifyCode?.resetErrors,
    // verifyCode?.setIsPending,
    // verifyCode?.verifyCodeWithSessionNotRequired,
    // verifyCode?.verifyCodeWithSessionRequired,
    isPlatform
  ]);

  /**
   * Unpublished organization handling - Below
   * - Reschedule links in email are of the organization event for an unpublished org, so we need to allow rescheduling unpublished event
   * - Ideally, we should allow rescheduling only for the event that has an old link(non-org link) but that's a bit complex and we are fine showing all reschedule links on unpublished organization
   */
  // const considerUnpublished = entity.considerUnpublished && !rescheduleUid;

  // if (considerUnpublished) {
  //   return <UnpublishedEntity {...entity} />;
  // }

  // if (event.isSuccess && !event.data) {
  //   return <NotFound />;
  // }

  if (bookerState === 'loading') {
    return null;
  }

  return (
    <>
      {/* {event.data && !isPlatform ? <BookingPageTagManager eventType={event.data} /> : <></>} */}

      <div
        className={classNames(
          'main',
          'max-w-[1024px] mx-auto p-6 flex flex-col items-center md:gap-0 md:max-h-[548px] md:border md:border-bg-soft-200 md:rounded-[24px]',
          layout === BookerLayouts.MONTH_VIEW
            ? 'overflow-visible'
            : 'overflow-clip'
        )}
      >
        <div
          data-testid="booker-container"
          className={classNames(
            'grid w-full items-start gap-6 grid-cols-1 md:grid-cols-8',
            // (layout === BookerLayouts.MONTH_VIEW || isEmbed) &&
            //   'border-soft-200 rounded-md',
            // !isEmbed && 'sm:transition-[width] sm:duration-300',
            // isEmbed &&
            //   layout === BookerLayouts.MONTH_VIEW &&
            //   'border-soft-200 sm:border-booker-width',
            // !isEmbed &&
            //   layout === BookerLayouts.MONTH_VIEW &&
            //   `border-soft-200 border`,
            `${customClassNames?.bookerContainer} rounded-3xl`
          )}
        >
          <div className="flex flex-col gap-3 mb-4 max-w-full col-span-2">
            <EventMeta
              classNames={{
                eventMetaContainer: classNames(
                  customClassNames?.eventMetaCustomClassNames
                    ?.eventMetaContainer,
                  'flex flex-col gap-3 mb-4 max-w-full'
                ),
                eventMetaTitle:
                  customClassNames?.eventMetaCustomClassNames?.eventMetaTitle,
                eventMetaTimezoneSelect:
                  customClassNames?.eventMetaCustomClassNames
                    ?.eventMetaTimezoneSelect
              }}
              event={event.data}
              isPending={event.isPending}
              isPlatform={isPlatform}
            />
          </div>
          {bookerState === 'booking' ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:col-span-4">
              <h3 className="text-lg font-semibold mb-4">Preencher dados</h3>
              {EventBooker}
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full items-center md:col-span-4 md:border-x md:border-x-bg-soft-200">
              <DatePicker
                classNames={{
                  datePickerContainer:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerContainer,
                  datePickerTitle:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerTitle,
                  datePickerDays:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerDays,
                  datePickerDate:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerDate,
                  datePickerDatesActive:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerDatesActive,
                  datePickerToggle:
                    customClassNames?.datePickerCustomClassNames
                      ?.datePickerToggle
                }}
                event={event}
                schedule={schedule}
                scrollToTimeSlots={scrollToTimeSlots}
              />
            </div>
          )}
          {bookerState !== 'booking' && (
            <div className="flex flex-col gap-4 w-full md:col-span-2">
              <AvailableTimeSlots
                customClassNames={
                  customClassNames?.availableTimeSlotsCustomClassNames
                }
                extraDays={extraDays}
                limitHeight={layout === BookerLayouts.MONTH_VIEW}
                schedule={schedule?.data}
                isLoading={schedule.isPending}
                seatsPerTimeSlot={event.data?.seatsPerTimeSlot}
                showAvailableSeatsCount={event.data?.seatsShowAvailabilityCount}
                event={event}
              />
            </div>
          )}
        </div>
        {/* <HavingTroubleFindingTime
          visible={bookerState !== "booking" && layout === BookerLayouts.MONTH_VIEW && !isMobile}
          dayCount={dayCount}
          isScheduleLoading={schedule.isLoading}
          onButtonClick={() => {
            setDayCount(null);
          }}
        /> */}

        {/* {bookerState !== "booking" && event.data?.showInstantEventConnectNowModal && (
          <div
            className={classNames(
              "animate-fade-in-up  z-40 my-2 opacity-0",
              layout === BookerLayouts.MONTH_VIEW && isEmbed ? "" : "fixed bottom-2"
            )}
            style={{ animationDelay: "1s" }}>
            <InstantBooking
              event={event.data}
              onConnectNow={() => {
                onConnectNowInstantMeeting();
              }}
            />
          </div>
        )} */}
        {/* {!hideBranding && !isPlatform && (
          <m.span
            key="logo"
            className={classNames(
              "mb-6 mt-auto pt-6 [&_img]:h-[15px]",
              hasDarkBackground ? "dark" : "",
              layout === BookerLayouts.MONTH_VIEW ? "block" : "hidden"
            )}>
            <PoweredBy logoOnly />
          </m.span>
        )} */}
      </div>

      {/* <BookFormAsModal
        onCancel={() => setSelectedTimeslot(null)}
        visible={bookerState === "booking" && shouldShowFormInDialog}>
        {EventBooker}
      </BookFormAsModal> */}
      {/* <Toaster position="bottom-right" /> */}
    </>
  );
};

export const Booker = (props: BookerProps & WrappedBookerProps) => {
  return (
    // <LazyMotion strict features={loadFramerFeatures}>
    <BookerComponent
      {...props}
      customClassNames={{
        atomsWrapper: '',
        datePickerCustomClassNames: {
          datePickerContainer: 'date-picker-container',
          datePickerTitle: '',
          datePickerDays: 'date-picker-days',
          datePickerDate: 'date-picker-date',
          datePickerDatesActive: '',
          datePickerToggle: 'date-picker-toggle'
        }
      }}
    />
    // </LazyMotion>
  );
};
