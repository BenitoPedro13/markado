'use client';

import { Calendar } from '@/components/Calendar/Calendar';
import { CalendarEvent } from '@/components/Calendar/types';
import { addDays, addHours, startOfMonth, addMinutes } from 'date-fns';

// Helper function to create a random time on a given date
const getRandomTime = (date: Date) => {
  const hours = Math.floor(Math.random() * 12) + 9; // Random hour between 9 AM and 8 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // Random minutes: 0, 15, 30, or 45
  return new Date(date.setHours(hours, minutes, 0, 0));
};

// Event colors with proper opacity and hover states
const eventColors = {
  green: {
    default: 'bg-[#74C95B]/90 hover:bg-[#74C95B]',
    selected: 'bg-[#74C95B] ring-2 ring-[#74C95B]/30',
    text: 'text-[#1D3419]'
  },
  purple: {
    default: 'bg-[#AF52DE]/90 hover:bg-[#AF52DE]',
    selected: 'bg-[#AF52DE] ring-2 ring-[#AF52DE]/30',
    text: 'text-white'
  },
  orange: {
    default: 'bg-[#FF9F0A]/90 hover:bg-[#FF9F0A]',
    selected: 'bg-[#FF9F0A] ring-2 ring-[#FF9F0A]/30',
    text: 'text-[#3D2200]'
  },
  blue: {
    default: 'bg-[#007AFF]/90 hover:bg-[#007AFF]',
    selected: 'bg-[#007AFF] ring-2 ring-[#007AFF]/30',
    text: 'text-white'
  },
  yellow: {
    default: 'bg-[#FFD60A]/90 hover:bg-[#FFD60A]',
    selected: 'bg-[#FFD60A] ring-2 ring-[#FFD60A]/30',
    text: 'text-[#3D3100]'
  },
  red: {
    default: 'bg-[#FF453A]/90 hover:bg-[#FF453A]',
    selected: 'bg-[#FF453A] ring-2 ring-[#FF453A]/30',
    text: 'text-white'
  }
};

// Generate random events for the current month
const generateEvents = (): CalendarEvent[] => {
  const currentMonth = startOfMonth(new Date());
  const events: CalendarEvent[] = [];

  // Regular meetings
  for (let week = 0; week < 4; week++) {
    const startTime = getRandomTime(addDays(currentMonth, week * 7 + 1));
    events.push({
      id: `weekly-meeting-${week}`,
      title: 'Team Sync',
      start: startTime,
      end: addHours(startTime, 1),
      color: `${eventColors.blue.default} ${eventColors.blue.text}`,
    });
  }

  // Project deadlines
  const projectDeadlines = [
    'UI Design Review',
    'Backend Deploy',
    'Client Meeting',
    'Sprint Planning',
    'Code Review'
  ];

  projectDeadlines.forEach((title, index) => {
    const startTime = getRandomTime(addDays(currentMonth, (index + 1) * 3));
    events.push({
      id: `deadline-${index}`,
      title,
      start: startTime,
      end: addHours(startTime, 2),
      color: `${eventColors.green.default} ${eventColors.green.text}`,
    });
  });

  // All-day events
  const allDayEvents = [
    'Company Holiday',
    'Team Building',
    'Quarterly Review'
  ];

  allDayEvents.forEach((title, index) => {
    const startTime = addDays(currentMonth, (index + 2) * 5);
    events.push({
      id: `allday-${index}`,
      title,
      start: startTime,
      end: addDays(startTime, 1),
      color: `${eventColors.purple.default} ${eventColors.purple.text}`,
      allDay: true
    });
  });

  // Random meetings
  for (let i = 0; i < 8; i++) {
    const startTime = getRandomTime(addDays(currentMonth, Math.floor(Math.random() * 28)));
    const colorKey = ['blue', 'green', 'purple', 'orange', 'yellow', 'red'][Math.floor(Math.random() * 6)] as keyof typeof eventColors;
    events.push({
      id: `random-${i}`,
      title: [
        '1:1 Meeting',
        'Product Demo',
        'Customer Call',
        'Training Session',
        'Workshop'
      ][Math.floor(Math.random() * 5)],
      start: startTime,
      end: addMinutes(startTime, [30, 45, 60][Math.floor(Math.random() * 3)]),
      color: `${eventColors[colorKey].default} ${eventColors[colorKey].text}`,
    });
  }

  return events;
};

export default function CalendarPage() {
  const events = generateEvents();

  return (
    <div className="h-screen p-4">
      <Calendar
        events={events}
        onEventClick={(event) => console.log('Event clicked:', event)}
        onDateSelect={(date) => console.log('Date selected:', date)}
      />
    </div>
  );
}
