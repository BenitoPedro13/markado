"use client";

import * as React from 'react';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import {RiArrowLeftSLine, RiArrowRightSLine} from '@remixicon/react';
import * as Button from '@/components/align-ui/ui/button';

// date helpers
const startOfWeek = (date: Date, weekStartsOn: 0 | 1) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = weekStartsOn === 1 ? (day === 0 ? -6 : 1 - day) : -day; // Mon or Sun as first
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const formatDayHeader = (d: Date) =>
  d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', weekday: 'short' }).toUpperCase();

export const CalendarTest = () => {
  const HOURS = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOUR_PX = 120; // height per hour row (px)
  const HEADER_PX = 40; // header row height
  const DAY_MIN_WIDTH = 200; // min width per day for horizontal scroll

  const labelHour = (h: number) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };

  // week navigation
  const [anchorDate, setAnchorDate] = React.useState<Date>(() => new Date());
  const weekStartsOn: 0 | 1 = 0; // 0 = Sunday
  const weekStart = React.useMemo(() => startOfWeek(anchorDate, weekStartsOn), [anchorDate]);
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const previousWeek = () => setAnchorDate((d) => addDays(d, -7));
  const nextWeek = () => setAnchorDate((d) => addDays(d, 7));

  return (
    <div className="relative z-20 -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="w-full bg-bg-white-0 mt-4">
        {/* Scroll container: vertical to see all hours, horizontal on small screens */}
        <div className="flex max-h-[calc(100vh-228px)] overflow-auto rounded-xl border border-stroke-soft-200">
          {/* navigate days button group + hours label column */}
          <div className="sticky -left-4 z-30 w-full max-w-[104px] -ml-px w- h-fit shrink-0 overflow-hidden border-x border-stroke-soft-200 bg-bg-white-0 lg:left-0 lg:border-l-0">
            {/* sticky nav bar on top */}
            <div className="sticky top-0 grid h-10 w-full shrink-0 grid-cols-2 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200 bg-bg-white-0">
              <button type="button" onClick={previousWeek} aria-label="Previous week" className="flex items-center justify-center bg-bg-white-0">
                <RiArrowLeftSLine className="text-text-sub-600 w-5 h-5" />
              </button>
              <button type="button" onClick={nextWeek} aria-label="Next week" className="flex items-center justify-center bg-bg-white-0">
                <RiArrowRightSLine className="text-text-sub-600 w-5 h-5" />
              </button>
            </div>
            {/* spacer equal header height */}
            <div style={{ height: HEADER_PX }} />
            {/* absolute-positioned hour labels */}
            <div style={{ height: (24 * HOUR_PX) }} className="relative">
              {HOURS.map((h) => (
                <div
                  key={h}
                  style={{ top: h * HOUR_PX }}
                  className="absolute left-0 right-0 -translate-y-1/2 text-center text-label-sm text-text-sub-600"
                >
                  {labelHour(h)}
                </div>
              ))}
            </div>
            <div style={{ height: HEADER_PX }} />
          </div>
          {/* week days label header + main grid */}
          <div
            className='h-fit flex-1 min-w-0'
            style={{ minWidth: `${days.length * DAY_MIN_WIDTH}px` }}
          >
            {/* week days label header */}
            <div className="sticky top-0 z-20 overflow-hidden rounded-tr-xl bg-bg-white-0">

              <header className="flex divide-x divide-stroke-soft-200">
                
                <div
                  className="grid w-full grid-flow-col divide-x divide-stroke-soft-200"
                  style={{ gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)` }}
                >
                  {days.map((d) => (
                    <div key={d.toDateString()} className="flex h-10 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                      {formatDayHeader(d)}
                    </div>
                  ))}
                </div>
              </header>
            </div>
            <div className="grid w-full content-start items-start">
              {/* main grid */}
              <div
                className="grid w-full grid-flow-col divide-x divide-stroke-soft-200 [grid-area:1/1]"
                style={{ gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)` }}
              >
                {days.map((d, i) => (
                  <div key={i} className="grid divide-y divide-stroke-soft-200">
                    <div style={{ height: HEADER_PX }} />
                    {HOURS.map((h) => (
                      <div key={h} className="border-b border-stroke-soft-200" style={{ height: HOUR_PX }} />
                    ))}
                    <div style={{ height: HEADER_PX }} />
                  </div>
                ))}
              </div>
                {/* booking cards + disabled hours overlay */}
              <div
                className="grid w-full grid-flow-col gap-y-px [grid-area:1/1]"
                style={{ gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`, gridTemplateRows: `${HEADER_PX}px repeat(24, ${HOUR_PX}px) ${HEADER_PX}px` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
