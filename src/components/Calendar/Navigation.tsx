import { NavigationProps } from './types';
import { format } from 'date-fns';

export function Navigation({ currentDate, onNavigate, view }: NavigationProps) {
  const formatTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-gray-200">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 hover:bg-gray-100 rounded-l-lg"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('today')}
          className="px-3 py-2 hover:bg-gray-100 border-l border-r border-gray-200"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="p-2 hover:bg-gray-100 rounded-r-lg"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <h2 className="text-xl font-semibold">{formatTitle()}</h2>
    </div>
  );
} 