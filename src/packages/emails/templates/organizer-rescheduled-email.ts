import { EMAIL_FROM_NAME } from "@/constants";
import { getTranslation } from "@/packages/lib/server/i18n";

import { renderEmail } from "../";
import generateIcsFile, { GenerateIcsRole } from "../lib/generateIcsFile";
import OrganizerScheduledEmail from "./organizer-scheduled-email";

export default class OrganizerRescheduledEmail extends OrganizerScheduledEmail {
  protected async getNodeMailerPayload(): Promise<Record<string, unknown>> {
    const toAddresses = [this.teamMember?.email || this.calEvent.organizer.email];
    
    const locale = this.calEvent.organizer.language.locale || 'pt';
    const t = await getTranslation(locale, 'common');
    
    const subject = t("event_type_has_been_rescheduled_on_time_date", {
      title: this.calEvent.title,
    });

    return {
      icalEvent: generateIcsFile({
        calEvent: this.calEvent,
        role: GenerateIcsRole.ORGANIZER,
        status: "CONFIRMED",
      }),
      from: `${EMAIL_FROM_NAME} <${this.getMailerOptions().from}>`,
      to: toAddresses.join(","),
      replyTo: [this.calEvent.organizer.email, ...this.calEvent.attendees.map(({ email }) => email)],
      subject,
      html: await renderEmail("OrganizerRescheduledEmail", {
        calEvent: { ...this.calEvent, attendeeSeatId: undefined },
        attendee: this.calEvent.organizer,
      }),
      text: this.getTextBody("event_has_been_rescheduled"),
    };
  }
}
