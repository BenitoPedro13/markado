import React, { useState, ChangeEvent, useEffect } from 'react';
import { 
  Root as DrawerRoot,
  Content as DrawerContent,
  Header as DrawerHeader,
  Title as DrawerTitle,
  Body as DrawerBody,
  Footer as DrawerFooter,
  Close as DrawerClose,
} from '@/components/align-ui/ui/drawer';
import { 
  Root as ButtonRoot,
  Icon as ButtonIcon 
} from '@/components/align-ui/ui/button';
import { 
  Root as InputRoot, 
  Wrapper as InputWrapper, 
  Input 
} from '@/components/align-ui/ui/input';
import { CalendarEvent } from './types';
import { addHours, format } from 'date-fns';
import { 
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiVideoAddLine,
  RiUserAddLine,
  RiNotification4Line,
  RiRepeatLine,
  RiMore2Fill,
  RiGlobalLine
} from '@remixicon/react';
import { TimezoneSelectWithStyle } from '@/components/TimezoneSelectWithStyle';
import { convertDateToTimezone, formatDateInTimezone } from '@/utils/timezone';

interface EventCreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  initialDate: Date;
  event?: CalendarEvent;
}

const eventColors = [
  '#4285F4', // Blue
  '#34A853', // Green
  '#A142F4', // Purple
  '#FBBC05', // Yellow
  '#EA4335', // Red
];

