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
  
  // Disabled hours demo data: 12am-8am and 10pm-12am
  const DISABLED_DEFAULT = React.useMemo(() => [
    { start: 0, end: 8 },
    { start: 22, end: 24 },
  ], []);
  const getDisabledForDate = React.useCallback((_d: Date) => DISABLED_DEFAULT, [DISABLED_DEFAULT]);

  const labelHour = (h: number) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };

  // day-by-day navigation (shifts visible window by 1 day)
  const weekStartsOn: 0 | 1 = 0; // 0 = Sunday
  const [viewStart, setViewStart] = React.useState<Date>(() => startOfWeek(new Date(), weekStartsOn));
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(viewStart, i)), [viewStart]);
  const previousWeek = () => setViewStart((d) => addDays(d, -1));
  const nextWeek = () => setViewStart((d) => addDays(d, 1));

  return (
    <div className="relative z-20 -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="w-full bg-bg-white-0 mt-4">
        {/* Scroll container: vertical to see all hours, horizontal on small screens */}
        <div className="max-h-[calc(100vh-228px)] overflow-auto rounded-xl border border-stroke-soft-200">
          {/* Sticky header spanning left controls + day labels */}
          <div className="sticky flex-1 top-0 z-40 bg-bg-white-0 border-b border-stroke-soft-200" style={{ minWidth: `${(days.length * DAY_MIN_WIDTH) + 103}px` }}>
            <div className="grid grid-cols-[103px_1fr]">
              {/* Left: navigation buttons, sticky on horizontal scroll */}
              <div className="border-r border-stroke-soft-200 sticky -left-4 -ml-px z-40 grid h-10 grid-cols-2 divide-x divide-stroke-soft-200 bg-bg-white-0 lg:left-0">
                <button type="button" onClick={previousWeek} aria-label="Previous week" className="flex items-center justify-center">
                  <RiArrowLeftSLine className="text-text-sub-600 w-5 h-5" />
                </button>
                <button type="button" onClick={nextWeek} aria-label="Next week" className="flex items-center justify-center">
                  <RiArrowRightSLine className="text-text-sub-600 w-5 h-5" />
                </button>
              </div>
              {/* Right: day headers aligned with columns (match body width for small screens) */}
              <div
                className="min-w-0"
                style={{ minWidth: `${days.length * DAY_MIN_WIDTH}px` }}
              >
                <div
                  className="grid grid-flow-col divide-x divide-stroke-soft-200"
                  style={{ gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)` }}
                >
                  {days.map((d) => (
                    <div key={d.toDateString()} className="flex h-10 items-center justify-center bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                      {formatDayHeader(d)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body: two columns (left hours + right grid) */}
          <div className="flex">
            {/* hours label column */}
            <div className="sticky -left-4 z-20 -ml-px w-[104px] h-fit shrink-0 overflow-hidden border-x border-stroke-soft-200 bg-bg-white-0 lg:left-0 lg:border-l-0">
              {/* spacer equal header height */}
              <div style={{ height: HEADER_PX }} />
              {/* absolute-positioned hour labels */}
              <div style={{ height: 24 * HOUR_PX }} className="relative">
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
            </div>

            {/* week days main grid */}
            <div className='h-fit flex-1 min-w-0' style={{ minWidth: `${days.length * DAY_MIN_WIDTH}px` }}>
              <div className="grid w-full content-start items-start">
                {/* background grid */}
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
                    </div>
                  ))}
                </div>
                {/* booking cards + disabled hours overlay */}
                <div
                  className="grid w-full grid-flow-col [grid-area:1/1] pointer-events-none"
                  style={{ gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`, gridTemplateRows: `${HEADER_PX}px repeat(24, ${HOUR_PX}px)` }}
                >
                  {days.map((d, i) => (
                    <React.Fragment key={`disabled-col-${i}`}>
                      {getDisabledForDate(d).map((r, rIdx) => (
                        <div
                          key={`disabled-${i}-${rIdx}`}
                          className="calendar-disabled-hour"
                          style={{
                            gridColumn: `${i + 1} / ${i + 2}`,
                            gridRow: `${r.start + 2} / ${r.end + 2}`,
                          }}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
