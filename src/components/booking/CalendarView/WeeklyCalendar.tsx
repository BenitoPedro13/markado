"use client";

import * as React from "react";
import * as Button from "@/components/align-ui/ui/button";
import { Booking } from "@/data/bookings";

type WeeklyCalendarProps = {
  bookings: Booking[];
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  startHour?: number; // 0-23
  endHour?: number; // 1-24
};

// Simple helpers
const startOfWeek = (date: Date, weekStartsOn: 0 | 1) => {
  const d = new Date(date);
  const day = d.getDay(); // 0-6 (Sun-Sat)
  const diff = weekStartsOn === 1
    ? (day === 0 ? -6 : 1 - day) // Monday-based
    : -day; // Sunday-based
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDayHeader = (d: Date) =>
  d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", weekday: "short" }).toUpperCase();

export function WeeklyCalendar({
  bookings,
  weekStartsOn = 0,
  startHour = 6,
  endHour = 20,
}: WeeklyCalendarProps) {
  const HOUR_PX = 72; // visual scale: 72px per hour
  const totalHours = Math.max(1, endHour - startHour);
  const columnHeight = totalHours * HOUR_PX;

  const [anchorDate, setAnchorDate] = React.useState<Date>(() => new Date());
  const weekStart = React.useMemo(() => startOfWeek(anchorDate, weekStartsOn), [anchorDate, weekStartsOn]);
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const previousWeek = () => setAnchorDate((d) => addDays(d, -7));
  const nextWeek = () => setAnchorDate((d) => addDays(d, 7));
  const thisWeek = () => setAnchorDate(new Date());

  const hours = React.useMemo(() => Array.from({ length: totalHours + 1 }, (_, i) => startHour + i), [startHour, totalHours]);

  function positionForEvent(start: Date, end: Date) {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const visibleStart = startHour * 60;
    const visibleEnd = endHour * 60;
    const topMin = ((startMinutes - visibleStart) / 60) * HOUR_PX;
    const botMin = ((endMinutes - visibleStart) / 60) * HOUR_PX;
    const top = clamp(topMin, 0, columnHeight);
    const bottom = clamp(botMin, 0, columnHeight);
    const height = Math.max(24, bottom - top); // min height
    return { top, height };
  }

  return (
    <div className="relative z-10 -mx-4 overflow-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="w-fit lg:w-full mt-4">
        <div className="rounded-xl border border-stroke-soft-200 overflow-hidden bg-bg-white-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-stroke-soft-200 bg-bg-white-0 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Button.Root variant="neutral" mode="ghost" size="xxsmall" aria-label="Semana anterior" onClick={previousWeek}>
                <Button.Icon>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-text-sub-600"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"/></svg>
                </Button.Icon>
              </Button.Root>
              <Button.Root variant="neutral" mode="ghost" size="xxsmall" aria-label="Próxima semana" onClick={nextWeek}>
                <Button.Icon>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-text-sub-600"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"/></svg>
                </Button.Icon>
              </Button.Root>
              {/* <Button.Root variant="neutral" mode="stroke" size="xsmall" onClick={thisWeek}>Esta semana</Button.Root> */}
            </div>
            <div className="grid grid-cols-7 gap-0 text-center w-full mx-4">
              {days.map((d) => (
                <div key={d.toDateString()} className="text-label-xs text-text-soft-400 py-1">
                  {formatDayHeader(d)}
                </div>
              ))}
            </div>
            <div className="w-[104px]" />
          </div>

          <div className="grid grid-cols-[104px_1fr]">
            {/* Left hours column */}
            <div className="border-r border-stroke-soft-200 bg-bg-white-0">
              {/* spacer for header row height */}
              <div className="h-2" />
              <div style={{ height: columnHeight }} className="relative">
                {hours.slice(0, -1).map((h) => (
                  <div key={h} style={{ top: (h - startHour) * HOUR_PX }} className="absolute left-0 right-0 -translate-y-1/2 text-center text-label-sm text-text-sub-600">
                    {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                  </div>
                ))}
              </div>
            </div>

            {/* Right days grid */}
            <div className="relative">
              {/* background grid */}
              <div className="grid grid-cols-7 divide-x divide-stroke-soft-200" style={{ height: columnHeight }}>
                {days.map((d) => (
                  <div key={d.toISOString()} className="relative">
                    {/* hour lines */}
                    {hours.map((_, i) => (
                      <div key={i} className="border-b border-stroke-soft-200" style={{ height: HOUR_PX }} />
                    ))}

                    {/* events for this day */}
                    <div className="absolute inset-0 px-2 py-1">
                      {bookings.filter((b) => isSameDay(b.startTime, d)).map((b) => {
                        const { top, height } = positionForEvent(b.startTime, b.endTime);
                        return (
                          <div
                            key={b.uid}
                            className="absolute left-2 right-2 rounded-lg px-3 py-2 bg-primary-alpha-10 backdrop-blur-xl overflow-hidden"
                            style={{ top, height }}
                            title={`${b.title} — ${b.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${b.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          >
                            <div className="space-y-0.5">
                              <div className="truncate text-label-xs text-text-strong-950">{b.title}</div>
                              <div className="text-subheading-2xs text-text-sub-600">
                                {b.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {" - "}
                                {b.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {b.location && (
                              <div className="mt-1 text-paragraph-xs text-text-sub-600 truncate">{b.type === 'online' ? `on ${b.location}` : b.location}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyCalendar;

