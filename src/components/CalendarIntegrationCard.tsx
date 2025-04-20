import { cn } from '@/utils/cn';
import * as Badge from '@/components/align-ui/ui/badge';
import * as Button from '@/components/align-ui/ui/button';
import { useTranslations } from 'next-intl';

interface CalendarIntegrationCardProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  brandIcon: React.ReactNode;
  calendarName: string;
  badgeText?: string;
}

const CalendarIntegrationCard = ({
  isConnected,
  isConnecting,
  onConnect,
  brandIcon,
  calendarName,
  badgeText
}: CalendarIntegrationCardProps) => {
  const t = useTranslations('Components.CalendarIntegrationCard');

  return (
    <div className="flex flex-col items-start gap-2 w-full self-stretch">
      {/* Cards */}
      <div className="flex flex-col items-end gap-3 self-stretch">
        {/* Integration toggle */}
        <div className="flex p-4 items-center self-stretch gap-[14px] rounded-xl border border-bg-soft-200 bg-bg-white-0 shadow-regular-xs">
          {/* Brand */}
          <div className="flex p-2 justify-center items-center rounded-full border border-bg-soft-200 bg-bg-white-0 shadow-regular-xs">
            {brandIcon}
          </div>

          {/* Integration name and badge */}
          <div className="flex flex-col items-start gap-1 flex-grow">
            <div className="flex items-center gap-1">
              <p className="text-label-sm text-text-strong-950">
                {calendarName}
              </p>

              {badgeText && (
                <Badge.Root
                  variant="filled"
                  size="medium"
                  className="capitalize bg-green-200"
                >
                  <span className="text-label-xs text-green-950">{t('default')}</span>
                </Badge.Root>
              )}
            </div>
          </div>

          {/* Connect button */}
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="medium"
            className={cn(
              isConnected || isConnecting ? 'opacity-50' : '',
              'cursor-pointer'
            )}
            disabled={isConnected || isConnecting}
            onClick={onConnect}
          >
            <span className="text-label-sm text-text-strong-950">
              {isConnected ? t('connected') : isConnecting ? t('connecting') : t('connect')}
            </span>
          </Button.Root>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegrationCard; 