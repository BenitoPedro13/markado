'use client';

import {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {useTimezoneSelect} from 'react-timezone-select';
import {RiGlobalLine, RiInformationFill} from '@remixicon/react';
import * as Select from '@/components/align-ui/ui/select';
import * as Hint from '@/components/align-ui/ui/hint';
import {cn} from '@/utils/cn';

import type {Timezones} from '@/lib/timezone';
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

export type TimezoneSelectWithStyleProps = {
  value?: string;
  onChange?: (timezone: string) => void;
  className?: string;
  labelStyle?: 'original' | 'altName' | 'abbrev';
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  isLoading?: boolean;
  autoDetect?: boolean;
  hint?: boolean;
  variant?: 'default' | 'compact' | 'compactForInput' | 'inline';
};

export function TimezoneSelectWithStyle({
  value,
  onChange,
  className,
  labelStyle = 'original',
  placeholder = 'Select timezone',
  disabled = false,
  hint = true,
  isLoading = false,
  autoDetect = true,
  defaultValue = '',
  variant = 'default'
}: TimezoneSelectWithStyleProps) {
  const {options, parseTimezone} = useTimezoneSelect({labelStyle});
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(
    value
  );

  // Use refs to track state without triggering renders
  const isDetectingRef = useRef(false);
  const detectionAttemptedRef = useRef(false);
  const mountedRef = useRef(true);

  // Memoize the formatted timezone value to prevent recalculation on every render
  const formattedValue = useMemo(() => {
    if (!selectedTimezone) return placeholder;

    // Try to find a matching option from the predefined list
    const matchingOption = options.find(
      (opt) => opt.value === selectedTimezone
    );
    if (matchingOption) return matchingOption.label;

    // If not found in predefined list, format it manually
    return selectedTimezone.replace(/_/g, ' ');
  }, [selectedTimezone, options, placeholder]);

  // Handle value changes from the Select component
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue === selectedTimezone) return;
      setSelectedTimezone(newValue);
      if (onChange) {
        onChange(newValue);
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

    // Function to detect timezone - defined outside to avoid closure issues
    const detectTimezone = useCallback(() => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setSelectedTimezone(userTimezone);
        if (onChange) {
          onChange(userTimezone);
        }

        if (mountedRef.current) {
          isDetectingRef.current = false;
          setIsDetecting(false);
        }
    }, [onChange, mountedRef, isDetecting]);

  // One-time timezone detection
  useEffect(() => {
    // Only run once and only if auto-detection is enabled and no timezone is selected
    if (
      detectionAttemptedRef.current ||
      !autoDetect ||
      selectedTimezone ||
      isDetectingRef.current
    ) {
      return;
    }

    // Mark that we've attempted detection to prevent re-runs
    detectionAttemptedRef.current = true;
    isDetectingRef.current = true;
    setIsDetecting(true);

    // Set up the timeout first
    const timeoutId = setTimeout(() => {
      if (!mountedRef.current) return;

      // If we're still detecting, force completion
      if (isDetectingRef.current) {
        console.log('Timezone detection timed out');
        isDetectingRef.current = false;
        setIsDetecting(false);
      }
    }, 1500);

    // Execute detection
    detectTimezone();

    // Clean up function
    return () => {
      clearTimeout(timeoutId);
      // Handle component unmount
      mountedRef.current = false;
    };
  }, [detectTimezone]); // Empty dependency array - this effect runs exactly once on mount

  // Update the current time every second
  useEffect(() => {
    if (!selectedTimezone) return;
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          timeZone: selectedTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        setCurrentTime(timeString);
      } catch (error) {
        console.error('Error formatting time:', error);
        setCurrentTime('');
      }
    };

    // Update immediately
    updateTime();

    // Then update every minute
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [selectedTimezone]);

  return (
    <div className="flex flex-col gap-1">
      <Select.Root
        onValueChange={handleValueChange}
        disabled={disabled || isLoading || isDetecting}
        value={selectedTimezone}
        defaultValue={defaultValue}
        variant={variant}
      >
        <Select.Trigger
          className={cn(
            'flex items-center gap-1 border-none w-full',
            (disabled || isDetecting) && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <RiGlobalLine size={20} color="var(--text-soft-400)" />
          <span className="text-text-sub-600 text-paragraph-sm">
            {isDetecting ? 'Detecting timezone...' : formattedValue}
          </span>
        </Select.Trigger>
        <Select.Content>
          {isLoading || isDetecting ? (
            <div className="p-2 text-center text-text-sub-600">
              {isDetecting
                ? 'Detecting your timezone...'
                : 'Loading timezones...'}
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

      {selectedTimezone && currentTime && hint && (
        <Hint.Root>
          <Hint.Icon as={RiInformationFill} />
          Hora atual: {currentTime}
        </Hint.Root>
      )}
    </div>
  );
}

export default TimezoneSelectWithStyle;
