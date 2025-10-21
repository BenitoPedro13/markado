'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useState,
  JSX
} from 'react';
import type {
  ArrayPath,
  Control,
  ControllerRenderProps,
  FieldArrayWithId,
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFieldArrayRemove
} from 'react-hook-form';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch
} from 'react-hook-form';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';

import type { ConfigType } from '@/lib/dayjs';
import dayjs from '@/lib/dayjs';
import { defaultDayRange as DEFAULT_DAY_RANGE } from '@/lib/availability';
import { cn as classNames } from '@/utils/cn';
import { useLocale } from '@/hooks/use-locale';
import { weekdayNames } from '@/lib/weekday';
import { useMeQuery } from '@/hooks/use-me-query';

// Import AlignUI components
import {
  Root as Button,
  Icon as ButtonIcon
} from '@/components/align-ui/ui/button';
import { Root as Checkbox } from '@/components/align-ui/ui/checkbox';
import {
  Root as DropdownMenu,
  Trigger as DropdownMenuTrigger,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem
} from '@/components/align-ui/ui/dropdown';
import {
  Root as Select,
  Trigger as SelectTrigger,
  Content as SelectContent,
  Item as SelectItem,
  Value as SelectValue
} from '@/components/align-ui/ui/select';
import { Root as Switch } from '@/components/align-ui/ui/switch';
import { Text as SkeletonText } from '@/components/align-ui/ui/skeleton';

import { TimeRange } from '@/types/scheadule';
import { RiAddLine, RiDeleteBinLine, RiFileCopyFill } from '@remixicon/react';

export type { TimeRange };

export type ScheduleLabelsType = {
  addTime: string;
  copyTime: string;
  deleteTime: string;
};

export type FieldPathByValue<TFieldValues extends FieldValues, TValue> = {
  [Key in FieldPath<TFieldValues>]: FieldPathValue<
    TFieldValues,
    Key
  > extends TValue
  ? Key
  : never;
}[FieldPath<TFieldValues>];

export const ScheduleDay = <TFieldValues extends FieldValues>({
  name,
  weekday,
  control,
  CopyButton,
  timezone,
  disabled,
  labels,
  userTimeFormat,
  className
}: {
  name: ArrayPath<TFieldValues>;
  weekday: string;
  timezone: string;
  control: Control<TFieldValues>;
  CopyButton?: JSX.Element;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: number | null;
  className?: {
    scheduleDay?: string;
    dayRanges?: string;
    timeRangeField?: string;
    labelAndSwitchContainer?: string;
    scheduleContainer?: string;
  };
}) => {
  // Use useFieldArray to handle the array field
  const formContext = useFormContext<TFieldValues>();

  // Use the provided control or fall back to the form context
  const effectiveControl = control || formContext?.control;

  // If we don't have a valid control, we can't proceed
  if (!effectiveControl) {
    console.error('ScheduleDay: No form control available');
    return null;
  }

  const { fields, append, remove } = useFieldArray({
    control: effectiveControl,
    name
  });

  return (
    <div
      className={classNames(
        'flex w-full flex-col gap-4 last:mb-0 sm:flex-row sm:gap-6 sm:px-0',
        className?.scheduleDay
      )}
      data-testid={weekday}
    >
      {/* Label & switch container */}
      <div
        className={classNames(
          'flex h-10 items-center justify-between',
          className?.labelAndSwitchContainer
        )}
      >
        <div>
          <label className="text-sub-600 flex flex-row items-center space-x-2 rtl:space-x-reverse">
            <div>
              <Switch
                disabled={!fields || disabled}
                defaultChecked={fields && fields.length > 0}
                checked={fields && !!fields.length}
                data-testid={`${weekday}-switch`}
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    append(
                      DEFAULT_DAY_RANGE as TFieldValues[typeof name][number]
                    );
                  } else {
                    // Remove all fields
                    fields.forEach((_, index) => remove(index));
                  }
                }}
              />
            </div>
            <span className="inline-block min-w-[88px] w-[120px] text-sm capitalize">
              {weekday}
            </span>
          </label>
        </div>
      </div>
      <>
        {!fields && <SkeletonText className="ml-1 mt-2.5 h-6 w-48" />}
        {fields && fields.length > 0 && (
          <div className="flex sm:gap-2">
            <DayRanges
              timezone={timezone}
              userTimeFormat={userTimeFormat}
              labels={labels}
              control={effectiveControl}
              name={name}
              disabled={disabled}
              className={{
                dayRanges: className?.dayRanges,
                timeRangeField: className?.timeRangeField
              }}
            />
            {!disabled && CopyButton && (
              <div className="block">{CopyButton}</div>
            )}
          </div>
        )}
      </>
    </div>
  );
};

