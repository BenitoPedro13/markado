// import type {TFunction} from 'next-i18next';
import {z} from 'zod';

// import logger from '@/lib/logger';
// import {BookingStatus} from '~/prisma/enums';
import type {
  Ensure,
  Optional
  // , Optional
} from '@/types/utils';

import type {EventLocationTypeFromAppMeta} from '@/packages/types/App';

const translateAbleKeys = [
  'in_person_attendee_address',
  'in_person',
  'attendee_phone_number',
  'link_meeting',
  'organizer_phone_number',
  'organizer_default_conferencing_app',
  'somewhere_else',
  'custom_attendee_location'
];

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

export type LocationObject = {
  type: string;
  address?: string;
  displayLocationPublicly?: boolean;
  credentialId?: number;
} & Partial<
  Record<
    | 'address'
    | 'attendeeAddress'
    | 'link'
    | 'hostPhoneNumber'
    | 'hostDefault'
    | 'phone'
    | 'somewhereElse',
    string
  >
>;

export const defaultLocations: DefaultEventLocationType[] = [
  {
    default: true,
    type: DefaultEventLocationTypeEnum.AttendeeInPerson,
    label: 'in_person_attendee_address',
    variable: 'address',
    organizerInputType: null,
    messageForOrganizer:
      'Markado will ask your invitee to enter an address before scheduling.',
    attendeeInputType: 'attendeeAddress',
    attendeeInputPlaceholder: 'enter_address',
    defaultValueVariable: 'attendeeAddress',
    iconUrl: '/map-pin-dark.svg',
    category: 'in person',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.SomewhereElse,
    label: 'custom_attendee_location',
    variable: 'address',
    organizerInputType: null,
    messageForOrganizer:
      'Markado  will ask your invitee to enter any location before scheduling.',
    attendeeInputType: 'somewhereElse',
    attendeeInputPlaceholder: 'any_location',
    defaultValueVariable: 'somewhereElse',
    iconUrl: '/message-pin.svg',
    category: 'other',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.InPerson,
    label: 'in_person',
    organizerInputType: 'text',
    messageForOrganizer: 'Provide an Address or Place',
    // HACK:
    variable: 'locationAddress',
    defaultValueVariable: 'address',
    iconUrl: '/map-pin-dark.svg',
    category: 'in person',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.Conferencing,
    iconUrl: '/link.svg',
    organizerInputType: null,
    label: 'organizer_default_conferencing_app',
    variable: 'hostDefault',
    defaultValueVariable: 'hostDefault',
    category: 'conferencing',
    messageForOrganizer: '',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.Link,
    label: 'link_meeting',
    organizerInputType: 'text',
    variable: 'locationLink',
    messageForOrganizer: 'Provide a Meeting Link',
    defaultValueVariable: 'link',
    iconUrl: '/link.svg',
    category: 'other',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.Phone,
    label: 'attendee_phone_number',
    variable: 'phone',
    organizerInputType: null,
    attendeeInputType: 'phone',
    attendeeInputPlaceholder: `enter_phone_number`,
    defaultValueVariable: 'phone',
    messageForOrganizer:
      'Markado  will ask your invitee to enter a phone number before scheduling.',
    // This isn't inputType phone because organizer doesn't need to provide it.
    // inputType: "phone"
    iconUrl: '/phone.svg',
    category: 'phone',
    linkType: 'static'
  },
  {
    default: true,
    type: DefaultEventLocationTypeEnum.UserPhone,
    label: 'organizer_phone_number',
    messageForOrganizer: 'Provide your phone number',
    organizerInputType: 'phone',
    variable: 'locationPhoneNumber',
    defaultValueVariable: 'hostPhoneNumber',
    iconUrl: '/phone.svg',
    category: 'phone',
    linkType: 'static'
  }
];

const locations = [...defaultLocations];

export const getEventLocationType = (locationType: string | undefined | null) =>
  locations.find((l) => l.type === locationType);

export const locationKeyToString = (location: LocationObject) => {
  const eventLocationType = getEventLocationType(location.type);
  if (!eventLocationType) {
    return null;
  }
  const defaultValueVariable = eventLocationType.defaultValueVariable;
  if (!defaultValueVariable) {
    console.error(`defaultValueVariable not set for ${location.type}`);
    return '';
  }
  return location[defaultValueVariable] || eventLocationType.label;
};

type PrivacyFilteredLocationObject = Optional<
  LocationObject,
  'address' | 'link'
>;

export const getTranslatedLocation = (
  location: PrivacyFilteredLocationObject,
  eventLocationType: ReturnType<typeof getEventLocationType>,
  // t: TFunction
) => {
  if (!eventLocationType) return null;
  const locationKey = z
    .string()
    .default('')
    .parse(locationKeyToString(location));
  const translatedLocation = location.type.startsWith('integrations:')
    ? eventLocationType.label
    : translateAbleKeys.includes(locationKey)
      ? locationKey
      : locationKey;

  return translatedLocation;
};