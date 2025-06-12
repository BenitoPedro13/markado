// is production
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// is development
const IS_DEV = process.env.NODE_ENV === 'development';
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

export const MINUTES_TO_BOOK = process.env.NEXT_PUBLIC_MINUTES_TO_BOOK || '5';

export const SUPORT_WHATSAPP_NUMBER = process.env.SUPORT_WHATSAPP_NUMBER

export const BOOKER_NUMBER_OF_DAYS_TO_LOAD = parseInt(
  process.env.NEXT_PUBLIC_BOOKER_NUMBER_OF_DAYS_TO_LOAD ?? '0',
  0
);

export const DEFAULT_LIGHT_BRAND_COLOR = '#292929';
export const DEFAULT_DARK_BRAND_COLOR = '#fafafa';

// OAuth needs to have HTTPS(which is not generally setup locally) and a valid tld(*.local isn't a valid tld)
// So for development purpose, we would stick to localhost only
export const WEBAPP_URL_FOR_OAUTH = IS_PRODUCTION || IS_DEV ? WEBAPP_URL : "http://localhost:3000";

export {
  MARKADO_URL,
  MARKADO_DOMAIN,
  IS_PRODUCTION,
  ALLOWED_HOSTNAMES,
  RESERVED_SUBDOMAINS,
};
