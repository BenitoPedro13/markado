import { z } from "zod";

import getParsedAppKeysFromSlug from "../../_utils/getParsedAppKeysFromSlug";

const googleAppKeysSchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uris: z.array(z.string()),
});

export const getGoogleAppKeys = async () => {
  // First try DB (canonical source)
  try {
    return await getParsedAppKeysFromSlug("google-calendar", googleAppKeysSchema);
  } catch (_err) {
    // Fallback to environment variables for local/dev setups
    // 1) GOOGLE_API_CREDENTIALS contains a JSON (Google OAuth web client)
    const creds = process.env.GOOGLE_API_CREDENTIALS;
    if (creds) {
      try {
        const parsed = JSON.parse(creds);
        const web = parsed.web ?? parsed.installed ?? {};
        const candidate = {
          client_id: web.client_id as string | undefined,
          client_secret: web.client_secret as string | undefined,
          redirect_uris: (web.redirect_uris as string[] | undefined) ?? [],
        };
        return googleAppKeysSchema.parse(candidate);
      } catch {
        // ignore and try next fallback
      }
    }

    // 2) Discrete env vars
    const envCandidate = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uris: process.env.GOOGLE_REDIRECT_URI ? [process.env.GOOGLE_REDIRECT_URI] : undefined,
    } as Record<string, unknown>;

    return googleAppKeysSchema.parse(envCandidate);
  }
};
