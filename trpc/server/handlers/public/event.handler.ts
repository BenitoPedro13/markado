import { EventRepository } from "@/repositories/event";

import type { TEventInputSchema } from "../../schemas/public/event.schema";

interface EventHandlerOptions {
  input: TEventInputSchema;
  userId?: string;
}

export const eventHandler = async ({ input, userId }: EventHandlerOptions) => {
  return await EventRepository.getPublicEvent(input, userId);
};

export default eventHandler;
