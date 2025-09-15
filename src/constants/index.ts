export const TIMEZONE_LOCK_VALUE = 'America/Sao_Paulo';

// is production
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const IS_STAGING = process.env.NODE_ENV === 'test';

// is development
const IS_DEV = process.env.NODE_ENV === 'development';
const MARKADO_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (IS_DEV
    ? 'http://localhost:3000'
    : IS_STAGING
      ? 'https://dev.markado.co'
      : 'https://app.markado.co');

/** https://app.markado.co */
export const WEBAPP_URL =
  process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000';

/** @deprecated use `WEBAPP_URL` */
export const BASE_URL = WEBAPP_URL;
export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://markado.co';
export const CONTACT_SUPPORT_LINK = process.env.CONTACT_SUPPORT_LINK || "https://wa.me/5521983449481";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Markado.co';
export const SUPPORT_MAIL_ADDRESS = process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS || "help@markado.co";
export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Markado.co";
export const SENDER_ID = process.env.NEXT_PUBLIC_SENDER_ID || "Markado";
export const SENDER_NAME = process.env.NEXT_PUBLIC_SENDGRID_SENDER_NAME || "Markado.co";
export const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || APP_NAME;

// Extract just the domain part from the URL
const MARKADO_DOMAIN = MARKADO_URL.includes('://')
  ? MARKADO_URL.split('://')[1].replace(/\/$/, '')
  : MARKADO_URL.replace(/\/$/, '');

// Needed for orgs
const ALLOWED_HOSTNAMES = JSON.parse(
  `[${process.env.ALLOWED_HOSTNAMES || ''}]`
) as string[];
const RESERVED_SUBDOMAINS = JSON.parse(
  `[${process.env.RESERVED_SUBDOMAINS || ''}]`
) as string[];


export const AVATAR_FALLBACK = '/avatar.svg';

export const MINUTES_TO_BOOK = process.env.NEXT_PUBLIC_MINUTES_TO_BOOK || '5';

export const SUPORT_WHATSAPP_NUMBER = process.env.SUPORT_WHATSAPP_NUMBER;

export const BOOKER_NUMBER_OF_DAYS_TO_LOAD = parseInt(
  process.env.NEXT_PUBLIC_BOOKER_NUMBER_OF_DAYS_TO_LOAD ?? '0',
  0
);

export const DEFAULT_LIGHT_BRAND_COLOR = '#292929';
export const DEFAULT_DARK_BRAND_COLOR = '#fafafa';

// OAuth needs to have HTTPS(which is not generally setup locally) and a valid tld(*.local isn't a valid tld)
// So for development purpose, we would stick to localhost only
export const WEBAPP_URL_FOR_OAUTH =
  IS_PRODUCTION || IS_DEV ? WEBAPP_URL : 'http://localhost:3000';

export const IS_PREMIUM_USERNAME_ENABLED = false;

/**
 * The maximum number of days we should check for if we don't find all required bookable days
 * Counter start from current day and we would like to not go beyond 2 months(max days possible) from current day.
 */
export const ROLLING_WINDOW_PERIOD_MAX_DAYS_TO_CHECK = 30 + 31;

export {
  MARKADO_URL,
  MARKADO_DOMAIN,
  IS_PRODUCTION,
  ALLOWED_HOSTNAMES,
  RESERVED_SUBDOMAINS
};
