import type {App} from '~/prisma/app/generated/prisma/client';
import type {Prisma} from '~/prisma/app/generated/prisma/client';
import type {TFunction} from 'next-i18next';

import type {EventTypeAppsList} from '@/packages/app-store/utils';
import type {DefaultEvent} from '@/packages/lib/defaultEvents';
import type {PaymentAppData} from '@/packages/lib/getPaymentAppData';
import type {userSelect} from '~/prisma/selects';
import type {CredentialPayload} from '@/packages/types/Credential';

import type {Booking} from './createBooking';
import type {
  AwaitedBookingData,
  RescheduleReason,
  NoEmail,
  AdditionalNotes,
  ReqAppsStatus,
  SmsReminderNumber,
  EventTypeId,
  ReqBodyMetadata
} from './getBookingData';
import type {getEventTypeResponse} from './getEventTypesFromDB';
import type {
  BookingType,
  OriginalRescheduledBooking
} from './getOriginalRescheduledBooking';
import type {LoadedUsers} from './loadUsers';

type User = Prisma.UserGetPayload<typeof userSelect>;

export type OrganizerUser = LoadedUsers[number] & {
  isFixed?: boolean;
  metadata?: Prisma.JsonValue;
};

export type Invitee = {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  timeZone: string;
  phoneNumber?: string;
  language: {
    translate: TFunction;
    locale: string;
  };
}[];

export interface IEventTypePaymentCredentialType {
  appId: EventTypeAppsList;
  app: {
    categories: App['categories'];
    dirName: string;
  };
  key: Prisma.JsonValue;
}

export type IsFixedAwareUser = User & {
  isFixed: boolean;
  credentials: CredentialPayload[];
  organization?: {slug: string};
  priority?: number;
  weight?: number;
};

export type NewBookingEventType = DefaultEvent | getEventTypeResponse;

export type {
  AwaitedBookingData,
  RescheduleReason,
  NoEmail,
  AdditionalNotes,
  ReqAppsStatus,
  SmsReminderNumber,
  EventTypeId,
  ReqBodyMetadata,
  PaymentAppData,
  BookingType,
  Booking,
  OriginalRescheduledBooking,
  LoadedUsers,
  getEventTypeResponse
};
