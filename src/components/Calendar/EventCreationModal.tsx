import React, { useState, ChangeEvent } from 'react';
import { 
  Root as ModalRoot, 
  Content as ModalContent, 
  Header as ModalHeader, 
  Title as ModalTitle, 
  Description as ModalDescription,
  Body as ModalBody,
  Footer as ModalFooter,
  Close as ModalClose
} from '@/components/align-ui/ui/modal';
import { 
  Root as ButtonRoot
} from '@/components/align-ui/ui/button';
import { 
  Root as InputRoot, 
  Wrapper as InputWrapper, 
  Input 
} from '@/components/align-ui/ui/input';
import { CalendarEvent } from './types';
import { addHours, format } from 'date-fns';
import { RiCloseLine, RiTimeLine, RiCalendarLine } from '@remixicon/react';

interface EventCreationModalProps {
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

export function EventCreationModal({
  onClose,
  onSave,
  onDelete,
  initialDate,
  event
}: EventCreationModalProps) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [startDate, setStartDate] = useState(event?.start ?? initialDate);
  const [endDate, setEndDate] = useState(event?.end ?? addHours(initialDate, 1));
  const [selectedColor, setSelectedColor] = useState(event?.color ?? eventColors[0]);
  const [isAllDay, setIsAllDay] = useState(event?.allDay ?? false);

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
    });
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(startDate);
    const [year, month, day] = e.target.value.split('-').map(Number);
    newDate.setFullYear(year, month - 1, day);
    setStartDate(newDate);
    
    // If end date is before new start date, update it
    if (endDate < newDate) {
      setEndDate(addHours(newDate, 1));
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(startDate);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setStartDate(newDate);
    
    // If end date is before new start date, update it
    if (endDate < newDate) {
      setEndDate(addHours(newDate, 1));
    }
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(endDate);
    const [year, month, day] = e.target.value.split('-').map(Number);
    newDate.setFullYear(year, month - 1, day);
    setEndDate(newDate);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(endDate);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setEndDate(newDate);
  };

  return (
    <ModalRoot open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>{event ? 'Edit Event' : 'Create Event'}</ModalTitle>
          <ModalDescription>
            Fill in the details for your event. Click save when you're done.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <InputRoot>
                  <InputWrapper>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      placeholder="Event title"
                      required
                    />
                  </InputWrapper>
                </InputRoot>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <InputRoot>
                  <InputWrapper>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      placeholder="Event description"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </InputWrapper>
                </InputRoot>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Date and Time
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span>All day</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500">Start</label>
                    <div className="flex gap-2">
                      <InputRoot className="flex-1">
                        <InputWrapper>
                          <div className="relative flex items-center">
                            <RiCalendarLine className="absolute left-3 text-gray-400" />
                            <input
                              type="date"
                              value={format(startDate, 'yyyy-MM-dd')}
                              onChange={handleStartDateChange}
                              className="pl-9 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </InputWrapper>
                      </InputRoot>
                      {!isAllDay && (
                        <InputRoot className="w-32">
                          <InputWrapper>
                            <div className="relative flex items-center">
                              <RiTimeLine className="absolute left-3 text-gray-400" />
                              <input
                                type="time"
                                value={format(startDate, 'HH:mm')}
                                onChange={handleStartTimeChange}
                                className="pl-9 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </InputWrapper>
                        </InputRoot>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500">End</label>
                    <div className="flex gap-2">
                      <InputRoot className="flex-1">
                        <InputWrapper>
                          <div className="relative flex items-center">
                            <RiCalendarLine className="absolute left-3 text-gray-400" />
                            <input
                              type="date"
                              value={format(endDate, 'yyyy-MM-dd')}
                              onChange={handleEndDateChange}
                              min={format(startDate, 'yyyy-MM-dd')}
                              className="pl-9 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </InputWrapper>
                      </InputRoot>
                      {!isAllDay && (
                        <InputRoot className="w-32">
                          <InputWrapper>
                            <div className="relative flex items-center">
                              <RiTimeLine className="absolute left-3 text-gray-400" />
                              <input
                                type="time"
                                value={format(endDate, 'HH:mm')}
                                onChange={handleEndTimeChange}
                                className="pl-9 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </InputWrapper>
                        </InputRoot>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Color
                </label>
                <div className="flex gap-2">
                  {eventColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <div>
            {event && onDelete && (
              <ButtonRoot
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
            )}
          </div>
          <div className="flex gap-2">
            <ButtonRoot variant="neutral" mode="stroke" onClick={onClose}>
              Cancel
            </ButtonRoot>
            <ButtonRoot variant="primary" mode="filled" onClick={handleSubmit}>
              Save
            </ButtonRoot>
          </div>
        </ModalFooter>
        <ModalClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
          <RiCloseLine className="h-6 w-6" />
        </ModalClose>
      </ModalContent>
    </ModalRoot>
  );
} 