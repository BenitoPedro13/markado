'use client';

import {useMemo, useState} from 'react';
import type {
  ITimezoneOption,
  ITimezone,
  Props as SelectProps
} from 'react-timezone-select';
import BaseSelect from 'react-timezone-select';

import {
  filterBySearchText,
  addTimezonesToDropdown,
  handleOptionLabel
} from '@/lib/timezone';

import type {Timezones} from '@/lib/timezone';

// import {trpc} from '~/trpc/client';

// import {getReactSelectProps} from '../select';
import {cn} from '@/utils/cn';
import {useTRPC} from '@/utils/trpc';
import {useQuery} from '@tanstack/react-query';

const SELECT_SEARCH_DATA: Timezones = [
  {label: 'San Francisco', timezone: 'America/Los_Angeles'},
  {label: 'Sao Francisco do Sul', timezone: 'America/Sao_Paulo'},
  {label: 'San Francisco de Macoris', timezone: 'America/Santo_Domingo'},
  {label: 'San Francisco Gotera', timezone: 'America/El_Salvador'},
  {label: 'Eastern Time - US & Canada', timezone: 'America/New_York'},
  {label: 'Pacific Time - US & Canada', timezone: 'America/Los_Angeles'},
  {label: 'Central Time - US & Canada', timezone: 'America/Chicago'},
  {label: 'Mountain Time - US & Canada', timezone: 'America/Denver'},
  {label: 'Atlantic Time - Canada', timezone: 'America/Halifax'},
  {label: 'Eastern European Time', timezone: 'Europe/Bucharest'},
  {label: 'Central European Time', timezone: 'Europe/Berlin'},
  {label: 'Western European Time', timezone: 'Europe/London'},
  {label: 'Australian Eastern Time', timezone: 'Australia/Sydney'},
  {label: 'Japan Standard Time', timezone: 'Asia/Tokyo'},
  {label: 'India Standard Time', timezone: 'Asia/Kolkata'},
  {label: 'Gulf Standard Time', timezone: 'Asia/Dubai'},
  {label: 'South Africa Standard Time', timezone: 'Africa/Johannesburg'},
  {label: 'Brazil Time', timezone: 'America/Sao_Paulo'},
  {label: 'Hawaii-Aleutian Standard Time', timezone: 'Pacific/Honolulu'}
];

export type TimezoneSelectProps = SelectProps & {
  variant?: 'default' | 'minimal';
  timezoneSelectCustomClassname?: string;
};
export function TimezoneSelect(props: TimezoneSelectProps) {
  const trpc = useTRPC();
  const {data = [], isPending} = useQuery(
    trpc.cityTimezones.queryOptions(undefined, {
      trpc: {
        context: {
          skipBatch: true
        }
      }
    })
  );

  return (
    <TimezoneSelectComponent
      data={data.map(({city, timezone}) => ({label: city, timezone}))}
      isPending={isPending}
      {...props}
    />
  );
}

