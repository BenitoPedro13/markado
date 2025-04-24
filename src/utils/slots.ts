import {addMinutes, format, parseISO} from 'date-fns';

// Types
export type Slot = {
  time: string;
  userIds?: string[];
  attendees?: number;
  bookingUid?: string;
  users?: string[];
};

export type GetScheduleOptions = {
  ctx: {
    session: {
      user: {
        id: string;
        name: string | null;
        timeZone: string;
        email: string;
        emailVerified: Date | null;
        biography: string | null;
        image: string | null;
        completedOnboarding: boolean;
        defaultScheduleId: number | null;
        locale: string | null;
        identityProvider: string | null;
        googleAccessToken: string | null;
        googleRefreshToken: string | null;
        googleTokenExpiry: bigint | null;
        selectedCalendarId: string | null;
        googleMeetEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    } | null;
    prisma: any;
  };
  input: {
    startTime: string;
    endTime: string;
    scheduleId: number;
    timeZone?: string;
  };
};

// Helper function to generate time slots
function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  intervalMinutes: number = 30
): Date[] {
  const slots: Date[] = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    slots.push(currentTime);
    currentTime = addMinutes(currentTime, intervalMinutes);
  }

  return slots;
}

// Main function to get available slots
export async function getAvailableSlots({ctx, input}: GetScheduleOptions) {
  const {
    startTime,
    endTime,
    scheduleId,
    timeZone = 'America/Sao_Paulo'
  } = input;

  if (!ctx.session?.user) {
    throw new Error('Not authenticated');
  }

  const userId = ctx.session.user.id;
  const userName = ctx.session.user.name;

  // Parse input dates
  const startDate = parseISO(startTime);
  const endDate = parseISO(endTime);

  // Get schedule with availability
  const schedule = await ctx.prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      userId: userId
    },
    include: {
      availability: true
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  // Generate all possible time slots
  const allSlots = generateTimeSlots(startDate, endDate);

  // Filter out slots that are already booked
  const bookedSlots = await ctx.prisma.availability.findMany({
    where: {
      scheduleId,
      startTime: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const bookedTimes = new Set(
    bookedSlots.map((slot: {startTime: Date}) =>
      format(slot.startTime, "yyyy-MM-dd'T'HH:mm:ss")
    )
  );

  // Convert slots to the expected format
  const availableSlots: Slot[] = allSlots
    .filter((slot) => !bookedTimes.has(format(slot, "yyyy-MM-dd'T'HH:mm:ss")))
    .map((slot) => ({
      time: format(slot, "yyyy-MM-dd'T'HH:mm:ss"),
      userIds: [userId],
      users: [userName || '']
    }));

  return {
    slots: availableSlots,
    timeZone
  };
}
