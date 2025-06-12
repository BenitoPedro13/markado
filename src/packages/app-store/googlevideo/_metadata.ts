import { validJson } from "@/packages/lib/jsonUtils";
import type { AppMeta } from "@/packages/types/App";

export const metadata = {
  name: 'Google Meet',
  description:
    "Google Meet is Google's web-based video conferencing platform, designed to compete with major conferencing platforms.",
  installed: !!(
    process.env.GOOGLE_API_CREDENTIALS &&
    validJson(process.env.GOOGLE_API_CREDENTIALS)
  ),
  slug: 'google-meet',
  category: 'conferencing',
  categories: ['conferencing'],
  type: 'google_video',
  title: 'Google Meet',
  variant: 'conferencing',
  logo: 'logo.webp',
  publisher: 'Markado.co',
  url: 'https://markado.co/',
  isGlobal: false,
  email: 'suporte@markado.co',
  appData: {
    location: {
      linkType: 'dynamic',
      type: 'integrations:google:meet',
      label: 'Google Meet'
    }
  },
  dirName: 'googlevideo',
  dependencies: ['google-calendar'],
  isOAuth: false
} as AppMeta;

export default metadata;
