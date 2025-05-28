import type { AppCategories, Prisma } from "~/prisma/app/generated/prisma/client";

export type ChildrenEventType = {
  value: string;
  label: string;
  created: boolean;
  owner: {
    avatar: string;
    id: number;
    email: string;
    name: string;
    username: string;
    membership: MembershipRole;
    eventTypeSlugs: string[];
    profile: UserProfile;
  };
  slug: string;
  hidden: boolean;
};

type CommonProperties = {
  default?: false;
  type: string;
  label: string;
  messageForOrganizer?: string;
  iconUrl?: string;
  variable?: "locationLink";
  defaultValueVariable?: "link";
  attendeeInputType?: null;
  attendeeInputPlaceholder?: null;
};

type StaticLinkBasedEventLocation = {
  linkType: "static";
  urlRegExp: string;
  organizerInputPlaceholder?: string;
  organizerInputType?: "text" | "phone";
} & CommonProperties;

type DynamicLinkBasedEventLocation = {
  linkType: "dynamic";
  urlRegExp?: null;
  organizerInputType?: null;
  organizerInputPlaceholder?: null;
} & CommonProperties;

export type EventLocationTypeFromAppMeta = StaticLinkBasedEventLocation | DynamicLinkBasedEventLocation;