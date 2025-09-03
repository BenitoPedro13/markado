import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import {RiArrowLeftSLine, RiArrowRightSLine} from '@remixicon/react';
import * as Button from '@/components/align-ui/ui/button';
export const CalendarTest = () => {
  return (
    <div className="relative z-20 -mx-4 overflow-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="w-fit bg-bg-white-0 lg:w-full mt-4">
        <div className="flex overflow-clip rounded-xl border border-stroke-soft-200 lg:overflow-auto">
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
            <div className="h-10"></div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                6 AM
              </div>
            </div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                7 AM
              </div>
            </div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                8 AM
              </div>
            </div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                9 AM
              </div>
            </div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                10 AM
              </div>
            </div>
            <div className="row-span-4 flex h-[120px] items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                11 AM
              </div>
            </div>
            <div className="flex h-10 items-start justify-center">
              <div className="-translate-y-1/2 text-center text-label-sm text-text-sub-600">
                12 PM
              </div>
            </div>
          </div>
          {/* week days label header + main grid */}
          <div>
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
              <div className="grid w-full auto-cols-[200px] grid-flow-col divide-x divide-stroke-soft-200 [grid-area:1/1]">
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
                <div className="grid divide-y divide-stroke-soft-200">
                  <div className="h-10"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="row-span-4 h-[120px]"></div>
                  <div className="h-10"></div>
                </div>
              </div>
              <div
                className="grid w-full auto-cols-[200px] grid-flow-col gap-y-px [grid-area:1/1]"
                style={{ gridTemplateRows: '40px repeat(24, 29px) 39px' }}
              >
                <div
                  className="col-span-1 grid gap-2 px-2 py-1 pt-2 pb-2"
                  style={{ gridRow: '2 / 22', gridColumnStart: 6 }}
                >
                  <div className="calendar-disabled-hour -m-2 min-w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
