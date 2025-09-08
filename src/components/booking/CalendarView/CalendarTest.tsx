'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMapPinFill
} from '@remixicon/react';
import {Booking} from '@/data/bookings';
import * as Drawer from '@/components/align-ui/ui/drawer';
import * as Divider from '@/components/align-ui/ui/divider';
import * as Button from '@/components/align-ui/ui/button';
import Link from 'next/link';

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
  d
    .toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      weekday: 'short'
    })
    .toUpperCase();

const labelHour = (h: number) => {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
};

/*
  Props 
  locationType: 'in_person' | 'online'
    - in_person: 
        - background: (state/warning/ligher)
        - location: [map-pin-icon] address
        - dont show guests avatars
        - elements: title, start-end time, location
    - online: 
      - background: (state/information/ligher)
          - location: on [provider]
          - show guests with avatars
          - elements: title, start-end time, guests, location
  completed: boolean (if true, show as completed [background: bg-weak-50])
  onClick: () => void
  booking: (EventData)
*/

type CalendarCardEventProps = {
  title: string;
  start: Date;
  end: Date;
  type: Booking['type'];
  status: Booking['status'];
  location?: string;
  participants?: string[];
};

export const CalendarCardEvent = ({
  title,
  start,
  end,
  type,
  status,
  location
}: CalendarCardEventProps) => {
  const minutes = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 60000)
  );
  const showTime = minutes > 10; // hide for 30min or less
  const showLocation = minutes > 30; // hide for 30min or less
  const timeRange = `${start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
  const rawLoc = location ?? '';
  const loc = rawLoc.toLowerCase();
  const looksOnline = /integrations:google:meet|\bmeet\b|zoom|teams/.test(loc);
  const isInPerson = type !== 'online' && !looksOnline;
  const bg =
    status === 'canceled'
      ? 'bg-bg-weak-50'
      : isInPerson
        ? 'bg-warning-lighter'
        : 'bg-information-lighter';

        console.log({location, looksOnline, isInPerson, rawLoc, loc});
  return (
    <div
      className={`flex h-full min-h-0 w-full min-w-0 flex-col justify-between overflow-hidden rounded-lg px-3 py-2 backdrop-blur-xl ${bg}`}
    >
      <div className="space-y-0.5">
        <div className="text-label-xs truncate text-text-strong-950">
          {title}
        </div>
        {showTime && (
          <div className="text-subheading-2xs text-text-sub-600">
            {timeRange}
          </div>
        )}
      </div>
      {showLocation && (!isInPerson || looksOnline) ? (
        <div className="text-paragraph-xs text-text-sub-600 truncate">
          {'on Meet'}
        </div>
      ) : // in-person. Avoid showing literal "inPerson"; show address if present
      showLocation &&
        rawLoc &&
        !['inperson', 'in_person', 'in person'].includes(loc) ? (
        <div className="flex items-center gap-1 text-paragraph-xs text-text-sub-600 truncate">
          <RiMapPinFill className="inline-block size-4 text-warning-base" />
          <div className="truncate">{rawLoc}</div>
        </div>
      ) : null}
    </div>
  );
};

type CalendarTestProps = {
  bookings: Booking[];
};

export const CalendarTest = ({bookings}: CalendarTestProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Booking | null>(null);
  const HOURS = React.useMemo(() => Array.from({length: 24}, (_, i) => i), []);
  const HOUR_PX = 120; // height per hour row (px)
  const HEADER_PX = 40; // header row height
  const DAY_MIN_WIDTH = 200; // min width per day for horizontal scroll
  const COLUMN_HEIGHT = 24 * HOUR_PX;
  const HOUR_PAD_Y = 8; // py-2 equivalent so cards don't touch grid lines
  // const COLUMN_HEIGHT = 24 * HOUR_PX;

  // Disabled hours demo data: 12am-8am and 10pm-12am
  const DISABLED_DEFAULT = React.useMemo(
    () => [
      {start: 0, end: 8},
      {start: 22, end: 24}
    ],
    []
  );

  const getDisabledForDate = React.useCallback(
    (_d: Date) => DISABLED_DEFAULT,
    [DISABLED_DEFAULT]
  );

  // day-by-day navigation (shifts visible window by 1 day)
  const weekStartsOn: 0 | 1 = 0; // 0 = Sunday
  const [viewStart, setViewStart] = React.useState<Date>(() =>
    startOfWeek(new Date(), weekStartsOn)
  );

  const days = React.useMemo(
    () => Array.from({length: 7}, (_, i) => addDays(viewStart, i)),
    [viewStart]
  );

  const previousWeek = () => setViewStart((d) => addDays(d, -1));
  const nextWeek = () => setViewStart((d) => addDays(d, 1));

  // helpers for event positioning
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  function positionForEvent(start: Date, end: Date) {
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));
    const content = HOUR_PX - 2 * HOUR_PAD_Y;

    const mapStart = (d: Date) => {
      const hour = d.getHours();
      const minute = d.getMinutes();
      return hour * HOUR_PX + HOUR_PAD_Y + (minute / 60) * content;
    };

    const mapEnd = (d: Date) => {
      const hour = d.getHours();
      const minute = d.getMinutes();
      // If the event ends exactly at an hour mark, align to the end of the previous content box
      if (minute === 0) return hour * HOUR_PX - HOUR_PAD_Y;
      return hour * HOUR_PX + HOUR_PAD_Y + (minute / 60) * content;
    };

    const topMin = mapStart(start);
    const botMin = mapEnd(end);
    const top = clamp(topMin, 0, COLUMN_HEIGHT);
    const bottom = clamp(botMin, 0, COLUMN_HEIGHT);
    const height = Math.max(24, bottom - top);
    return {top: HEADER_PX + top, height};
  }

  // Map bookings to calendar events
  const events = React.useMemo(() => {
    return bookings.map((b, i) => ({
      id: b.uid ?? `${b.id ?? i}`,
      title: b.title,
      start: new Date(b.startTime),
      end: new Date(b.endTime),
      type: b.type,
      status: b.status,
      location: b.location,
      participants: b.participants,
      organizer: b.organizer,
      uid: b.uid,
      raw: b
    }));
  }, [bookings]);

  return (
    <div className="relative z-20 -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="w-full bg-bg-white-0 mt-4">
        {/* Scroll container: vertical to see all hours, horizontal on small screens */}
        <div className="max-h-[calc(100vh-228px)] overflow-auto rounded-xl border border-stroke-soft-200">
          {/* Sticky header spanning left controls + day labels */}
          <div
            className="sticky flex-1 top-0 z-40 bg-bg-white-0 border-b border-stroke-soft-200"
            style={{minWidth: `${days.length * DAY_MIN_WIDTH + 103}px`}}
          >
            <div className="grid grid-cols-[103px_1fr]">
              {/* Left: navigation buttons, sticky on horizontal scroll */}
              <div className="border-r border-stroke-soft-200 sticky -left-4 -ml-px z-40 grid h-10 grid-cols-2 divide-x divide-stroke-soft-200 bg-bg-white-0 lg:left-0">
                <button
                  type="button"
                  onClick={previousWeek}
                  aria-label="Previous week"
                  className="flex items-center justify-center"
                >
                  <RiArrowLeftSLine className="text-text-sub-600 w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextWeek}
                  aria-label="Next week"
                  className="flex items-center justify-center"
                >
                  <RiArrowRightSLine className="text-text-sub-600 w-5 h-5" />
                </button>
              </div>
              {/* Right: day headers aligned with columns (match body width for small screens) */}
              <div
                className="min-w-0"
                style={{minWidth: `${days.length * DAY_MIN_WIDTH}px`}}
              >
                <div
                  className="grid grid-flow-col divide-x divide-stroke-soft-200"
                  style={{gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`}}
                >
                  {days.map((d) => (
                    <div
                      key={d.toDateString()}
                      className="flex h-10 items-center justify-center bg-bg-weak-50 text-center text-label-xs text-text-soft-400"
                    >
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
              <div style={{height: HEADER_PX}} />
              {/* absolute-positioned hour labels */}
              <div style={{height: 24 * HOUR_PX}} className="relative">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{top: h * HOUR_PX}}
                    className="absolute left-0 right-0 -translate-y-1/2 text-center text-label-sm text-text-sub-600"
                  >
                    {labelHour(h)}
                  </div>
                ))}
              </div>
            </div>

            {/* week days main grid */}
            <div
              className="h-fit flex-1 min-w-0"
              style={{minWidth: `${days.length * DAY_MIN_WIDTH}px`}}
            >
              <div className="grid w-full content-start items-start">
                {/* background grid */}
                <div
                  className="grid w-full grid-flow-col divide-x divide-stroke-soft-200 [grid-area:1/1]"
                  style={{gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`}}
                >
                  {days.map((d, i) => (
                    <div
                      key={i}
                      className="grid divide-y divide-stroke-soft-200"
                    >
                      <div style={{height: HEADER_PX}} />
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="border-b border-stroke-soft-200"
                          style={{height: HOUR_PX}}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                {/* booking cards + disabled hours overlay */}
                {/* <div
                  className="grid w-full grid-flow-col [grid-area:1/1] pointer-events-none"
                  style={{
                    gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`,
                    gridTemplateRows: `${HEADER_PX}px repeat(24, ${HOUR_PX}px)`
                  }}
                >
                  {days.map((d, i) => (
                    <React.Fragment key={`disabled-col-${i}`}>
                      {getDisabledForDate(d).map((r, rIdx) => (
                        <div
                          key={`disabled-${i}-${rIdx}`}
                          className="calendar-disabled-hour"
                          style={{
                            gridColumn: `${i + 1} / ${i + 2}`,
                            gridRow: `${r.start + 2} / ${r.end + 2}`
                          }}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div> */}

                {/* events overlay */}
                <div
                  className="grid w-full grid-flow-col [grid-area:1/1] z-20"
                  style={{
                    gridAutoColumns: `minmax(${DAY_MIN_WIDTH}px,1fr)`,
                    gridTemplateRows: `${HEADER_PX}px repeat(24, ${HOUR_PX}px)`
                  }}
                >
                  {days.map((d, i) => {
                    const dayEvents = events
                      .filter((e) => isSameDay(e.start, d))
                      .sort((a, b) => a.start.getTime() - b.start.getTime());
                    const counter: Record<number, number> = {};
                    return (
                      <div
                        key={`col-${i}`}
                        className="relative px-2"
                        style={{
                          gridColumn: `${i + 1} / ${i + 2}`,
                          gridRow: '1 / -1',
                          height: HEADER_PX + 24 * HOUR_PX
                        }}
                      >
                        {dayEvents.map((e) => {
                          const {top, height} = positionForEvent(
                            e.start,
                            e.end
                          );
                          const startHour = e.start.getHours();
                          const idx = counter[startHour] ?? 0;
                          counter[startHour] = idx + 1;
                          const gap = idx * 8; // 8px gap between events starting in same hour
                          const topWithGap = top + gap;
                          // Subtract the same gap from height to preserve the end time
                          const heightAdjusted = Math.max(24, height - gap);
                          return (
                            <div
                              key={e.id}
                              className="absolute left-2 right-2 overflow-visible pointer-events-auto"
                              style={{top: topWithGap, height: heightAdjusted}}
                              title={`${e.title}`}
                              onClick={() => {
                                setSelected(e.raw);
                                setIsDrawerOpen(true);
                              }}
                            >
                              <CalendarCardEvent
                                title={e.title}
                                start={e.start}
                                end={e.end}
                                type={e.type}
                                status={e.status}
                                location={e.location}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Drawer for event details */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Detalhe do agendamento</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            {selected && (
              <div className="space-y-4 h-full flex flex-col">
                <Divider.Root variant="solid-text">Data e Hora</Divider.Root>
                <div className="rounded-lg px-6 py-4 space-y-2">
                  <div className="text-title-h4 text-text-strong-950">
                    {selected.startTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' até '}
                    {selected.endTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {selected.startTime.toLocaleDateString(undefined, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
                <Divider.Root variant="solid-text">Convidado</Divider.Root>
                <div className="px-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-success-lighter text-success-base rounded-full size-10 flex items-center justify-center text-heading-sm">
                      {selected.organizer
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-paragraph-md text-text-strong-950">
                        {selected.organizer}
                      </div>
                      <div className="text-paragraph-sm text-text-sub-600">
                        {selected.organizer.toLowerCase().replace(/\s+/g, '')}
                        @gmail.com
                      </div>
                    </div>
                  </div>
                </div>
                <Divider.Root variant="solid-text">Convidado</Divider.Root>
                <div className="px-4 rounded-lg space-y-2">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="text-subheading-xs text-text-soft-400 uppercase">
                        ASSUNTO
                      </div>
                      <div className="text-paragraph-md text-text-strong-950">
                        {selected.title}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-subheading-xs text-text-soft-400 uppercase">
                        LOCAL
                      </div>
                      <div className="text-paragraph-md text-text-strong-950">
                        {selected.type === 'online' ? 'online' : 'inPerson'}
                      </div>
                      {selected.location && (
                        <div className="text-paragraph-sm text-text-sub-600 truncate">
                          {selected.location}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-subheading-xs text-text-soft-400 uppercase">
                        DESCRIÇÃO
                      </div>
                      <div className="text-paragraph-md text-text-strong-950">
                        Um e-mail com detalhes sobre a reunião foi enviado para
                        todos os participantes.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-end ">
                  <div className="bg-bg-weak-50 p-4 rounded-lg">
                    <div className="text-subheading-xs text-text-soft-400 uppercase">
                      PRECISA ALTERAR?
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button.Root
                        asChild
                        variant="error"
                        mode="stroke"
                        size="medium"
                        className="w-full"
                      >
                        <Link
                          href={`/booking/${selected.uid}?cancel=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Cancelar
                        </Link>
                      </Button.Root>
                      <Button.Root
                        asChild
                        variant="neutral"
                        mode="stroke"
                        size="medium"
                        className="w-full"
                      >
                        <Link href={`/reschedule/${selected.uid}`}>
                          Reagendar
                        </Link>
                      </Button.Root>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
};
