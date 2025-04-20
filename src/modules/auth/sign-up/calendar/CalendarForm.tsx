'use client';

import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {SignUpProvider, useSignUp} from '@/contexts/SignUpContext';
import {useTRPC} from '@/utils/trpc';
import {RiCalendarFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNotification} from '@/hooks/use-notification';

import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import CalendarIntegrationCard from '@/components/CalendarIntegrationCard';
// import * as Select from '@/components/align-ui/ui/select';
import {useSession} from 'next-auth/react';
import {Calendar} from '~/prisma/app/generated/prisma/client';

import {inferProcedureOutput} from '@trpc/server';
import {AppRouter} from '~/trpc/server';
import {getMeByUserId, getMeHandler} from '~/trpc/server/handlers/user.handler';
import {Session} from 'next-auth';
import {getCalendarsByUserId} from '~/trpc/server/routers/calendar.router';
const GoogleCalendarBrand = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M1.5 8.96667C1.5 6.35309 1.5 5.0463 2.00864 4.04804C2.45605 3.16995 3.16995 2.45605 4.04804 2.00864C5.0463 1.5 6.35309 1.5 8.96667 1.5H15.0333C17.6469 1.5 18.9537 1.5 19.952 2.00864C20.83 2.45605 21.544 3.16995 21.9914 4.04804C22.5 5.0463 22.5 6.35309 22.5 8.96667V15.0333C22.5 17.6469 22.5 18.9537 21.9914 19.952C21.544 20.83 20.83 21.544 19.952 21.9914C18.9537 22.5 17.6469 22.5 15.0333 22.5H8.96667C6.35309 22.5 5.0463 22.5 4.04804 21.9914C3.16995 21.544 2.45605 20.83 2.00864 19.952C1.5 18.9537 1.5 17.6469 1.5 15.0333V8.96667Z"
        fill="white"
      />
      <path
        d="M18.3696 4.5H15.9312V8.03344H19.4993V5.49634C19.5002 5.49634 19.3229 4.59636 18.3696 4.5Z"
        fill="#1967D2"
      />
      <path
        d="M15.9321 19.4834V19.492V19.4997L19.5002 15.9663H19.4683L15.9321 19.4834Z"
        fill="#1967D2"
      />
      <path
        d="M19.4999 15.9662V15.9346L19.4683 15.9662H19.4999Z"
        fill="#FBBC05"
      />
      <path
        d="M19.5002 8.03369H15.9321V15.935H19.5002V8.03369Z"
        fill="#FBBC05"
      />
      <path
        d="M19.4683 15.9663H15.9321V19.4834L19.4683 15.9663Z"
        fill="#EA4335"
      />
      <path
        d="M15.9321 15.9662H19.4683L19.5002 15.9346H15.9321V15.9662Z"
        fill="#EA4335"
      />
      <path
        d="M15.9233 19.4925H15.932V19.4839L15.9233 19.4925Z"
        fill="#34A853"
      />
      <path
        d="M7.98779 15.9346V19.4921H15.9233L15.932 15.9346H7.98779Z"
        fill="#34A853"
      />
      <path
        d="M15.932 15.9664V15.9346L15.9233 19.4921L15.932 19.4834V15.9664Z"
        fill="#34A853"
      />
      <path
        d="M4.5 15.9346V18.4081C4.53197 19.2107 5.40002 19.4921 5.40002 19.4921H7.9877V15.9346H4.5Z"
        fill="#188038"
      />
      <path
        d="M7.9877 8.03344H15.9319V4.5H5.50078C5.50078 4.5 4.56394 4.59636 4.5 5.59173V15.9348H7.9877V8.03344Z"
        fill="#4285F4"
      />
      <path
        d="M10.5869 14.3354C10.4051 14.3354 10.2299 14.3117 10.0611 14.2643C9.89667 14.217 9.74521 14.146 9.60674 14.0513C9.46826 13.9523 9.34493 13.8296 9.23675 13.6833C9.13289 13.537 9.05284 13.367 8.99658 13.1733L9.79497 12.8569C9.85123 13.0721 9.94643 13.2357 10.0806 13.3476C10.2147 13.4552 10.3835 13.509 10.5869 13.509C10.6777 13.509 10.7643 13.4961 10.8465 13.4703C10.9287 13.4401 11.0001 13.3992 11.0607 13.3476C11.1213 13.296 11.1689 13.2357 11.2035 13.1668C11.2425 13.0937 11.2619 13.0119 11.2619 12.9215C11.2619 12.7321 11.1905 12.5836 11.0477 12.476C10.9093 12.3684 10.7167 12.3146 10.47 12.3146H10.0871V11.5464H10.4376C10.5241 11.5464 10.6085 11.5356 10.6907 11.5141C10.7729 11.4926 10.8444 11.4603 10.9049 11.4173C10.9698 11.3699 11.0196 11.3118 11.0542 11.243C11.0932 11.1698 11.1126 11.0859 11.1126 10.9912C11.1126 10.8448 11.0607 10.7265 10.9569 10.6361C10.853 10.5414 10.7124 10.4941 10.5349 10.4941C10.3445 10.4941 10.1974 10.5457 10.0936 10.649C9.99403 10.748 9.92479 10.8599 9.88585 10.9847L9.10693 10.6684C9.14587 10.5608 9.20429 10.451 9.28219 10.3391C9.36008 10.2229 9.45744 10.1196 9.57428 10.0292C9.69545 9.93455 9.83608 9.85923 9.99619 9.80327C10.1563 9.74302 10.3402 9.71289 10.5479 9.71289C10.76 9.71289 10.9525 9.74302 11.1256 9.80327C11.303 9.86353 11.4545 9.94746 11.58 10.0551C11.7055 10.1584 11.8029 10.2832 11.8721 10.4295C11.9413 10.5715 11.9759 10.7265 11.9759 10.8943C11.9759 11.0235 11.9586 11.1397 11.924 11.243C11.8937 11.3462 11.8526 11.4388 11.8007 11.5206C11.7488 11.6023 11.6882 11.6734 11.6189 11.7336C11.554 11.7896 11.487 11.8348 11.4177 11.8692V11.9208C11.6254 12.0026 11.7964 12.1339 11.9305 12.3146C12.069 12.4954 12.1382 12.7235 12.1382 12.999C12.1382 13.1927 12.1014 13.3713 12.0279 13.5348C11.9543 13.6941 11.8483 13.8339 11.7098 13.9545C11.5757 14.075 11.4134 14.1675 11.223 14.2321C11.0326 14.3009 10.8206 14.3354 10.5869 14.3354Z"
        fill="#4285F4"
      />
      <path
        d="M13.6883 14.2321V10.8104L12.9029 11.1397L12.5913 10.423L13.896 9.81619H14.5386V14.2321H13.6883Z"
        fill="#4285F4"
      />
    </svg>
  );
};

