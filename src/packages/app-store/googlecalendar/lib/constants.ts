export const SCOPE_USERINFO_PROFILE = "https://www.googleapis.com/auth/userinfo.profile";
export const SCOPE_CALENDAR_READONLY = "https://www.googleapis.com/auth/calendar.readonly";
export const SCOPE_CALENDAR_EVENT = "https://www.googleapis.com/auth/calendar.events";

export const REQUIRED_SCOPES = [SCOPE_CALENDAR_READONLY, SCOPE_CALENDAR_EVENT];

export const SCOPES = [...REQUIRED_SCOPES, SCOPE_USERINFO_PROFILE];

export const APP_CREDENTIAL_SHARING_ENABLED =
  !!process.env.MARKADO_CREDENTIAL_SYNC_SECRET &&
  !!process.env.MARKADO_APP_CREDENTIAL_ENCRYPTION_KEY;
export const CREDENTIAL_SYNC_SECRET = process.env.MARKADO_CREDENTIAL_SYNC_SECRET;
export const CREDENTIAL_SYNC_SECRET_HEADER_NAME =
  process.env.MARKADO_CREDENTIAL_SYNC_HEADER_NAME ||
  'markado-credential-sync-secret';

export const CREDENTIAL_SYNC_ENDPOINT = process.env.MARKADO_CREDENTIAL_SYNC_ENDPOINT;

