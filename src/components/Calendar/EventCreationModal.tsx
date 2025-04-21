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
import { Datepicker } from '@/components/align-ui/daterange';
import { CalendarEvent } from './types';
import { addHours } from 'date-fns';
import { RiCloseLine } from '@remixicon/react';

interface EventCreationModalProps {
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  initialDate: Date;
  event?: CalendarEvent; // For editing existing events
}

const eventColors = [
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-purple-500 text-white',
  'bg-yellow-500 text-white',
  'bg-red-500 text-white',
  'bg-indigo-500 text-white',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event?.id ?? Math.random().toString(36).substr(2, 9),
      title,
      description,
      start: startDate,
      end: endDate,
      color: selectedColor,
    });
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
                <label className="block text-sm font-medium">
                  Date and Time
                </label>
                <Datepicker
                  value={{
                    from: startDate,
                    to: endDate
                  }}
                  onChange={(range) => {
                    if (range?.from) setStartDate(range.from);
                    if (range?.to) setEndDate(range.to);
                  }}
                />
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
                      className={`w-6 h-6 rounded-full ${color} ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
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