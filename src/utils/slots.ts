import {addMinutes, format, parseISO} from 'date-fns';
import { type IGetAvailableSlots, type Slot, type IToUser } from '@/components/schedules/lib/use-schedule/types';
import {getTimezoneWithFallback} from '@/utils/timezone-utils';

// Types
export type GetScheduleOptions = {
  ctx: {
    session: {
      user: {
        id: string;
        name: string | null;
        timeZone: string | null;
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
export async function getAvailableSlots({ctx, input}: GetScheduleOptions): Promise<IGetAvailableSlots> {
  const {
    startTime,
    endTime,
    scheduleId,
    timeZone
  } = input;

  const actualTimeZone = getTimezoneWithFallback(timeZone);

  if (!ctx.session?.user) {
    throw new Error('Not authenticated');
  }

  const userId = ctx.session.user.id;
  const userName = ctx.session.user.name;
  const userEmail = ctx.session.user.email;

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

  // Group slots by date
  const slotsByDate: Record<string, Slot[]> = {};

  // Convert slots to the expected format and group by date
  allSlots.forEach((slot) => {
    const dateStr = format(slot, 'yyyy-MM-dd');
    const timeStr = format(slot, "yyyy-MM-dd'T'HH:mm:ss");

    if (!bookedTimes.has(timeStr)) {
      const toUser: IToUser = {
        id: userId,
        name: userName,
        email: userEmail,
        timeZone: actualTimeZone
      };

      const slotData: Slot = {
        time: timeStr,
        away: false,
        toUser
      };

      if (!slotsByDate[dateStr]) {
        slotsByDate[dateStr] = [];
      }
      slotsByDate[dateStr].push(slotData);
    }
  });

  return {
    slots: slotsByDate,
    timeZone: actualTimeZone
  };
}
