// import type {TFunction} from 'next-i18next';
import {z} from 'zod';

// import logger from '@/lib/logger';
// import {BookingStatus} from '~/prisma/enums';
import type {Ensure
    // , Optional
} from '@/types/utils';

import type {EventLocationTypeFromAppMeta} from '@/packages/types/App';

export type DefaultEventLocationType = {
  default: true;
  type: DefaultEventLocationTypeEnum;
  label: string;
  messageForOrganizer: string;
  category: 'in person' | 'conferencing' | 'other' | 'phone';
  linkType: 'static';

  iconUrl: string;
  urlRegExp?: string;
  // HACK: `variable` and `defaultValueVariable` are required due to legacy reason where different locations were stored in different places.
  variable:
    | 'locationType'
    | 'locationAddress'
    | 'address'
    | 'locationLink'
    | 'locationPhoneNumber'
    | 'phone'
    | 'hostDefault';
  defaultValueVariable:
    | 'address'
    | 'attendeeAddress'
    | 'link'
    | 'hostPhoneNumber'
    | 'hostDefault'
    | 'phone'
    | 'somewhereElse';
} & (
  | {
      organizerInputType: 'phone' | 'text' | null;
      organizerInputPlaceholder?: string | null;
      attendeeInputType?: null;
      attendeeInputPlaceholder?: null;
    }
  | {
      attendeeInputType: 'phone' | 'attendeeAddress' | 'somewhereElse' | null;
      attendeeInputPlaceholder: string;
      organizerInputType?: null;
      organizerInputPlaceholder?: null;
    }
);

export type EventLocationTypeFromApp = Ensure<
  EventLocationTypeFromAppMeta,
  'defaultValueVariable' | 'variable'
>;

export type EventLocationType =
  | DefaultEventLocationType
  | EventLocationTypeFromApp;

export const MeetLocationType = 'integrations:google:meet';

/**
 * This isn't an actual location app type. It is a special value that informs to use the Organizer's default conferencing app during booking
 */
export const OrganizerDefaultConferencingAppType = 'conferencing';

export enum DefaultEventLocationTypeEnum {
  /**
   * Booker Address
   */
  AttendeeInPerson = 'attendeeInPerson',
  /**
   * Organizer Address
   */
  InPerson = 'inPerson',
  /**
   * Booker Phone
   */
  Phone = 'phone',
  /**
   * Organizer Phone
   */
  UserPhone = 'userPhone',
  Link = 'link',
  // Same as `OrganizerDefaultConferencingAppType`
  Conferencing = 'conferencing',
  SomewhereElse = 'somewhereElse'
}
