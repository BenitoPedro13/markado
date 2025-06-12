import type {Frequency} from '~/prisma/zod-utils';
import type {
  BookingSeat,
  DestinationCalendar,
  SelectedCalendar
} from '~/prisma/app/generated/prisma/client';

import type {SchedulingType} from '~/prisma/enums';

import type {Prisma} from '~/prisma/app/generated/prisma/client';
import type {calendar_v3} from 'googleapis';

export type {VideoCallData} from './VideoApiAdapter';
import type {bookingResponse} from '@/packages/features/bookings/lib/getBookingResponsesSchema';

import type {Ensure} from './utils';

export type IntervalLimitUnit = 'day' | 'week' | 'month' | 'year';

export type IntervalLimit = Partial<
  Record<`PER_${Uppercase<IntervalLimitUnit>}`, number | undefined>
>;

export interface RecurringEvent {
  dtstart?: Date | undefined;
  interval: number;
  count: number;
  freq: Frequency;
  until?: Date | undefined;
  tzid?: string | undefined;
}

export type EventBusyDate = {
  start: Date | string;
  end: Date | string;
  source?: string | null;
};

export type EventBusyDetails = EventBusyDate & {
  title?: string;
  source?: string | null;
  userId?: string | null;
};

export type Person = {
  name: string;
  email: string;
  timeZone: string;
  language: {translate: TFunction; locale: string};
  username?: string;
  id?: number | string;
  bookingId?: number | null;
  locale?: string | null;
  timeFormat?: TimeFormat;
  bookingSeat?: BookingSeat | null;
  phoneNumber?: string | null;
};

export type TeamMember = {
  id?: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  timeZone: string;
  language: {translate: TFunction; locale: string};
};

export interface ConferenceData {
  createRequest?: calendar_v3.Schema$CreateConferenceRequest;
}

export interface EntryPoint {
  entryPointType?: string;
  uri?: string;
  label?: string;
  pin?: string;
  accessCode?: string;
  meetingCode?: string;
  passcode?: string;
  password?: string;
}

export interface AdditionalInformation {
  conferenceData?: ConferenceData;
  entryPoints?: EntryPoint[];
  hangoutLink?: string;
}

export interface ExistingRecurringEvent {
  recurringEventId: string;
}

type PaymentInfo = {
  link?: string | null;
  reason?: string | null;
  id?: string | null;
  paymentOption?: string | null;
  amount?: number;
  currency?: string;
};

export type CalEventResponses = Record<
  string,
  {
    label: string;
    value: z.infer<typeof bookingResponse>;
    isHidden?: boolean;
  }
>;

// If modifying this interface, probably should update builders/calendarEvent files
export interface CalendarEvent {
  // Instead of sending this per event.
  // TODO: Links sent in email should be validated and automatically redirected to org domain or regular app. It would be a much cleaner way. Maybe use existing /api/link endpoint
  bookerUrl?: string;
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  organizer: Person;
  attendees: Person[];
  length?: number | null;
  additionalNotes?: string | null;
  customInputs?: Prisma.JsonObject | null;
  description?: string | null;
  team?: {
    name: string;
    members: TeamMember[];
    id: number;
  };
  location?: string | null;
  conferenceCredentialId?: number;
  conferenceData?: ConferenceData;
  additionalInformation?: AdditionalInformation;
  uid?: string | null;
  existingRecurringEvent?: ExistingRecurringEvent | null;
  bookingId?: number;
  videoCallData?: VideoCallData;
  paymentInfo?: PaymentInfo | null;
  requiresConfirmation?: boolean | null;
  destinationCalendar?: DestinationCalendar[] | null;
  cancellationReason?: string | null;
  rejectionReason?: string | null;
  hideCalendarNotes?: boolean;
  hideCalendarEventDetails?: boolean;
  recurrence?: string;
  recurringEvent?: RecurringEvent | null;
  eventTypeId?: number | null;
  // appsStatus?: AppsStatus[];
  seatsShowAttendees?: boolean | null;
  seatsShowAvailabilityCount?: boolean | null;
  attendeeSeatId?: string;
  seatsPerTimeSlot?: number | null;
  schedulingType?: SchedulingType | null;
  iCalUID?: string | null;
  iCalSequence?: number | null;

  // It has responses to all the fields(system + user)
  responses?: CalEventResponses | null;

  // It just has responses to only the user fields. It allows to easily iterate over to show only user fields
  userFieldsResponses?: CalEventResponses | null;
  platformClientId?: string | null;
  platformRescheduleUrl?: string | null;
  platformCancelUrl?: string | null;
  platformBookingUrl?: string | null;
  oneTimePassword?: string | null;
}

export type AdditionalInfo = Record<string, unknown> & {calWarnings?: string[]};

export type NewCalendarEventType = {
  uid: string;
  id: string;
  thirdPartyRecurringEventId?: string | null;
  type: string;
  password: string;
  url: string;
  additionalInfo: AdditionalInfo;
  iCalUID?: string | null;
  location?: string | null;
  hangoutLink?: string | null;
  conferenceData?: ConferenceData;
};

export interface IntegrationCalendar
  extends Ensure<Partial<SelectedCalendar>, 'externalId'> {
  primary?: boolean;
  name?: string;
  readOnly?: boolean;
  // For displaying the connected email address
  email?: string;
  primaryEmail?: string;
  credentialId?: number | null;
  integrationTitle?: string;
}

export type EventBusyDate = {
  start: Date | string;
  end: Date | string;
  source?: string | null;
};

export interface Calendar {
  createEvent(
    event: CalendarEvent,
    credentialId: number
  ): Promise<NewCalendarEventType>;

  updateEvent(
    uid: string,
    event: CalendarEvent,
    externalCalendarId?: string | null
  ): Promise<NewCalendarEventType | NewCalendarEventType[]>;

  deleteEvent(
    uid: string,
    event: CalendarEvent,
    externalCalendarId?: string | null
  ): Promise<unknown>;

  getAvailability(
    dateFrom: string,
    dateTo: string,
    selectedCalendars: IntegrationCalendar[]
  ): Promise<EventBusyDate[]>;

  listCalendars(event?: CalendarEvent): Promise<IntegrationCalendar[]>;
}

/**
 * @see [How to inference class type that implements an interface](https://stackoverflow.com/a/64765554/6297100)
 */
type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;

export type CalendarClass = Class<Calendar, [CredentialPayload]>;