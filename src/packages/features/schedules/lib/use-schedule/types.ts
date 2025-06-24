import { getScheduleHandler } from "~/trpc/server/handlers/public/getSchedule.handler";

export type Slots = Awaited<ReturnType<typeof getScheduleHandler>>["slots"];

export type GetSchedule = Awaited<ReturnType<typeof getScheduleHandler>>;
