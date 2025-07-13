import { usePathname } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from 'react';

import { useSchedule } from "@/packages/features/schedules";
//import { useCompatSearchParams } from "@/packages/lib/hooks/useCompatSearchParam";
import { trpc } from '~/trpc/client';

import { useTimePreferences } from "@/packages/features/bookings/lib/timePreferences";
import { useBookerStore } from "../store";

export type useEventReturnType = ReturnType<typeof useEvent>;
export type useScheduleForEventReturnType = ReturnType<typeof useScheduleForEvent>;

/**
 * Wrapper hook around the trpc query that fetches
 * the event currently viewed in the booker. It will get
 * the current event slug and username from the booker store.
 *
 * Using this hook means you only need to use one hook, instead
 * of combining multiple conditional hooks.
 */
export const useEvent = (props?: { fromRedirectOfNonOrgLink?: boolean }) => {
  const [username, eventSlug, isTeamEvent, org] = useBookerStore(
    useShallow((state) => [state.username, state.eventSlug, state.isTeamEvent, state.org])
  );

  const [data, setData] = useState(null);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username || !eventSlug) {
      setData(null);
      setPending(false);
      setError(null);
      return;
    }
    setPending(true);
    trpc.event.getPublicEvent.query({
      username: username ?? "",
      eventSlug: eventSlug ?? "",
      isTeamEvent,
      org: org ?? null,
      fromRedirectOfNonOrgLink: props?.fromRedirectOfNonOrgLink,
    })
      .then(setData)
      .catch(setError)
      .finally(() => setPending(false));
  }, [username, eventSlug, isTeamEvent, org, props?.fromRedirectOfNonOrgLink]);

  return {
    data,
    isPending,
    error,
    isSuccess: !!data,
    isError: !!error
  };
};

/**
 * Gets schedule for the current event and current month.
 * Gets all values right away and not the store because it increases network timing, only for the first render.
 * We can read from the store if we want to get the latest values.
 *
 * Using this hook means you only need to use one hook, instead
 * of combining multiple conditional hooks.
 *
 * The prefetchNextMonth argument can be used to prefetch two months at once,
 * useful when the user is viewing dates near the end of the month,
 * this way the multi day view will show data of both months.
 */
export const useScheduleForEvent = ({
  prefetchNextMonth,
  username,
  eventSlug,
  eventId,
  month,
  duration,
  monthCount,
  dayCount,
  selectedDate,
  orgSlug,
  teamMemberEmail,
  fromRedirectOfNonOrgLink,
  isTeamEvent,
}: {
  prefetchNextMonth?: boolean;
  username?: string | null;
  eventSlug?: string | null;
  eventId?: number | null;
  month?: string | null;
  duration?: number | null;
  monthCount?: number;
  dayCount?: number | null;
  selectedDate?: string | null;
  orgSlug?: string;
  teamMemberEmail?: string | null;
  fromRedirectOfNonOrgLink?: boolean;
  isTeamEvent?: boolean;
} = {}) => {
  const { timezone } = useTimePreferences();
  const [usernameFromStore, eventSlugFromStore, monthFromStore, durationFromStore] = useBookerStore(
    useShallow((state) => [state.username, state.eventSlug, state.month, state.selectedDuration])
  );

  //const searchParams = useCompatSearchParams();
  //const rescheduleUid = searchParams?.get("rescheduleUid");

  const pathname = usePathname();

  const schedule = useSchedule({
    username: usernameFromStore ?? username,
    eventSlug: eventSlugFromStore ?? eventSlug,
    eventId,
    timezone,
    selectedDate,
    prefetchNextMonth,
    monthCount,
    dayCount,
    //rescheduleUid,
    month: monthFromStore ?? month,
    duration: durationFromStore ?? duration,
    isTeamEvent,
    orgSlug,
    teamMemberEmail,
  });

  return schedule || { isPending: true, data: null, isError: false, isSuccess: false, isLoading: true };
};