interface CalendarFormProps {
  calendars: Calendar[];
  userEmail: string;
}

const CalendarForm = ({calendars, userEmail}: CalendarFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const {nextStep, goToStep} = useSignUp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(
    null
  );
  const t = useTranslations('SignUpPage.CalendarForm');
  const {notification} = useNotification();

  // Move the calendar selection logic into a useEffect to avoid state updates during render
  useEffect(() => {
    if (calendars && calendars.length > 0) {
      setIsConnected(true);

      // Only set the selected calendar ID if it hasn't been set yet
      if (!selectedCalendarId) {
        // Find calendar that matches user email or primary calendar
        const userEmailCal = calendars.find((cal) => cal.name === userEmail);
        const primaryCal = calendars.find((cal) => cal.primary);

        if (userEmailCal) {
          setSelectedCalendarId(userEmailCal.id);
        } else if (primaryCal) {
          setSelectedCalendarId(primaryCal.id);
        } else if (calendars[0]) {
          setSelectedCalendarId(calendars[0].id);
        }
      }
    }
  }, [calendars, userEmail, selectedCalendarId]);

  // If we just came back from auth, refresh calendars
  const connectCalendarMutation = useMutation(
    trpc.calendar.connect.mutationOptions({
      onSuccess: (data) => {
        router.push(data.authUrl);
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_connecting_calendar'),
          variant: 'stroke'
        });
        console.error('Error connecting to Google Calendar:', error);
        setIsConnecting(false);
      }
    })
  );

  const selectCalendarMutation = useMutation(
    trpc.calendar.selectCalendar.mutationOptions({
      onSuccess: () => {
        notification({
          title: t('success'),
          description: t('calendar_selected_successfully'),
          variant: 'stroke'
        });
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_selecting_calendar'),
          variant: 'stroke'
        });
        console.error('Error selecting calendar:', error);
      }
    })
  );

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectCalendarMutation.mutateAsync();
    } catch (error) {
      setIsConnecting(false);
      setIsConnected(false);
      notification({
        title: t('error'),
        description: t('error_connecting_calendar'),
        variant: 'stroke'
      });
    }
  };

  // const handleCalendarSelect = async (calendarId: string) => {
  //   setSelectedCalendarId(calendarId);

  //   try {
  //     await selectCalendarMutation.mutateAsync({ calendarId });
  //   } catch (error) {
  //     console.error('Failed to set default calendar:', error);
  //   }
  // };

  const handleContinue = () => {
    if (selectedCalendarId) {
      // Save selected calendar if not already done
      selectCalendarMutation.mutate(
        {calendarId: selectedCalendarId},
        {
          onSuccess: () => goToStep('/sign-up/availability'),
          onError: () => goToStep('/sign-up/availability') // Continue anyway if selection fails
        }
      );
    } else {
      goToStep('/sign-up/availability');
    }
  };

  const handleSkip = () => {
    goToStep('/sign-up/availability');
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCalendarFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('connect_calendar')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('connect_calendar_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <CalendarIntegrationCard
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        brandIcon={<GoogleCalendarBrand />}
        calendarName={t('google_calendar')}
        badgeText={isConnected ? t('default') : undefined}
      />

      {/* {isConnected && calendars.length > 0 && (
        <div className="w-full">
          <p className="text-paragraph-sm text-text-sub-600 mb-2">
            {t('select_default_calendar')}:
          </p>
          <Select.Root
            value={selectedCalendarId || ''}
            onValueChange={handleCalendarSelect}
          >
            <Select.Trigger className="w-full bg-bg-white-0 border border-bg-soft-200 rounded-md p-2">
              <Select.Value placeholder={t('select_a_calendar')} />
            </Select.Trigger>
            <Select.Content>
              {calendars.map((calendar: Calendar) => (
                <Select.Item key={calendar.id} value={calendar.id}>
                  {calendar.name} {calendar.primary ? `(${t('primary')})` : ''}
                  {calendar.name === userEmail
                    ? ` (${t('matches_email')})`
                    : ''}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      )} */}

      <FancyButton.Root
        className="w-full"
        variant="primary"
        onClick={handleContinue}
      >
        <span className="text-label-sm">{t('continue')}</span>
      </FancyButton.Root>

      <div className="flex w-full justify-center items-start gap-1">
        <span className="text-paragraph-sm text-text-sub-600">
          {t('want_to_fill_later')}
        </span>

        <span
          onClick={handleSkip}
          className="text-paragraph-sm text-text-strong-950 hover:underline decoration-2 underline-offset-2 cursor-pointer"
        >
          {t('skip_for_now')}
        </span>
      </div>
    </div>
  );
};

export default CalendarForm;
