import { validJson } from "@/packages/lib/jsonUtils";
import type { AppMeta } from "@/packages/types/App";

export const metadata = {
  name: 'Google Calendar',
  description:
    'Google Calendar is a time management and scheduling service developed by Google. Allows users to create and edit events, with options available for type and time. Available to anyone that has a Gmail account on both mobile and web versions.',
  installed: !!(
    process.env.GOOGLE_API_CREDENTIALS &&
    validJson(process.env.GOOGLE_API_CREDENTIALS)
  ),
  type: 'google_calendar',
  title: 'Google Calendar',
  variant: 'calendar',
  category: 'calendar',
  categories: ['calendar'],
  logo: 'icon.svg',
  publisher: 'Markado.co',
  slug: 'google-calendar',
  url: 'https://markado.co/',
  email: 'suporte@markado.co',
  dirName: 'googlecalendar',
  isOAuth: true
} as AppMeta;

export default metadata;
