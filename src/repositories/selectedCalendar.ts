import { prisma } from "@/lib/prisma";

type SelectedCalendarCreateInput = {
  credentialId: number;
  userId: string;
  externalId: string;
  integration: string;
};

export class SelectedCalendarRepository {
  static async create(data: SelectedCalendarCreateInput) {
    return await prisma.selectedCalendar.create({
      data: {
        ...data,
      },
    });
  }
}
