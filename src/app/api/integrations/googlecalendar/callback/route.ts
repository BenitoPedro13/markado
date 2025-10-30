import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

import { renewSelectedCalendarCredentialId } from "@/packages/lib/connectedCalendar";
import { WEBAPP_URL, WEBAPP_URL_FOR_OAUTH } from "@/constants";
import { getSafeRedirectUrl } from "@/packages/lib/getSafeRedirectUrl";
import { getAllCalendars, updateProfilePhoto } from "@/packages/lib/google";
import { HttpError } from "@/packages/lib/http-error";
import { CredentialRepository } from "@/repositories/credential";
import { GoogleRepository } from '@/repositories/google';
import { Prisma } from "~/prisma/app/generated/prisma/client";

import { decodeOAuthState } from "@/packages/app-store/_utils/oauth/decodeOAuthState";
import { REQUIRED_SCOPES, SCOPE_USERINFO_PROFILE } from "@/packages/app-store/googlecalendar/lib/constants";
import { getGoogleAppKeys } from "@/packages/app-store/googlecalendar/lib/getGoogleAppKeys";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const session = await auth();
  // const state = decodeOAuthState({searchParams});
  const returnTo = `${WEBAPP_URL}/sign-up/calendar`;
  const onErrorReturnTo = `${WEBAPP_URL}/sign-up/calendar`;

  if (typeof code !== "string") {
    if (onErrorReturnTo || returnTo) {
      return NextResponse.redirect(
        `${WEBAPP_URL}/sign-up/calendar?error=no_code`
      );
    }
    throw new HttpError({ statusCode: 400, message: "`code` must be a string" });
  }

  if (!session || !session?.user?.id) {
    throw new HttpError({ statusCode: 401, message: "You must be logged in to do this" });
  }

  const googleAppKeys = await getGoogleAppKeys();
  await GoogleRepository.ensureGoogleApps(googleAppKeys);

  const { client_id, client_secret } = googleAppKeys;

  const redirect_uri = `${WEBAPP_URL_FOR_OAUTH}/api/integrations/googlecalendar/callback`;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

  if (code) {
    const token = await oAuth2Client.getToken(code);
    const key = token.tokens;
    const grantedScopes = token.tokens.scope?.split(" ") ?? [];
    // Check if we have granted all required permissions
    const hasMissingRequiredScopes = REQUIRED_SCOPES.some((scope) => !grantedScopes.includes(scope));
    if (hasMissingRequiredScopes) {
      // if (!state?.fromApp) {
      //   throw new HttpError({
      //     statusCode: 400,
      //     message: "You must grant all permissions to use this integration",
      //   });
      // }
      return NextResponse.redirect(
        `${WEBAPP_URL}/sign-up/calendar?error=server_error`
      );
    }

    // Set the primary calendar as the first selected calendar

    oAuth2Client.setCredentials(key);

    const calendar = google.calendar({
      version: "v3",
      auth: oAuth2Client,
    });

    const cals = await getAllCalendars(calendar);

    const primaryCal = cals.find((cal) => cal.primary) ?? cals[0];

    // Only attempt to update the user's profile photo if the user has granted the required scope
    if (grantedScopes.includes(SCOPE_USERINFO_PROFILE)) {
      await updateProfilePhoto(oAuth2Client, session?.user?.id);
    }

    const gcalCredential = await GoogleRepository.createGoogleCalendarCredential({
      key,
      userId: session?.user?.id
    });

    // If we still don't have a primary calendar skip creating the selected calendar.
    // It can be toggled on later.
    if (!primaryCal?.id) {
      return NextResponse.redirect(
        // getSafeRedirectUrl(state?.returnTo) ??
        `${WEBAPP_URL}/sign-up/calendar`
      );
    }

    const selectedCalendarWhereUnique = {
      userId: session?.user?.id,
      externalId: primaryCal.id,
      integration: 'google_calendar'
    };

    // Wrapping in a try/catch to reduce chance of race conditions-
    // also this improves performance for most of the happy-paths.
    try {
      await GoogleRepository.createSelectedCalendar({
        credentialId: gcalCredential.id,
        externalId: selectedCalendarWhereUnique.externalId,
        userId: selectedCalendarWhereUnique.userId,
      });
    } catch (error) {
      let errorMessage = "something_went_wrong";
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // it is possible a selectedCalendar was orphaned, in this situation-
        // we want to recover by connecting the existing selectedCalendar to the new Credential.
        if (await renewSelectedCalendarCredentialId(selectedCalendarWhereUnique, gcalCredential.id)) {
          return NextResponse.redirect(
            // getSafeRedirectUrl(state?.returnTo) ??
            `${WEBAPP_URL}/sign-up/calendar`
          );
        }
        // else
        errorMessage = "account_already_linked";
      }
      await CredentialRepository.deleteById({ id: gcalCredential.id });
      return NextResponse.redirect(

        // getSafeRedirectUrl(state?.onErrorReturnTo) ??
        `${WEBAPP_URL}/sign-up/calendar?error=server_error`

      );
    }
  }

  // No need to install? Redirect to the returnTo URL
  // if (!state?.installGoogleVideo) {
  //   return NextResponse.redirect(
  //     // getSafeRedirectUrl(state?.returnTo) ??
  //     `${WEBAPP_URL}/sign-up/calendar`
  //   );
  // }

  const existingGoogleMeetCredential = await GoogleRepository.findGoogleMeetCredential({
    userId: session?.user?.id
  });

  // If the user already has a google meet credential, there's nothing to do in here
  if (existingGoogleMeetCredential) {
    return NextResponse.redirect(
      // getSafeRedirectUrl(`${WEBAPP_URL}/sign-up/calendar`) ??
      `${WEBAPP_URL}/sign-up/calendar`
    );
  }

  // Create a new google meet credential
  await GoogleRepository.createGoogleMeetsCredential({
    userId: session?.user?.id
  });
  return NextResponse.redirect(
    // getSafeRedirectUrl(`${WEBAPP_URL}/sign-up/calendar`) ??
    `${WEBAPP_URL}/sign-up/calendar`
  );
}
