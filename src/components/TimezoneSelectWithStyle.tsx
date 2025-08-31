'use client';

import {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {useTimezoneSelect} from 'react-timezone-select';
import {RiGlobalLine, RiInformationFill} from '@remixicon/react';
import * as Select from '@/components/align-ui/ui/select';
import * as Hint from '@/components/align-ui/ui/hint';
import {cn} from '@/utils/cn';

import type {Timezones} from '@/lib/timezone';
// import {useTRPC} from '@/utils/trpc';
// import {useQuery} from '@tanstack/react-query';

// const SELECT_SEARCH_DATA: Timezones = [
//   {label: 'San Francisco', timezone: 'America/Los_Angeles'},
//   {label: 'Sao Francisco do Sul', timezone: 'America/Sao_Paulo'},
//   {label: 'San Francisco de Macoris', timezone: 'America/Santo_Domingo'},
//   {label: 'San Francisco Gotera', timezone: 'America/El_Salvador'},
//   {label: 'Eastern Time - US & Canada', timezone: 'America/New_York'},
//   {label: 'Pacific Time - US & Canada', timezone: 'America/Los_Angeles'},
//   {label: 'Central Time - US & Canada', timezone: 'America/Chicago'},
//   {label: 'Mountain Time - US & Canada', timezone: 'America/Denver'},
//   {label: 'Atlantic Time - Canada', timezone: 'America/Halifax'},
//   {label: 'Eastern European Time', timezone: 'Europe/Bucharest'},
//   {label: 'Central European Time', timezone: 'Europe/Berlin'},
//   {label: 'Western European Time', timezone: 'Europe/London'},
//   {label: 'Australian Eastern Time', timezone: 'Australia/Sydney'},
//   {label: 'Japan Standard Time', timezone: 'Asia/Tokyo'},
//   {label: 'India Standard Time', timezone: 'Asia/Kolkata'},
//   {label: 'Gulf Standard Time', timezone: 'Asia/Dubai'},
//   {label: 'South Africa Standard Time', timezone: 'Africa/Johannesburg'},
//   {label: 'Brazil Time', timezone: 'America/Sao_Paulo'},
//   {label: 'Hawaii-Aleutian Standard Time', timezone: 'Pacific/Honolulu'}
// ];

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
  name?: string;
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
  variant = 'default',
  name = 'timeZone'
}: TimezoneSelectWithStyleProps) {
  const {options, parseTimezone} = useTimezoneSelect({labelStyle});
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(
    value || defaultValue || undefined
  );

  const isDetectingRef = useRef(false);
  const detectionAttemptedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    isDetectingRef.current = false;
    detectionAttemptedRef.current = false;
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);


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
      
      // Don't allow empty values
      if (!newValue || newValue.trim() === '') {
        return;
      }
      
      if (newValue === selectedTimezone) {
        return;
      }
      
      setSelectedTimezone(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, selectedTimezone]
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


  useEffect(() => {
    if (value && !autoDetect) {
      setSelectedTimezone(value);
    }
  }, [value, autoDetect]);

  // Timezone detection - run only once on mount
  useEffect(() => {
    if (isDetectingRef.current || detectionAttemptedRef.current) {
      return;
    }

    if (!autoDetect) {
      return;
    }

    isDetectingRef.current = true;
    detectionAttemptedRef.current = true;
    setIsDetecting(true);

    // Execute detection with a small delay to ensure it runs after initialization
    setTimeout(() => {
      if (!mountedRef.current) return;
      
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

       if (userTimezone && userTimezone.trim() !== '') {
         setSelectedTimezone(userTimezone);
         if (onChange) {
           onChange(userTimezone);
         }
       } else {
         console.log('❌ Invalid timezone detected, keeping current value');
       }

      if (mountedRef.current) {
        isDetectingRef.current = false;
        setIsDetecting(false);
      }
    }, 100);
  }, []); // Empty dependency array - run only once on mount

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
          name={name}
        >
        <Select.Trigger
          className={cn(
            'flex items-center gap-1 border-none w-full overflow-hidden',
            (disabled || isDetecting) && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <RiGlobalLine size={20} color="var(--text-soft-400)" className="flex-shrink-0" />
          <span className="text-text-sub-600 text-paragraph-sm truncate min-w-0">
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
