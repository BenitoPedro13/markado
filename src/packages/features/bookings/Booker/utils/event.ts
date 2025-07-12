import { usePathname } from "next/navigation";
import { useShallow } from "zustand/shallow";

import { useSchedule } from "@/packages/features/schedules";
//import { useCompatSearchParams } from "@/packages/lib/hooks/useCompatSearchParams";
// import { trpc } from "@/trpc/react";

import { useTimePreferences } from "@/packages/features/bookings/lib/timePreferences";
import { useBookerStore } from "../store";

export type useEventReturnType = ReturnType<typeof useEvent>;
export type useScheduleForEventReturnType = ReturnType<typeof useScheduleForEvent>;

// Mock data para desenvolvimento
const mockEventData = {
  id: 1,
  title: "Consulta de 30 minutos",
  slug: "consulta-30min",
  description: "Uma consulta de 30 minutos para discutir suas necessidades",
  length: 30,
  locations: [
    {
      type: "integrations:google:meet",
      displayLocationPublicly: true,
    }
  ],
  metadata: {},
  requiresConfirmation: false,
  price: 0,
  currency: "BRL",
  recurringEvent: null,
  owner: {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    username: "joao",
    bio: "Consultor especializado",
    avatar: "/avatar.svg",
    brandColor: "#292929",
    darkBrandColor: "#fafafa",
  },
  users: [
    {
      id: 1,
      name: "João Silva",
      username: "joao",
      avatar: "/avatar.svg",
    }
  ],
  team: null,
  timeFormat: 24,
  periodType: "UNLIMITED",
  minimumBookingNotice: 120,
  beforeEventBuffer: 0,
  afterEventBuffer: 0,
  bookingLimits: {},
  durationLimits: {},
  hidden: false,
  assignAllTeamMembers: false,
  entitlement: null,
  isInstantEvent: false,
  profile: {
    name: "João Silva",
    image: "/avatar.svg",
    username: "joao",
    weekStart: "Monday",
    brandColor: "#292929",
    darkBrandColor: "#fafafa",
    theme: null,
    bookerLayouts: {
      defaultLayout: "month_view",
      enabledLayouts: ["month_view", "week_view", "column_view"]
    }
  },
  entity: {
    fromRedirectOfNonOrgLink: false,
    considerUnpublished: false,
    orgSlug: null,
    teamSlug: null,
    name: "João Silva",
    logoUrl: null
  },
  schedulingType: "COLLECTIVE"
};

const mockScheduleData = {
  workingHours: [
    {
      days: [1, 2, 3, 4, 5], // Segunda a sexta
      startTime: 540, // 9:00 AM
      endTime: 1080, // 6:00 PM
      userId: 1,
    }
  ],
  dateOverrides: [],
  currentSeats: null,
  busy: [],
  slots: {
    "2024-12-20": [
      {
        time: "2024-12-20T09:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T09:30:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T10:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T10:30:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T11:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T14:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T14:30:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-20T15:00:00.000Z",
        attendees: 0,
      },
    ],
    "2024-12-21": [
      {
        time: "2024-12-21T09:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-21T10:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-21T11:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-21T15:00:00.000Z",
        attendees: 0,
      },
      {
        time: "2024-12-21T16:00:00.000Z",
        attendees: 0,
      },
    ]
  }
};

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

  // const event = trpc.viewer.public.event.useQuery(
  //   {
  //     username: username ?? "",
  //     eventSlug: eventSlug ?? "",
  //     isTeamEvent,
  //     org: org ?? null,
  //     fromRedirectOfNonOrgLink: props?.fromRedirectOfNonOrgLink,
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: Boolean(username) && Boolean(eventSlug),
  //   }
  // );

  // Retornando dados mock para desenvolvimento
  return {
    data: mockEventData,
    isSuccess: true,
    isError: false,
    isPending: false,
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

  // Retornando dados mock para desenvolvimento
  return {
    data: mockScheduleData,
    isPending: false,
    isError: false,
    isSuccess: true,
    isLoading: false,
  };
};
