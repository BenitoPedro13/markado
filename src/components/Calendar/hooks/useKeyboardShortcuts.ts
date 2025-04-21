import { useEffect } from 'react';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

interface KeyboardShortcutsProps {
  currentDate: Date;
  currentView: 'day' | 'week' | 'month';
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onNewEvent: () => void;
  onSearch: () => void;
}

export function useKeyboardShortcuts({
  currentDate,
  currentView,
  onDateChange,
  onViewChange,
  onNewEvent,
  onSearch
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Navigation shortcuts
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        switch (currentView) {
          case 'day':
            onDateChange(subDays(currentDate, 1));
            break;
          case 'week':
            onDateChange(subWeeks(currentDate, 1));
            break;
          case 'month':
            onDateChange(subMonths(currentDate, 1));
            break;
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        switch (currentView) {
          case 'day':
            onDateChange(addDays(currentDate, 1));
            break;
          case 'week':
            onDateChange(addWeeks(currentDate, 1));
            break;
          case 'month':
            onDateChange(addMonths(currentDate, 1));
            break;
        }
      } else if (event.key === 'Home') {
        event.preventDefault();
        onDateChange(new Date());
      }

      // View switching shortcuts
      if (event.key === '1' && event.metaKey) {
        event.preventDefault();
        onViewChange('day');
      } else if (event.key === '2' && event.metaKey) {
        event.preventDefault();
        onViewChange('week');
      } else if (event.key === '3' && event.metaKey) {
        event.preventDefault();
        onViewChange('month');
      }

      // Action shortcuts
      if (event.key === 'n' && event.metaKey) {
        event.preventDefault();
        onNewEvent();
      } else if (event.key === 'f' && event.metaKey) {
        event.preventDefault();
        onSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, currentView, onDateChange, onViewChange, onNewEvent, onSearch]);
} 