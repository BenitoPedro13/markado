import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '~/trpc/server';

export interface IFromUser {
  id: string;
  name: string | null;
  email: string;
  timeZone: string;
}

export interface IToUser {
  id: string;
  name: string | null;
  email: string;
  timeZone: string;
}

// Define the slot type based on our implementation
export type Slot = {
  time: string;
  attendees?: number;
  bookingUid?: string;
  away?: boolean;
  fromUser?: IFromUser;
  toUser?: IToUser;
  reason?: string;
  emoji?: string;
};

// Define the getSchedule response type
export type GetScheduleResponse = {
  slots: Record<string, Slot[]>;
  timeZone: string;
};

// Define the slots type from the router output
export type Slots = Record<string, Slot[]>;

// Define the getSchedule type from the router output
export type GetSchedule = inferRouterOutputs<AppRouter>["slots"]["getSchedule"];

// Define the getAvailableSlots interface
export interface IGetAvailableSlots {
  slots: Record<string, Slot[]>;
  timeZone: string;
  troubleshooter?: any;
}
