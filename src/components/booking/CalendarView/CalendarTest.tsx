import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import {RiArrowLeftSLine, RiArrowRightSLine} from '@remixicon/react';
import * as Button from '@/components/align-ui/ui/button';

export const CalendarTest = () => {

  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  const HOUR_PX = 120; // height per hour row (px)

  const labelHour = (h: number) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };

  return (
    <div className="relative z-20 -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="w-full bg-bg-white-0 mt-4">
        {/* Scroll container: vertical to see all hours, horizontal on small screens */}
        <div className="flex max-h-[70vh] overflow-auto rounded-xl border border-stroke-soft-200">
          {/* navigate days button group + hours label column */}
          <div className="sticky -left-4 z-30 -ml-px w-[104px] shrink-0 overflow-hidden border-x border-stroke-soft-200 bg-bg-white-0 lg:left-0 lg:border-l-0">
            <div className="grid h-8 w-full shrink-0 grid-cols-2 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200">
              <button
                type="button"
                className="flex items-center justify-center bg-bg-white-0"
              >
                <RiArrowLeftSLine className="text-text-sub-600 w-5 h-5" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-bg-white-0"
              >
                <RiArrowRightSLine className="text-text-sub-600 w-5 h-5" />
              </button>
            </div>
            <div className="h-10" />
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-center" style={{ height: HOUR_PX }}>
                <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                  {labelHour(h)}
                </div>
              </div>
            ))}
            <div className="h-10" />
          </div>
          {/* week days label header + main grid */}
          <div>
            {/* week days label header */}
            <div className="sticky top-0 z-20 overflow-hidden rounded-tr-xl bg-bg-white-0">
              <header className="flex divide-x divide-stroke-soft-200">
                <div className="grid w-full auto-cols-[200px] grid-flow-col divide-x divide-stroke-soft-200">
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    03 SUN
                  </div>
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    04 MON
                  </div>
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    05 TUE
                  </div>
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    06 WED
                  </div>
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    07 THU
                  </div>
                  <div className="flex h-8 items-center justify-center border-b border-stroke-soft-200 bg-bg-weak-50 text-center text-label-xs text-text-soft-400">
                    08 FRI
                  </div>
                </div>
              </header>
            </div>
            <div className="grid w-full content-start items-start">
              {/* main grid */}
              <div className="grid w-full auto-cols-[200px] grid-flow-col divide-x divide-stroke-soft-200 [grid-area:1/1]">
                {[0,1,2,3,4,5].map((day) => (
                  <div key={day} className="grid divide-y divide-stroke-soft-200">
                    <div className="h-10" />
                    {HOURS.map((h) => (
                      <div key={h} style={{ height: HOUR_PX }} />
                    ))}
                    <div className="h-10" />
                  </div>
                ))}
              </div>
                {/* booking cards + disabled hours overlay */}
              <div
                className="grid w-full auto-cols-[200px] grid-flow-col gap-y-px [grid-area:1/1]"
                style={{ gridTemplateRows: `40px repeat(24, ${HOUR_PX}px) 40px` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
