import type { NewCalendarEventType, AdditionalInformation } from "@/types/Calendar";

// import type { CrmData } from "./CrmService";
import type { VideoCallData } from "./VideoApiAdapter";

export type Event = AdditionalInformation | NewCalendarEventType | VideoCallData;
// | CrmData;
