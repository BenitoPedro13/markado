'use client';

import {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {useTimezoneSelect} from 'react-timezone-select';
import {RiGlobalLine, RiInformationFill} from '@remixicon/react';
import * as Select from '@/components/align-ui/ui/select';
import * as Hint from '@/components/align-ui/ui/hint';
import {cn} from '@/utils/cn';

import type {Timezones} from '@/lib/timezone';
import { useTRPC } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';

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
    trpc.cityTimezones.list.queryOptions(undefined, {
      trpc: {
        context: {
          skipBatch: true
        }
      }
    })
  );

  const {options, parseTimezone} = useTimezoneSelect({labelStyle});
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(value);


  // Memoize the formatted timezone value to prevent recalculation on every render
  const formattedValue = useMemo(() => {
    if (!selectedTimezone) return placeholder;
    
    // Try to find a matching option from the predefined list
    const matchingOption = options.find((opt) => opt.value === selectedTimezone);
    if (matchingOption) return matchingOption.label;
    
    // If not found in predefined list, format it manually
    return selectedTimezone.replace(/_/g, ' ');
  }, [selectedTimezone, options, placeholder]);

  // Handle value changes from the Select component
  const handleValueChange = useCallback(
    (newValue: string) => {
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

  // Initialize with the provided value
  useEffect(() => {
    if (value) {
      setSelectedTimezone(value);
    }
  }, [value]);

  // Detect user's timezone on component mount - only once
  useEffect(() => {
    let isMounted = true;
    
    if (autoDetect && !selectedTimezone) {
      setIsDetecting(true);
      
      // Simulate a brief loading state
      const timer = setTimeout(() => {
        if (!isMounted) return;
        
        try {
          // Get the user's timezone
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          // Set the detected timezone
          setSelectedTimezone(userTimezone);
          
          // Notify parent component
          if (onChange) {
            onChange(userTimezone);
          }
        } catch (error) {
          console.error('Error detecting timezone:', error);
          // Reset detecting state even if there's an error
          if (isMounted) {
            setIsDetecting(false);
          }
        } finally {
          if (isMounted) {
            setIsDetecting(false);
          }
        }
      }, 1000); // 1 second delay
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [autoDetect, selectedTimezone, onChange]);

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

    // Then update every second
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
      >
        <Select.Trigger
          className={cn(
            'flex items-center gap-1 border-none w-full',
            (disabled || isDetecting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RiGlobalLine size={20} color="var(--text-soft-400)" />
          <span className="text-text-sub-600 text-paragraph-sm">
            {isDetecting ? 'Detecting timezone...' : formattedValue}
          </span>
        </Select.Trigger>
        <Select.Content>
          {isLoading || isPending || isDetecting ? (
            <div className="p-2 text-center text-text-sub-600">
              {isDetecting ? 'Detecting your timezone...' : 'Loading timezones...'}
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
      
      {selectedTimezone && currentTime && (
        <Hint.Root>
          <Hint.Icon as={RiInformationFill} />
          Hora atual: {currentTime}
        </Hint.Root>
      )}
    </div>
  );
}

export default TimezoneSelectWithStyle;