export type TimezoneSelectComponentProps = SelectProps & {
  variant?: 'default' | 'minimal';
  isPending: boolean;
  data?: Timezones;
  timezoneSelectCustomClassname?: string;
};
export function TimezoneSelectComponent({
  className,
  classNames: timezoneClassNames,
  timezoneSelectCustomClassname,
  components,
  variant = 'default',
  isPending,
  value,
  ...props
}: TimezoneSelectComponentProps) {
  const data = [...(props.data || []), ...SELECT_SEARCH_DATA];
  /*
   * we support multiple timezones for the different labels
   * e.g. 'Sao Paulo' and 'Brazil Time' both being 'America/Sao_Paulo'
   * but react-timezone-select does not.
   *
   * We make sure to be able to search through both options, and flip the key/value on final display.
   */
  const [additionalTimezones, setAdditionalTimezones] = useState<Timezones>([]);
  const handleInputChange = (searchText: string) => {
    if (data) setAdditionalTimezones(filterBySearchText(searchText, data));
  };

  const reactSelectProps = useMemo(() => {
    return {
      components: components || {}
    };
  }, [components]);

  return (
    <BaseSelect
      value={value}
      className={`${className} ${timezoneSelectCustomClassname}`}
      aria-label="Timezone Select"
      isLoading={isPending}
      isDisabled={isPending}
      {...reactSelectProps}
      timezones={{
        ...(props.data ? addTimezonesToDropdown(data) : {}),
        ...addTimezonesToDropdown(additionalTimezones)
      }}
      onInputChange={handleInputChange}
      {...props}
      formatOptionLabel={(option) => (
        <p className="truncate">
          {(option as ITimezoneOption).value.replace(/_/g, ' ')}
        </p>
      )}
      getOptionLabel={(option) =>
        handleOptionLabel(option as ITimezoneOption, additionalTimezones)
      }
      classNames={{
        ...timezoneClassNames,
        input: (state) =>
          cn(
            'text-sub-600 h-6 md:max-w-[145px] max-w-[250px]',
            timezoneClassNames?.input && timezoneClassNames.input(state)
          ),
        option: (state) =>
          cn(
            'bg-white-0 flex !cursor-pointer justify-between py-2.5 px-3 rounded-none text-default ',
            state.isFocused && 'bg-subtle',
            state.isSelected && 'bg-emphasis',
            timezoneClassNames?.option && timezoneClassNames.option(state)
          ),
        placeholder: (state) => cn('text-muted', state.isFocused && 'hidden'),
        dropdownIndicator: () => 'text-sub-600',
        control: (state) =>
          cn(
            '!cursor-pointer',
            variant === 'default'
              ? 'px-3 py-2 bg-white-0 border-soft-200 !min-h-9 text-sm leading-4 placeholder:text-sm placeholder:font-normal focus-within:ring-2 focus-within:ring-emphasis hover:border-emphasis rounded-[10px] border gap-1'
              : 'text-sm gap-1',
            timezoneClassNames?.control && timezoneClassNames.control(state)
          ),
        singleValue: (state) =>
          cn(
            'text-sub-600 placeholder:text-muted',
            timezoneClassNames?.singleValue &&
              timezoneClassNames.singleValue(state)
          ),
        valueContainer: (state) =>
          cn(
            'text-sub-600 placeholder:text-muted flex gap-1',
            timezoneClassNames?.valueContainer &&
              timezoneClassNames.valueContainer(state)
          ),
        multiValue: (state) =>
          cn(
            'bg-subtle text-sub-600 rounded-[10px] py-1.5 px-2 flex items-center text-sm leading-none',
            timezoneClassNames?.multiValue &&
              timezoneClassNames.multiValue(state)
          ),
        menu: (state) =>
          cn(
            'rounded-[10px] bg-white-0 text-sm leading-4 text-default mt-1 border border-subtle',
            state.selectProps.menuIsOpen && 'shadow-dropdown', // Add box-shadow when menu is open
            timezoneClassNames?.menu && timezoneClassNames.menu(state)
          ),
        groupHeading: () =>
          'leading-none text-xs uppercase text-default pl-2.5 pt-4 pb-2',
        menuList: (state) =>
          cn(
            'scroll-bar scrollbar-track-w-20 rounded-[10px]',
            timezoneClassNames?.menuList && timezoneClassNames.menuList(state)
          ),
        indicatorsContainer: (state) =>
          cn(
            state.selectProps.menuIsOpen
              ? state.isMulti
                ? '[&>*:last-child]:rotate-180 [&>*:last-child]:transition-transform'
                : 'rotate-180 transition-transform'
              : 'text-default', // Woo it adds another SVG here on multi for some reason
            timezoneClassNames?.indicatorsContainer &&
              timezoneClassNames.indicatorsContainer(state)
          ),
        multiValueRemove: () => 'text-default py-auto ml-2',
        noOptionsMessage: () => 'h-12 py-2 flex items-center justify-center'
      }}
    />
  );
}

export type {ITimezone, ITimezoneOption};
