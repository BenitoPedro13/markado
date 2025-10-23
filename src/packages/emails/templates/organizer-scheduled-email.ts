// eslint-disable-next-line no-restricted-imports
import { cloneDeep } from "lodash";
import type { TFunction } from "next-i18next";

import { getRichDescription } from "@/packages/lib/CalEventParser";
import { EMAIL_FROM_NAME } from "@/constants";
import { TimeFormat } from "@/packages/lib/timeFormat";
import type { CalendarEvent, Person } from "@/types/Calendar";

import { renderEmail } from "../";
import generateIcsFile from "../lib/generateIcsFile";
import { GenerateIcsRole } from "../lib/generateIcsFile";
import BaseEmail from "./_base-email";
import dayjs from "@/lib/dayjs";

type Reassigned = { name: string | null; email: string; reason?: string; byUser?: string };
export default class OrganizerScheduledEmail extends BaseEmail {
  calEvent: CalendarEvent;
  t: TFunction;
  newSeat?: boolean;
  teamMember?: Person;
  reassigned?: Reassigned;

  constructor(input: {
    calEvent: CalendarEvent;
    newSeat?: boolean;
    teamMember?: Person;
    reassigned?: Reassigned;
  }) {
    super();
    this.name = "SEND_BOOKING_CONFIRMATION";
    this.calEvent = input.calEvent;
    this.t = this.calEvent.organizer.language.translate;
    this.newSeat = input.newSeat;
    this.teamMember = input.teamMember;
    this.reassigned = input.reassigned;
  }

  protected async getNodeMailerPayload(): Promise<Record<string, unknown>> {
    const clonedCalEvent = cloneDeep(this.calEvent);
    const toAddresses = [this.teamMember?.email || this.calEvent.organizer.email];

    return {
      icalEvent: generateIcsFile({
        calEvent: this.calEvent,
        role: GenerateIcsRole.ORGANIZER,
        status: "CONFIRMED",
      }),
      from: `${EMAIL_FROM_NAME} <${this.getMailerOptions().from}>`,
      to: toAddresses.join(","),
      replyTo: [this.calEvent.organizer.email, ...this.calEvent.attendees.map(({ email }) => email)],
      subject: `${this.newSeat ? `${this.t("new_attendee")}: ` : ""}${this.calEvent.title}`,
      html: await this.getHtml(
        clonedCalEvent,
        this.calEvent.organizer,
        this.teamMember,
        this.newSeat,
        this.reassigned
      ),
      text: this.getTextBody(),
    };
  }

  protected async getHtml(
    calEvent: CalendarEvent,
    attendee: Person,
    teamMember?: Person,
    newSeat?: boolean,
    reassigned?: Reassigned
  ) {
    return await renderEmail("OrganizerScheduledEmail", {
      calEvent,
      attendee,
      teamMember,
      newSeat,
      reassigned,
    });
  }

  protected getTextBody(
    title = "",
    subtitle = "emailed_you_and_any_other_attendees",
    extraInfo = "",
    callToAction = ""
  ): string {
    return `
${this.t(
  title
    ? title
    : this.calEvent.recurringEvent?.count
    ? "new_event_scheduled_recurring"
    : "new_event_scheduled"
)}
${this.t(subtitle)}
${extraInfo}
${getRichDescription(this.calEvent, this.t, true)}
${callToAction}
`.trim();
  }

  protected getTimezone(): string {
    return this.calEvent.organizer.timeZone;
  }

  protected getLocale(): string {
    return this.calEvent.organizer.language.locale;
  }

  protected getOrganizerStart(format: string) {
    return this.getFormattedRecipientTime({
      time: this.calEvent.startTime,
      format,
    });
  }

  protected getOrganizerEnd(format: string) {
    return this.getFormattedRecipientTime({
      time: this.calEvent.endTime,
      format,
    });
  }

  protected getFormattedDate() {
    const organizerTimeFormat = this.calEvent.organizer.timeFormat || TimeFormat.TWELVE_HOUR;
    const locale = this.getLocale();
    
    const startTime = dayjs(this.calEvent.startTime).tz(this.getTimezone()).locale(locale);
    const endTime = dayjs(this.calEvent.endTime).tz(this.getTimezone()).locale(locale);
    
    const timeFormat = organizerTimeFormat === TimeFormat.TWELVE_HOUR ? "h:mmA" : "HH:mm";
    const dayOfWeek = startTime.format("dddd");
    const month = startTime.format("MMMM");
    const day = startTime.format("D");
    const year = startTime.format("YYYY");
    
    return `${startTime.format(timeFormat)} - ${endTime.format(timeFormat)}, ${dayOfWeek}, ${month} ${day}, ${year}`;
  }
}
