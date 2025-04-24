import { useState } from "react";
import { useForm } from "react-hook-form";

import type {Dayjs} from '@/lib/dayjs';
import dayjs from "@/lib/dayjs";
import {cn} from '@/utils/cn';

import { yyyymmdd } from "@/lib/date-fns";
import { useLocale } from "@/hooks/use-locale";
import type { WorkingHours } from "@/types/scheadule";
import { enUS, ptBR } from 'date-fns/locale';

import { Calendar } from "../../align-ui/ui/datepicker";
import { Root as ButtonRoot } from "../../align-ui/ui/button";
import { Root as SwitchRoot } from "../../align-ui/ui/switch";
import { 
  Root as DialogRoot,
  Content as DialogContent,
  Trigger as DialogTrigger,
  Header as DialogHeader,
  Close as DialogClose
} from "../../align-ui/ui/modal";
import type { TimeRange } from "./Schedule";
import { DayRanges } from "./Schedule";
import { useNotification } from "@/hooks/use-notification";

// Map locale strings to date-fns locale objects
const getDateFnsLocale = (localeString: string) => {
  switch (localeString) {
    case 'pt':
      return ptBR;
    case 'en':
    default:
      return enUS;
  }
};

const DateOverrideForm = ({
  value,
  workingHours,
  excludedDates,
  onChange,
  userTimeFormat,
  weekStart,
}: {
  workingHours?: WorkingHours[];
  onChange: (newValue: TimeRange[]) => void;
  excludedDates: string[];
  value?: TimeRange[];
  onClose?: () => void;
  userTimeFormat: number | null;
  weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const [browsingDate, setBrowsingDate] = useState<Dayjs>();
  const {t, locale, isLocaleReady} = useLocale('Schedules');
  const { notification } = useNotification();
  const [datesUnavailable, setDatesUnavailable] = useState(
    value &&
      value[0].start.getUTCHours() === 0 &&
      value[0].start.getUTCMinutes() === 0 &&
      value[0].end.getUTCHours() === 0 &&
      value[0].end.getUTCMinutes() === 0
  );

  const [selectedDates, setSelectedDates] = useState<Dayjs[]>(value ? [dayjs.utc(value[0].start)] : []);

  const onDateChange = (newDate: Dayjs) => {
    // If clicking on a selected date unselect it
    if (selectedDates.some((date) => yyyymmdd(date) === yyyymmdd(newDate))) {
      setSelectedDates(selectedDates.filter((date) => yyyymmdd(date) !== yyyymmdd(newDate)));
      return;
    }

    // If it's not editing we can allow multiple select
    if (!value) {
      setSelectedDates((prev) => [...prev, newDate]);
      return;
    }

    setSelectedDates([newDate]);
  };

  const defaultRanges = (workingHours || []).reduce((dayRanges: TimeRange[], workingHour) => {
    if (selectedDates[0] && workingHour.days.includes(selectedDates[0].day())) {
      dayRanges.push({
        start: dayjs.utc().startOf("day").add(workingHour.startTime, "minute").toDate(),
        end: dayjs.utc().startOf("day").add(workingHour.endTime, "minute").toDate(),
      });
    }
    return dayRanges;
  }, []);
  // DayRanges does not support empty state, add 9-5 as a default
  if (!defaultRanges.length) {
    defaultRanges.push({
      start: dayjs.utc().startOf("day").add(540, "minute").toDate(),
      end: dayjs.utc().startOf("day").add(1020, "minute").toDate(),
    });
  }

  const form = useForm({
    values: {
      range:
        value && value[0].start.valueOf() !== value[0].end.valueOf()
          ? value.map((range) => ({
              start: new Date(
                dayjs
                  .utc()
                  .hour(range.start.getUTCHours())
                  .minute(range.start.getUTCMinutes())
                  .second(0)
                  .format()
              ),
              end: new Date(
                dayjs.utc().hour(range.end.getUTCHours()).minute(range.end.getUTCMinutes()).second(0).format()
              ),
            }))
          : defaultRanges,
    },
  });

  const handleSubmit = (values: any) => {
    const datesInRanges: TimeRange[] = [];

    if (selectedDates.length === 0) return;

    if (datesUnavailable) {
      selectedDates.map((date) => {
        datesInRanges.push({
          start: date.utc(true).startOf("day").toDate(),
          end: date.utc(true).startOf("day").toDate(),
        });
      });
    } else {
      selectedDates.map((date) => {
        values.range.map((item: any) => {
          datesInRanges.push({
            start: date
              .hour(item.start.getUTCHours())
              .minute(item.start.getUTCMinutes())
              .utc(true)
              .toDate(),
            end: date.hour(item.end.getUTCHours()).minute(item.end.getUTCMinutes()).utc(true).toDate(),
          });
        });
      });
    }

    onChange(datesInRanges);
    setSelectedDates([]);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="p-6 sm:flex sm:p-0 xl:flex-row">
      <div className="sm:border-subtle w-full sm:border-r sm:p-4 sm:pr-6 md:p-8">
        <DialogHeader title={t("date_overrides_dialog_title")} />
        <Calendar
          mode="single"
          selected={selectedDates.length > 0 ? selectedDates[0].toDate() : undefined}
          onSelect={(day) => {
            if (day) onDateChange(dayjs(day));
          }}
          onMonthChange={(newMonth) => {
            setBrowsingDate(dayjs(newMonth));
          }}
          month={browsingDate?.toDate()}
          locale={isLocaleReady ? getDateFnsLocale(locale) : ptBR}
          disabled={excludedDates.map(date => new Date(date))}
          weekStartsOn={weekStart}
        />
      </div>
      <div className="relative mt-8 flex w-full flex-col sm:mt-0 sm:p-4 md:p-8">
        {selectedDates[0] ? (
          <>
            <div className="mb-4 flex-grow space-y-4">
              <p className="text-medium text-emphasis text-sm">{t("date_overrides_dialog_which_hours")}</p>
              <div>
                {datesUnavailable ? (
                  <p className="text-subtle border-default rounded border p-2 text-sm">
                    {t("unavailable")}
                  </p>
                ) : (
                  <DayRanges 
                    name="range" 
                    userTimeFormat={userTimeFormat} 
                    control={form.control}
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <SwitchRoot
                  checked={datesUnavailable}
                  onCheckedChange={setDatesUnavailable}
                  data-testid="date-override-mark-unavailable"
                />
                <span>{t("date_overrides_mark_all_day_unavailable_one")}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-row-reverse sm:mt-0">
              <ButtonRoot
                className="ml-2"
                variant="primary"
                type="submit"
                onClick={() => {
                  notification({
                    title: t("date_successfully_added"),
                    variant: "filled",
                    color: "green"
                  });
                }}
                disabled={selectedDates.length === 0}
                data-testid="add-override-submit-btn">
                {value ? t("date_overrides_update_btn") : t("date_overrides_add_btn")}
              </ButtonRoot>
              <DialogClose />
            </div>
          </>
        ) : (
          <div className="bottom-7 right-8 flex flex-row-reverse sm:absolute">
            <DialogClose />
          </div>
        )}
      </div>
    </form>
  );
};

const DateOverrideInputDialog = ({
  Trigger,
  excludedDates = [],
  userTimeFormat,
  weekStart = 0,
  className,
  ...passThroughProps
}: {
  workingHours: WorkingHours[];
  excludedDates?: string[];
  Trigger: React.ReactNode;
  onChange: (newValue: TimeRange[]) => void;
  value?: TimeRange[];
  userTimeFormat: number | null;
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>

      <DialogContent className={cn("p-0", className)}>
        <DateOverrideForm
          excludedDates={excludedDates}
          weekStart={weekStart}
          {...passThroughProps}
          onClose={() => setOpen(false)}
          userTimeFormat={userTimeFormat}
        />
      </DialogContent>
    </DialogRoot>
  );
};

export default DateOverrideInputDialog;
