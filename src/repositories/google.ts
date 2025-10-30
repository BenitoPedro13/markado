import type { Credentials } from "google-auth-library";

import { prisma } from "@/lib/prisma";
import googleCalendarMetadata from "@/packages/app-store/googlecalendar/_metadata";
import googleMeetMetadata from "@/packages/app-store/googlevideo/_metadata";
import type { AppCategories, Prisma } from "~/prisma/app/generated/prisma/client";

import { CredentialRepository } from "./credential";
import { SelectedCalendarRepository } from "./selectedCalendar";

type GoogleAppKeys = {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
};

export class GoogleRepository {
  static async ensureGoogleApps(keys: GoogleAppKeys) {
    const normalizedKeys = {
      client_id: keys.client_id,
      client_secret: keys.client_secret,
      redirect_uris: keys.redirect_uris,
    } satisfies Prisma.JsonObject;

    await Promise.all([
      this.upsertAppFromMetadata(googleCalendarMetadata, normalizedKeys),
      this.upsertAppFromMetadata(googleMeetMetadata, normalizedKeys),
    ]);
  }

  static async createGoogleCalendarCredential({ userId, key }: { userId: string; key: Credentials }) {
    return await CredentialRepository.create({
      type: "google_calendar",
      key,
      userId,
      appId: "google-calendar",
    });
  }

  static async createGoogleMeetsCredential({ userId }: { userId: string }) {
    return await CredentialRepository.create({
      type: "google_video",
      key: {},
      userId,
      appId: "google-meet",
    });
  }

  static async createSelectedCalendar(data: { credentialId: number; userId: string; externalId: string }) {
    return await SelectedCalendarRepository.create({
      ...data,
      integration: "google_calendar",
    });
  }

  static async findGoogleMeetCredential({ userId }: { userId: string }) {
    return await CredentialRepository.findFirstByUserIdAndType({
      userId,
      type: "google_video",
    });
  }

  private static async upsertAppFromMetadata(meta: { slug: string; dirName?: string; categories: AppCategories[] }, keys: Prisma.JsonObject) {
    const data = {
      slug: meta.slug,
      dirName: meta.dirName ?? meta.slug,
      categories: meta.categories,
      keys,
      enabled: true,
    };

    const existing = await prisma.app.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { dirName: data.dirName },
        ],
      },
    });

    if (!existing) {
      await prisma.app.create({ data });
      return;
    }

    await prisma.app.update({
      where: { slug: existing.slug },
      data,
    });
  }
}
