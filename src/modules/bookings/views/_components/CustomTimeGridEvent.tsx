"use client";

import { RouterOutputs } from "@/types/trpc-router-outputs";
import dayjs from "dayjs";
import "~/../styles/globals.css";

interface Props {
  id: string;
  title: string;
  start: string;
  end: string;
  people: string[];
  location: string;
  booking: RouterOutputs["viewer"]["bookings"]["get"]["bookings"][0];
}

const CustomTimeGridEvent = ({ calendarEvent }: { calendarEvent: Props }) => {
  const { id, title, start, end, people, booking } = calendarEvent;

  const eventDurationInMinutes = booking.eventType.length || dayjs(end).diff(dayjs(start), "minute");

  const eventDurationInHours = eventDurationInMinutes / 60;
  const eventHeightInCalendar = 66.61 * eventDurationInHours;

  // If event height is small, limit title to 2 lines
  const titleClassName = `overflow-hidden text-ellipsis text-xs font-medium ${
    eventHeightInCalendar < 100 ? "line-clamp-1" : ""
  }`;

  const eventTypeColor =
    booking.eventType.eventTypeColor && booking.eventType.eventTypeColor["lightEventTypeColor"];

  const eventCardStyles = {
    short: {
      container: "pl-2 time-grid-event flex min-h-full bg-red-200 px-0",
      wrapper: "flex min-h-full flex-col justify-between gap-2 rounded-lg p-0",
      titleContailer: "flex flex-col",
    }, // Style for 15 minutes or less
    medium: {
      container: "pl-2 time-grid-event flex min-h-full bg-yellow-200 px-0",
      wrapper: "flex min-h-full flex-col justify-between gap-2 rounded-lg p-0",
      titleContailer: "flex flex-col",
    }, // Style for 30 minutes or less but more than 15 minutes
    long: {
      container: "pl-2 time-grid-event flex min-h-full bg-green-200 px-0",
      wrapper: "flex min-h-full flex-col justify-between gap-2 rounded-lg p-0",
      titleContailer: "flex flex-col",
    }, // Style for 45 minutes or less but more than 30 minutes
    extraLong: {
      container: "pl-2 time-grid-event flex min-h-full bg-blue-200 px-0",
      wrapper: "flex min-h-full flex-col justify-between gap-2 rounded-lg p-0",
      titleContailer: "flex flex-col",
    }, // Style for 60 minutes or more but more than 45 minutes
  };

  const getEventCardStyle = (duration: number) => {
    if (duration <= 15) {
      return eventCardStyles.short;
    } else if (duration <= 30) {
      return eventCardStyles.medium;
    } else if (duration <= 45) {
      return eventCardStyles.long;
    } else {
      return eventCardStyles.extraLong;
    }
  };

  const eventCardStyle = getEventCardStyle(eventDurationInMinutes);

  return (
    <div
      key={id}
      className={eventCardStyle.container}
      // style={{ backgroundColor: eventTypeColor }}
    >
      <div className={eventCardStyle.wrapper}>
        <div className={eventCardStyle.titleContailer}>
          <div className={titleClassName}>{title}</div>
          <div className="">
            <span className="text-sub-600 text-xs font-medium">
              {new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="text-sub-600 text-xs font-medium">{" - "}</span>
            <span className="text-sub-600 text-xs font-medium">
              {new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {people?.map((person, index) => (
            <span key={index}>{person}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTimeGridEvent;