const CopyButton = ({
  getValuesFromDayRange,
  weekStart,
  labels
}: {
  getValuesFromDayRange: string;
  weekStart: number;
  labels?: ScheduleLabelsType;
}) => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const fieldArrayName = getValuesFromDayRange.substring(
    0,
    getValuesFromDayRange.lastIndexOf('.')
  );
  const { setValue, getValues } = useFormContext();
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {/* <Button
          className={classNames(
            'text-sub-600 hover:bg-white-0 border-soft-200 border',
            open &&
            'ring-brand-500 !bg-subtle outline-none ring-2 ring-offset-1'
          )}
          // data-testid="copy-button"
          type="button"
          variant="neutral"
          mode="ghost"
        >

        </Button> */}
        <Button
          className="text-sub-600"
          type="button"
          variant="neutral"
          mode="stroke"
          size="small"

        >
          <ButtonIcon as={RiFileCopyFill} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-[10px]">
        <CopyTimes
          weekStart={weekStart}
          disabled={parseInt(
            getValuesFromDayRange.replace(`${fieldArrayName}.`, ''),
            10
          )}
          onClick={(selected) => {
            selected.forEach((day) =>
              setValue(
                `${fieldArrayName}.${day}`,
                getValues(getValuesFromDayRange)
              )
            );
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Schedule = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, TimeRange[][]>
>(props: {
  name: TPath;
  control: Control<TFieldValues>;
  weekStart?: number;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat?: number | null;
  timezone?: string;
}) => {
  // const { timeFormat } = query.data || { timeFormat: null };
  // const { t } = useLocale();
  const formContext = useFormContext<TFieldValues>();

  // Use the provided control or fall back to the form context
  const effectiveControl = props.control || formContext?.control;

  const timezone = props.timezone || "America/Sao_Paulo";

  // If we don't have a valid control, we can't proceed
  if (!effectiveControl) {
    console.error('Schedule: No form control available');
    return null;
  }

  return (
    <ScheduleComponent
      userTimeFormat={null}
      {...props}
      control={effectiveControl}
      timezone={timezone}
    />
  );
};

export const ScheduleComponent = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, TimeRange[][]>
>({
  name,
  control,
  disabled,
  weekStart = 0,
  labels,
  userTimeFormat,
  timezone = 'America/Sao_Paulo',
  className
}: {
  name: TPath;
  control: Control<TFieldValues>;
  weekStart?: number;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: number | null;
  timezone?: string;
  className?: {
    schedule?: string;
    scheduleDay?: string;
    dayRanges?: string;
    timeRanges?: string;
    labelAndSwitchContainer?: string;
  };
}) => {
  const { locale, isLocaleReady } = useLocale();
  const formContext = useFormContext<TFieldValues>();

  // Use the provided control or fall back to the form context
  const effectiveControl = control || formContext?.control;

  // If we don't have a valid control, we can't proceed
  if (!effectiveControl) {
    console.error('ScheduleComponent: No form control available');
    return null;
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 md:p-2 sm:p-4 px-0',
        className?.schedule
      )}
    >
      {/* First iterate for each day */}
      {weekdayNames(isLocaleReady ? locale : 'pt', weekStart, 'long').map(
        (weekday, num) => {
          const weekdayIndex = (num + weekStart) % 7;
          const dayRangeName =
            `${name}.${weekdayIndex}` as ArrayPath<TFieldValues>;
          return (
            <ScheduleDay
              className={{
                scheduleDay: className?.scheduleDay,
                dayRanges: className?.dayRanges,
                timeRangeField: className?.timeRanges,
                labelAndSwitchContainer: className?.labelAndSwitchContainer
              }}
              userTimeFormat={userTimeFormat}
              labels={labels}
              disabled={disabled}
              name={dayRangeName}
              key={weekday}
              weekday={weekday}
              control={effectiveControl}
              timezone={timezone}
              CopyButton={
                <CopyButton
                  weekStart={weekStart}
                  labels={labels}
                  getValuesFromDayRange={dayRangeName}
                />
              }
            />
          );
        }
      )}
    </div>
  );
};

