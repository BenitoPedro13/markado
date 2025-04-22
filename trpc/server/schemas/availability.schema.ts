import {z} from 'zod';

// Days of the week (0 = Sunday, 1 = Monday, etc.)
export const daysOfWeekSchema = z.array(z.number().min(0).max(6));

// Time format (HH:MM)
export const timeSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);

// Date format (YYYY-MM-DD)
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Availability schema
export const availabilitySchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  days: daysOfWeekSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  date: dateSchema.optional(),
  scheduleId: z.number().optional()
});

// Schedule schema
export const scheduleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Schedule name is required'),
  timeZone: z.string().optional(),
  userId: z.string()
});

// Create availability input
export const createAvailabilitySchema = availabilitySchema.omit({id: true});

// Update availability input
export const updateAvailabilitySchema = availabilitySchema.partial();

// Create schedule input
export const createScheduleSchema = scheduleSchema.omit({id: true});

// Update schedule input
export const updateScheduleSchema = scheduleSchema.partial();
