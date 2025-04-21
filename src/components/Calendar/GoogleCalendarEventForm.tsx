import React, { useState, useEffect } from 'react';
import { Root as ButtonRoot } from '@/components/align-ui/ui/button';
import { Root as InputRoot } from '@/components/align-ui/ui/input';
import { Root as ModalRoot, Content as ModalContent, Header as ModalHeader, Title as ModalTitle, Body as ModalBody, Footer as ModalFooter } from '@/components/align-ui/ui/modal';
import { RiCalendarEventLine, RiMapPinLine, RiTimeLine, RiCloseLine } from '@remixicon/react';

interface GoogleEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
    optional?: boolean;
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: string;
      minutes: number;
    }[];
  };
  status?: string;
}

interface GoogleCalendarEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Partial<GoogleEvent>) => Promise<void>;
  initialEvent?: Partial<GoogleEvent>;
  calendarId?: string;
}

const GoogleCalendarEventForm: React.FC<GoogleCalendarEventFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
  calendarId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with initial event data if provided
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.summary || '');
      setDescription(initialEvent.description || '');
      setLocation(initialEvent.location || '');
      
      // Handle start date/time
      if (initialEvent.start) {
        if (initialEvent.start.dateTime) {
          const startDateTime = new Date(initialEvent.start.dateTime);
          setStartDate(startDateTime.toISOString().split('T')[0]);
          setStartTime(startDateTime.toTimeString().slice(0, 5));
          setIsAllDay(false);
        } else if (initialEvent.start.date) {
          setStartDate(initialEvent.start.date);
          setIsAllDay(true);
        }
      }
      
      // Handle end date/time
      if (initialEvent.end) {
        if (initialEvent.end.dateTime) {
          const endDateTime = new Date(initialEvent.end.dateTime);
          setEndDate(endDateTime.toISOString().split('T')[0]);
          setEndTime(endDateTime.toTimeString().slice(0, 5));
        } else if (initialEvent.end.date) {
          setEndDate(initialEvent.end.date);
        }
      }
    } else {
      // Default to today's date for new events
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setStartDate(today.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndDate(today.toISOString().split('T')[0]);
      setEndTime('10:00');
    }
  }, [initialEvent]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate form
      if (!title.trim()) {
        throw new Error('Event title is required');
      }
      
      if (!startDate) {
        throw new Error('Start date is required');
      }
      
      if (!endDate) {
        throw new Error('End date is required');
      }
      
      if (!isAllDay && (!startTime || !endTime)) {
        throw new Error('Start and end times are required for timed events');
      }
      
      // Create event object
      const eventData: Partial<GoogleEvent> = {
        summary: title,
        description: description || undefined,
        location: location || undefined,
        start: isAllDay 
          ? { date: startDate } 
          : { 
              dateTime: `${startDate}T${startTime}:00`,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
        end: isAllDay 
          ? { date: endDate } 
          : { 
              dateTime: `${endDate}T${endTime}:00`,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };
      
      // If editing an existing event, include the ID
      if (initialEvent?.id) {
        eventData.id = initialEvent.id;
      }
      
      // Submit the event
      await onSubmit(eventData);
      
      // Close the form
      onClose();
    } catch (err: any) {
      console.error('Error submitting event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle all-day toggle
  const handleAllDayToggle = () => {
    setIsAllDay(!isAllDay);
  };

  return (
    <ModalRoot open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {initialEvent?.id ? 'Edit Event' : 'Create New Event'}
          </ModalTitle>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <InputRoot>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  required
                />
              </InputRoot>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <InputRoot>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event description (optional)"
                  rows={3}
                />
              </InputRoot>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <InputRoot>
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event location (optional)"
                />
              </InputRoot>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={handleAllDayToggle}
                />
                All-day event
              </label>
            </div>
            
            <div className="date-time-group">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <InputRoot>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </InputRoot>
              </div>
              
              {!isAllDay && (
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <InputRoot>
                    <input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </InputRoot>
                </div>
              )}
            </div>
            
            <div className="date-time-group">
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <InputRoot>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </InputRoot>
              </div>
              
              {!isAllDay && (
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <InputRoot>
                    <input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </InputRoot>
                </div>
              )}
            </div>
          </form>
        </ModalBody>
        
        <ModalFooter>
          <ButtonRoot
            variant="neutral"
            mode="stroke"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </ButtonRoot>
          
          <ButtonRoot
            variant="primary"
            mode="filled"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialEvent?.id ? 'Update Event' : 'Create Event'}
          </ButtonRoot>
        </ModalFooter>
      </ModalContent>
      
      <style jsx>{`
        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          background-color: var(--color-error-light);
          color: var(--color-error);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .date-time-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </ModalRoot>
  );
};

export default GoogleCalendarEventForm; 