export const DayRanges = <TFieldValues extends FieldValues>({
  name,
  disabled,
  control,
  labels,
  userTimeFormat,
  timezone,
  className
}: {
  name: ArrayPath<TFieldValues>;
  control: Control<TFieldValues>;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: number | null;
  timezone?: string;
  className?: {
    dayRanges?: string;
    timeRangeField?: string;
  };
}) => {
  const { t } = useLocale();
  const formContext = useFormContext<TFieldValues>();

  // Use the provided control or fall back to the form context
  const effectiveControl = control || formContext?.control;

  // If we don't have a valid control, we can't proceed
  if (!effectiveControl) {
    console.error('DayRanges: No form control available');
    return null;
  }

  const { remove, fields, prepend, append } = useFieldArray({
    control: effectiveControl,
    name
  });

  if (!fields.length) return null;

  return (
    <div className={classNames('flex flex-col gap-2', className?.dayRanges)}>
      {fields.map((field, index: number) => (
        <Fragment key={field.id}>
          <div className="flex gap-1 last:mb-0 sm:gap-2">
            <Controller
              name={`${name}.${index}` as any}
              control={effectiveControl}
              render={({ field }) => {
                return (
                  <TimeRangeField
                    className={className?.timeRangeField}
                    userTimeFormat={userTimeFormat}
                    timezone={timezone}
                    {...field}
                  />
                );
              }}
            />
            {index === 0 && (
              <Button
                disabled={disabled}
                data-testid="add-time-availability"
                className="text-sub-600"
                type="button"
                variant="neutral"
                mode="stroke"
                size="small"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const slotRange: any = getDateSlotRange(
                    formContext?.getValues
                      ? formContext.getValues(
                        `${name}.${fields.length - 1}` as any
                      )
                      : undefined,
                    formContext?.getValues
                      ? formContext.getValues(`${name}.0` as any)
                      : undefined
                  );

                  if (slotRange?.append) {
                    append(slotRange.append);
                  }

                  if (slotRange?.prepend) {
                    prepend(slotRange.prepend);
                  }
                }}
              >
                <ButtonIcon as={RiAddLine} />
              </Button>
            )}
            {index !== 0 && (
              <RemoveTimeButton
                index={index}
                remove={remove}
                className="text-sub-600 border-none"
              />
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

const RemoveTimeButton = ({
  index,
  remove,
  disabled,
  className,
  labels
}: {
  index: number | number[];
  remove: UseFieldArrayRemove;
  className?: string;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
}) => {
  // const { t } = useLocale();
  return (
    <Button
      type="button"
      variant="neutral"
      mode="stroke"
      size="small"
      disabled={disabled}
      onClick={() => remove(index)}
      className={className}
    >
      <ButtonIcon as={RiDeleteBinLine} />
    </Button>
  );
};

const TimeRangeField = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    disabled?: boolean;
    userTimeFormat: number | null;
    timezone?: string;
  } & ControllerRenderProps
>(({
  className,
  value,
  onChange,
  disabled,
  userTimeFormat,
  timezone
}, ref) => {
  // this is a controlled component anyway given it uses LazySelect, so keep it RHF agnostic.

  // Ensure we have valid Date objects
  const startDate = value.start instanceof Date ? value.start : new Date(value.start);
  const endDate = value.end instanceof Date ? value.end : new Date(value.end);


  return (
    <div ref={ref} className={classNames('flex flex-row gap-2 sm:gap-3', className)}>
      <LazySelect
        userTimeFormat={userTimeFormat}
        timezone={timezone}
        className="block w-[90px] sm:w-[100px]"
        isDisabled={disabled}
        value={startDate}
        menuPlacement="bottom"
        onChange={(option: IOption) => {
          const newStart = new Date(option?.value as number);
          if (newStart >= endDate) {
            const newEnd = new Date(option?.value as number);
            newEnd.setMinutes(newEnd.getMinutes() + INCREMENT);
            onChange({ ...value, start: newStart, end: newEnd });
          } else {
            onChange({ ...value, start: newStart });
          }
        }}
      />
      <span className="text-strong-950 w-2 self-center"> - </span>
      <LazySelect
        userTimeFormat={userTimeFormat}
        timezone={timezone}
        className="block w-[90px] rounded-md sm:w-[100px]"
        isDisabled={disabled}
        value={endDate}
        min={startDate}
        menuPlacement="bottom"
        onChange={(option: IOption) => {
          onChange({ ...value, end: new Date(option?.value as number) });
        }}
      />
    </div>
  );
});

TimeRangeField.displayName = 'TimeRangeField';

const LazySelect = ({
  value,
  min,
  max,
  userTimeFormat,
  menuPlacement,
  onChange,
  timezone,
  ...props
}: {
  value: ConfigType;
  min?: ConfigType;
  max?: ConfigType;
  userTimeFormat: number | null;
  menuPlacement?: string;
  timezone?: string;
  onChange?: (option: IOption) => void;
  [key: string]: any;
}) => {
  // Lazy-loaded options, otherwise adding a field has a noticeable redraw delay.
  const { options, filter } = useOptions(userTimeFormat, timezone);

  // Convert the Date value to a timestamp for comparison
  const valueTimestamp = value instanceof Date ? value.getTime() : dayjs(value).toDate().valueOf();

  useEffect(() => {
    filter({ current: value });
  }, [filter, value]);

  return (
    <Select
      onOpenChange={(open: boolean) => {
        if (open) {
          if (min) filter({ offset: min });
          if (max) filter({ limit: max });
          if (!min && !max) filter({ offset: 0, limit: 0 });
        } else {
          filter({ current: value });
        }
      }}
      value={valueTimestamp.toString()}
      onValueChange={(newValue: string) => {
        if (onChange) {
          const option = options.find(
            (opt) => opt.value.toString() === newValue
          );
          if (option) {
            onChange(option);
          }
        }
      }}
      {...props}
    >
      <SelectTrigger className="flex w-[90px] sm:w-[100px]">
        <SelectValue>
          {
            options.find(
              (option) => option.value === valueTimestamp
            )?.label
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface IOption {
  readonly label: string;
  readonly value: number;
}

/**
 * Creates an array of times on a 15 minute interval from
 * 00:00:00 (Start of day) to
 * 23:45:00 (End of day with enough time for 15 min booking)
 */
/** Begin Time Increments For Select */
const INCREMENT = Number(process.env.NEXT_AVAILABILITY_SCHEDULE_INTERVAL) || 15;
const useOptions = (timeFormat: number | null, timezone: string = 'America/Sao_Paulo') => {
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);

  const options = useMemo(() => {
    // Create start and end times in user's timezone
    const start = dayjs().tz(timezone).startOf('day');
    const end = dayjs().tz(timezone).endOf('day');

    const options: IOption[] = [];
    for (
      let t = start;
      t.isBefore(end);
      t = t.add(
        INCREMENT + (!t.add(INCREMENT).isSame(t, 'day') ? -1 : 0),
        'minutes'
      )
    ) {
      options.push({
        value: t.toDate().valueOf(),
        label: t.format(timeFormat === 12 ? 'h:mma' : 'HH:mm')
      });
    }
    // allow 23:59
    options.push({
      value: end.toDate().valueOf(),
      label: end.format(timeFormat === 12 ? 'h:mma' : 'HH:mm')
    });
    return options;
  }, [timeFormat, timezone]);

  const filter = useCallback(
    ({
      offset,
      limit,
      current
    }: {
      offset?: ConfigType;
      limit?: ConfigType;
      current?: ConfigType;
    }) => {
      if (current) {
        // Convert current to a timestamp for comparison
        const currentTimestamp = current instanceof Date
          ? current.getTime()
          : dayjs(current).toDate().valueOf();

        const currentOption = options.find(
          (option) => option.value === currentTimestamp
        );
        if (currentOption) setFilteredOptions([currentOption]);
      } else
        setFilteredOptions(
          options.filter((option) => {
            const time = dayjs(option.value);
            return (
              (!limit || time.isBefore(limit)) &&
              (!offset || time.isAfter(offset))
            );
          })
        );
    },
    [options]
  );

  return { options: filteredOptions, filter };
};

const getDateSlotRange = (
  endField?: FieldArrayWithId,
  startField?: FieldArrayWithId
) => {
  const timezoneStartRange = dayjs(
    (startField as unknown as TimeRange).start
  ).utc();
  const nextRangeStart = dayjs((endField as unknown as TimeRange).end).utc();
  const nextRangeEnd =
    nextRangeStart.hour() === 23
      ? dayjs(nextRangeStart)
        .add(59, 'minutes')
        .add(59, 'seconds')
        .add(999, 'milliseconds')
      : dayjs(nextRangeStart).add(1, 'hour');

  const endOfDay = nextRangeStart.endOf('day');

  if (!nextRangeStart.isSame(endOfDay)) {
    return {
      append: {
        start: nextRangeStart.toDate(),
        end: nextRangeEnd.isAfter(endOfDay)
          ? endOfDay.toDate()
          : nextRangeEnd.toDate()
      }
    };
  }

  const previousRangeStart = dayjs(
    (startField as unknown as TimeRange).start
  ).subtract(1, 'hour');
  const startOfDay = timezoneStartRange.startOf('day');

  if (!timezoneStartRange.isSame(startOfDay)) {
    return {
      prepend: {
        start: previousRangeStart.isBefore(startOfDay)
          ? startOfDay.toDate()
          : previousRangeStart.toDate(),
        end: timezoneStartRange.toDate()
      }
    };
  }
};

const CopyTimes = ({
  disabled,
  onClick,
  onCancel,
  weekStart
}: {
  disabled: number;
  onClick: (selected: number[]) => void;
  onCancel: () => void;
  weekStart: number;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const { isLocaleReady, locale, t } = useLocale('Schedules');
  const itteratablesByKeyRef = useRef<(HTMLInputElement | HTMLButtonElement)[]>(
    []
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleKeyDown = (event: KeyboardEvent) => {
    const itteratables = itteratablesByKeyRef.current;
    const isActionRequired =
      event.key === 'Tab' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Enter';
    if (!isActionRequired || !itteratables.length) return;
    event.preventDefault();
    const currentFocused = document.activeElement as
      | HTMLInputElement
      | HTMLButtonElement;
    let currentIndex = itteratables.findIndex(
      (checkbox) => checkbox === currentFocused
    );
    if (event.key === 'Enter') {
      if (currentIndex === -1) return;
      currentFocused.click();
      return;
    }
    if (currentIndex === -1) {
      itteratables[0].focus();
    } else {
      // Move focus based on the arrow key pressed
      if (event.key === 'ArrowUp') {
        currentIndex =
          (currentIndex - 1 + itteratables.length) % itteratables.length;
      } else if (event.key === 'ArrowDown' || event.key === 'Tab') {
        currentIndex = (currentIndex + 1) % itteratables.length;
      }
      itteratables[currentIndex].focus();
    }
  };

  return (
    <div className="space-y-2 py-2">
      <div className="p-2">
        <p className="h6 text-emphasis pb-3 pl-1 text-xs font-medium uppercase">
          {t('copy_times_to')}
        </p>
        <ol className="space-y-2">
          <li key="select all">
            <label className="text-sub-600 flex w-full items-center justify-between">
              <span className="px-1">{t('select_all')}</span>
              <Checkbox
                // description=""
                value={t('select_all')}
                checked={selected.length === 7}
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    setSelected([0, 1, 2, 3, 4, 5, 6]);
                  } else {
                    setSelected([]);
                  }
                }}
                ref={(ref) => {
                  if (ref) {
                    itteratablesByKeyRef.current.push(ref as HTMLInputElement);
                  }
                }}
              />
            </label>
          </li>
          {weekdayNames(isLocaleReady ? locale : 'pt', weekStart).map(
            (weekday, num) => {
              const weekdayIndex = (num + weekStart) % 7;
              return (
                <li key={weekday}>
                  <label className="text-sub-600 flex w-full items-center justify-between">
                    <span className="px-1">{weekday}</span>
                    <Checkbox
                      // description=""
                      value={weekdayIndex}
                      checked={
                        selected.includes(weekdayIndex) ||
                        disabled === weekdayIndex
                      }
                      disabled={disabled === weekdayIndex}
                      onCheckedChange={(isChecked) => {
                        if (isChecked && !selected.includes(weekdayIndex)) {
                          setSelected(selected.concat([weekdayIndex]));
                        } else if (
                          !isChecked &&
                          selected.includes(weekdayIndex)
                        ) {
                          setSelected(
                            selected.filter((item) => item !== weekdayIndex)
                          );
                        }
                      }}
                      ref={(ref) => {
                        if (ref && disabled !== weekdayIndex) {
                          //we don't need to iterate over disabled elements
                          itteratablesByKeyRef.current.push(
                            ref as HTMLInputElement
                          );
                        }
                      }}
                    />
                  </label>
                </li>
              );
            }
          )}
        </ol>
      </div>
      <hr className="border-soft-200" />
      <div className="flex items-center space-x-2 px-2 rtl:space-x-reverse">
        <Button variant="neutral" mode="stroke" onClick={() => onCancel()}
          ref={(ref) => {
            if (ref) {
              itteratablesByKeyRef.current.push(ref as HTMLButtonElement);
            }
          }}>

          {t('cancel')}
        </Button>
        <FancyButton.Root variant="neutral" onClick={() => onClick(selected)}
          ref={(ref) => {
            if (ref) {
              itteratablesByKeyRef.current.push(ref as HTMLButtonElement);
            }
          }}>
          {/* <FancyButton.Icon as={RiAddLine} /> */}
          {t('apply')}
        </FancyButton.Root>
      </div>
    </div>
  );
};

export default Schedule;
