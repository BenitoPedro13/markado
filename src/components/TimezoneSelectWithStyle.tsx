'use client';

import {useState, useMemo, useCallback, useEffect} from 'react';
import type {ITimezoneOption, ITimezone} from 'react-timezone-select';
import {useTimezoneSelect} from 'react-timezone-select';
import {RiGlobalLine, RiInformationFill} from '@remixicon/react';
import * as Select from '@/components/align-ui/ui/select';
import {cn} from '@/utils/cn';
import {useTRPC} from '@/utils/trpc';
import {useQuery} from '@tanstack/react-query';
import {
  // filterBySearchText,
  addTimezonesToDropdown,
  handleOptionLabel
} from '@/lib/timezone';
import type {Timezones} from '@/lib/timezone';

import * as Hint from '@/components/align-ui/ui/hint';

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

export type TimezoneSelectWithStyleProps = {
  value?: string;
  onChange?: (timezone: string) => void;
  className?: string;
  labelStyle?: 'original' | 'altName' | 'abbrev';
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  autoDetect?: boolean;
};

export function TimezoneSelectWithStyle({
  value,
  onChange,
  className,
  labelStyle = 'original',
  placeholder = 'Select timezone',
  disabled = false,
  isLoading = false,
  autoDetect = true
}: TimezoneSelectWithStyleProps) {
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

  const {options, parseTimezone} = useTimezoneSelect({labelStyle});
  // Comment out search-related state
  // const [searchText, setSearchText] = useState('');
  // const [additionalTimezones, setAdditionalTimezones] = useState<Timezones>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [detectedTimezone, setDetectedTimezone] = useState<string>('');

  // Combine data from API with predefined options - memoize to prevent recalculation
  const allData = useMemo(
    () => [
      ...data.map(({city, timezone}) => ({label: city, timezone})),
      ...SELECT_SEARCH_DATA
    ],
    [data]
  );

  // Memoize the formatted timezone value to prevent recalculation on every render
  const formattedValue = useMemo(() => {
    if (!value) return placeholder;

    // Try to find a matching option from the predefined list
    const matchingOption = options.find((opt) => opt.value === value);
    if (matchingOption) return matchingOption.label;

    // If not found in predefined list, format it manually
    return value.replace(/_/g, ' ');
  }, [value, options, placeholder]);

  // Optimize the onChange handler with useCallback
  const handleValueChange = useCallback(
    (selectedValue: string) => {
      if (onChange) {
        // Directly use the selected value instead of parsing it again
        onChange(selectedValue);
      }
    },
    [onChange]
  );

  // Create a map to track unique timezone values to prevent duplicates
  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((option) => {
      if (seen.has(option.value)) {
        return false;
      }
      seen.add(option.value);
      return true;
    });
  }, [options]);

  // Detect user's timezone on component mount
  useEffect(() => {
    if (autoDetect && !value) {
      try {
        // Get the user's timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('Detected timezone:', userTimezone);
        setDetectedTimezone(userTimezone);

        // If no value is provided, set the detected timezone
        if (onChange) {
          onChange(userTimezone);
        }
      } catch (error) {
        console.error('Error detecting timezone:', error);
      }
    }
  }, [autoDetect, value, onChange]);

  // Update the current time every second
  useEffect(() => {
    const updateTime = () => {
      if (value) {
        try {
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', {
            timeZone: value,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          setCurrentTime(timeString);
        } catch (error) {
          console.error('Error formatting time:', error);
          setCurrentTime('');
        }
      }
    };

    // Update immediately
    updateTime();

    // Then update every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <Select.Root
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
        value={value}
      >
        <Select.Trigger
          className={cn(
            'flex items-center gap-1 border-none w-full',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RiGlobalLine size={20} color="var(--text-soft-400)" />
          <span className="text-text-sub-600 text-paragraph-sm">
            {formattedValue}
          </span>
        </Select.Trigger>
        <Select.Content>
          {isLoading || isPending ? (
            <div className="p-2 text-center text-text-sub-600">
              Loading timezones...
            </div>
          ) : (
            uniqueOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))
          )}
        </Select.Content>
      </Select.Root>

      {value && currentTime && (
        <Hint.Root>
          <Hint.Icon as={RiInformationFill} />
          Hora atual: {currentTime}
        </Hint.Root>
      )}
    </div>
  );
}

export default TimezoneSelectWithStyle;
