// is production
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const MARKADO_URL = process.env.MARKADO_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.markado.co');

/** https://app.markado.co */
export const WEBAPP_URL =
  process.env.NEXT_PUBLIC_WEBAPP_URL ||
  "http://localhost:3000";

// Extract just the domain part from the URL
const MARKADO_DOMAIN = MARKADO_URL.includes('://') 
  ? MARKADO_URL.split('://')[1].replace(/\/$/, '') 
  : MARKADO_URL.replace(/\/$/, '');

  // Needed for orgs
const ALLOWED_HOSTNAMES = JSON.parse(`[${process.env.ALLOWED_HOSTNAMES || ""}]`) as string[];
const RESERVED_SUBDOMAINS = JSON.parse(`[${process.env.RESERVED_SUBDOMAINS || ""}]`) as string[];

export const AVATAR_FALLBACK = '/avatar.svg';

export const SUPORT_WHATSAPP_NUMBER = process.env.SUPORT_WHATSAPP_NUMBER

export const BOOKER_NUMBER_OF_DAYS_TO_LOAD = parseInt(
  process.env.NEXT_PUBLIC_BOOKER_NUMBER_OF_DAYS_TO_LOAD ?? '0',
  0
);

export const DEFAULT_LIGHT_BRAND_COLOR = '#292929';
export const DEFAULT_DARK_BRAND_COLOR = '#fafafa';

export {
  MARKADO_URL,
  MARKADO_DOMAIN,
  IS_PRODUCTION,
  ALLOWED_HOSTNAMES,
  RESERVED_SUBDOMAINS,
};
