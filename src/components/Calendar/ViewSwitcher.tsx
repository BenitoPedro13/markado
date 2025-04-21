import { ViewSwitcherProps, CalendarView } from './types';

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: CalendarView[] = ['day', 'week', 'month'];

  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`
            px-4 py-2 capitalize
            ${currentView === view
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
            }
            ${view !== 'month' ? 'border-r border-gray-200' : ''}
          `}
        >
          {view}
        </button>
      ))}
    </div>
  );
} 