export function EventCreationDrawer({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  event
}: EventCreationDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(addHours(initialDate, 1));
  const [selectedColor, setSelectedColor] = useState(eventColors[0]);
  const [isAllDay, setIsAllDay] = useState(false);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Reset form when drawer opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      setTitle(event?.title ?? '');
      setDescription(event?.description ?? '');
      setStartDate(event?.start ?? initialDate);
      setEndDate(event?.end ?? addHours(initialDate, 1));
      setSelectedColor(event?.color ?? eventColors[0]);
      setIsAllDay(event?.allDay ?? false);
      setTimeZone(event?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [isOpen, event, initialDate]);

  // Handle timezone change
  const handleTimezoneChange = (newTimeZone: string) => {
    if (timeZone === newTimeZone) return;

    // Convert start and end dates to the new timezone
    const newStartDate = convertDateToTimezone(startDate, timeZone, newTimeZone);
    const newEndDate = convertDateToTimezone(endDate, timeZone, newTimeZone);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setTimeZone(newTimeZone);
  };

  // Format date/time values in the current timezone
  const getFormattedDate = (date: Date) => {
    return format(convertDateToTimezone(date, 'UTC', timeZone), 'yyyy-MM-dd');
  };

  const getFormattedTime = (date: Date) => {
    return format(convertDateToTimezone(date, 'UTC', timeZone), 'HH:mm');
  };

  // Update handlers to consider timezone
  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDate = new Date(startDate);
    newDate.setFullYear(year, month - 1, day);
    
    // Convert the new date to the current timezone
    const tzNewDate = convertDateToTimezone(newDate, 'UTC', timeZone);
    setStartDate(tzNewDate);
    
    // If end date is before new start date, update it
    if (endDate < tzNewDate) {
      setEndDate(addHours(tzNewDate, 1));
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(startDate);
    newDate.setHours(hours, minutes);
    
    // Convert the new date to the current timezone
    const tzNewDate = convertDateToTimezone(newDate, 'UTC', timeZone);
    setStartDate(tzNewDate);
    
    // If end date is before new start date, update it
    if (endDate < tzNewDate) {
      setEndDate(addHours(tzNewDate, 1));
    }
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDate = new Date(endDate);
    newDate.setFullYear(year, month - 1, day);
    
    // Convert the new date to the current timezone
    const tzNewDate = convertDateToTimezone(newDate, 'UTC', timeZone);
    setEndDate(tzNewDate);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(endDate);
    newDate.setHours(hours, minutes);
    
    // Convert the new date to the current timezone
    const tzNewDate = convertDateToTimezone(newDate, 'UTC', timeZone);
    setEndDate(tzNewDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure end date is not before start date
    const finalEndDate = endDate < startDate ? startDate : endDate;
    
    onSave({
      id: event?.id ?? Math.random().toString(36).substr(2, 9),
      title,
      description,
      start: startDate,
      end: finalEndDate,
      color: selectedColor,
      allDay: isAllDay,
      timeZone,
    });
    onClose();
  };

  return (
    <DrawerRoot open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <DrawerHeader className="border-b">
            <DrawerTitle>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add title"
                className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-gray-400"
                required
              />
            </DrawerTitle>
            <DrawerClose onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </DrawerClose>
          </DrawerHeader>

          <DrawerBody className="flex-1 space-y-6 overflow-y-auto p-4">
            {/* Date and Time Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex w-5 items-center justify-center">
                  <RiCalendarLine className="text-gray-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      value={getFormattedDate(startDate)}
                      onChange={handleStartDateChange}
                      className="rounded-lg border border-gray-200 px-3 py-1.5"
                    />
                    {!isAllDay && (
                      <input
                        type="time"
                        value={getFormattedTime(startDate)}
                        onChange={handleStartTimeChange}
                        className="rounded-lg border border-gray-200 px-3 py-1.5"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      value={getFormattedDate(endDate)}
                      onChange={handleEndDateChange}
                      className="rounded-lg border border-gray-200 px-3 py-1.5"
                    />
                    {!isAllDay && (
                      <input
                        type="time"
                        value={getFormattedTime(endDate)}
                        onChange={handleEndTimeChange}
                        className="rounded-lg border border-gray-200 px-3 py-1.5"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allDay" className="text-sm">All day</label>
                </div>
              </div>

              {/* Timezone Selection */}
              {!isAllDay && (
                <div className="flex items-center gap-4">
                  <div className="flex w-5 items-center justify-center">
                    <RiGlobalLine className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <TimezoneSelectWithStyle
                      value={timeZone}
                      onChange={handleTimezoneChange}
                      className="w-full"
                      labelStyle="original"
                      placeholder="Select timezone"
                      autoDetect={true}
                    />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pl-9">
                <ButtonRoot variant="neutral" mode="stroke" className="gap-2">
                  <ButtonIcon as={RiRepeatLine} />
                  Does not repeat
                </ButtonRoot>
                <ButtonRoot variant="neutral" mode="stroke">
                  <ButtonIcon as={RiMore2Fill} />
                </ButtonRoot>
              </div>
            </div>

            {/* Add Video Meeting */}
            <div className="flex items-center gap-4">
              <div className="flex w-5 items-center justify-center">
                <RiVideoAddLine className="text-gray-400" />
              </div>
              <ButtonRoot variant="neutral" mode="stroke" className="flex-1 justify-start">
                Add Google Meet video conferencing
              </ButtonRoot>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="flex w-5 items-center justify-center">
                <RiMapPinLine className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Add location"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 pl-9">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                rows={3}
              />
            </div>

            {/* Add Guests */}
            <div className="flex items-center gap-4">
              <div className="flex w-5 items-center justify-center">
                <RiUserAddLine className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Add guests"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5"
              />
            </div>

            {/* Notification */}
            <div className="flex items-center gap-4">
              <div className="flex w-5 items-center justify-center">
                <RiNotification4Line className="text-gray-400" />
              </div>
              <ButtonRoot variant="neutral" mode="stroke" className="flex-1 justify-start">
                30 minutes before
              </ButtonRoot>
            </div>

            {/* Color Selection */}
            <div className="flex items-center gap-4 pl-9">
              <div className="flex gap-1">
                {eventColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-6 w-6 rounded-full ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter className="border-t">
            <div className="flex w-full items-center justify-between">
              {event && onDelete ? (
                <ButtonRoot
                  type="button"
                  variant="primary"
                  mode="filled"
                  onClick={() => {
                    onDelete(event.id);
                    onClose();
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </ButtonRoot>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <ButtonRoot
                  type="button"
                  variant="neutral"
                  mode="stroke"
                  onClick={onClose}
                >
                  Cancel
                </ButtonRoot>
                <ButtonRoot
                  type="submit"
                  variant="primary"
                  mode="filled"
                >
                  Save
                </ButtonRoot>
              </div>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </DrawerRoot>
  );
} 