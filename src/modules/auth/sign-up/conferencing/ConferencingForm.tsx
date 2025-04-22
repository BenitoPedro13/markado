'use client';

import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {SignUpProvider, useSignUp} from '@/contexts/SignUpContext';
import {useTRPC} from '@/utils/trpc';
import {RiPlugFill, RiVideoFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import {useNotification} from '@/hooks/use-notification';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import CalendarIntegrationCard from '@/components/CalendarIntegrationCard';
import {clearEditMode, setStepComplete} from '@/utils/cookie-utils';
import {inferRouterOutputs} from '@trpc/server';
import {AppRouter} from '~/trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ConnectMeetOutput = RouterOutput['meet']['connect'];

const GoogleMeetBrand = () => {
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
        d="M3.75 17.6699C3.75 18.2666 4.23748 18.7499 4.83811 18.7499H4.85375C4.24393 18.7499 3.75 18.2666 3.75 17.6699Z"
        fill="#FBBC05"
      />
      <path
        d="M13.1006 9.29998V12.1197L16.9021 9.05338V6.32999C16.9021 5.7333 16.4146 5.25 15.814 5.25H7.57816L7.5708 9.29998H13.1006Z"
        fill="#FBBC05"
      />
      <path
        d="M13.1006 14.9408H7.56161L7.55518 18.7505H15.814C16.4155 18.7505 16.9021 18.2672 16.9021 17.6705V15.2117L13.1006 12.1211V14.9408V14.9408Z"
        fill="#34A853"
      />
      <path
        d="M7.57816 5.25L3.75 9.29998H7.57172L7.57816 5.25Z"
        fill="#EA4335"
      />
      <path
        d="M3.75 14.9404V17.6701C3.75 18.2668 4.24393 18.7501 4.85375 18.7501H7.55517L7.56161 14.9404H3.75V14.9404Z"
        fill="#1967D2"
      />
      <path
        d="M7.57172 9.2998H3.75V14.9401H7.56161L7.57172 9.2998Z"
        fill="#4285F4"
      />
      <path
        d="M20.2444 16.7097V7.43977C20.0301 6.20948 18.6808 7.61977 18.6808 7.61977L16.9028 9.05347V15.2103L19.4479 17.2794C20.3668 17.4 20.2444 16.7097 20.2444 16.7097Z"
        fill="#34A853"
      />
      <path
        d="M13.1006 12.1196L16.903 15.2111V9.0542L13.1006 12.1196Z"
        fill="#188038"
      />
    </svg>
  );
};

interface CalendarFormProps {
  googleMeetEnabled: boolean;
}

const ConferencingForm = ({googleMeetEnabled}: CalendarFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const {nextStep, goToStep} = useSignUp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const t = useTranslations('SignUpPage.ConferencingForm');
  const {notification} = useNotification();

  useEffect(() => {
    if (googleMeetEnabled) {
      setIsConnected(true);
    }
  }, [googleMeetEnabled]);

  // Check for success parameter in URL after callback
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');
    
    if (success === 'true') {
      setIsConnected(true);
      notification({
        title: t('success'),
        description: 'Google Meet connected successfully',
        variant: 'stroke'
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const connectMeetMutation = useMutation(
    trpc.meet.connect.mutationOptions({
      onSuccess: (data: ConnectMeetOutput) => {
        if (data.success) {
          // If already connected or successfully connected without consent screen
          setIsConnected(true);
          notification({
            title: t('success'),
            description: data.alreadyConnected 
              ? 'Google Meet is already connected' 
              : 'Google Meet connected successfully',
            variant: 'stroke'
          });
        } else if (data.authUrl) {
          // If consent screen is needed
          router.push(data.authUrl);
        }
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_connecting_meet'),
          variant: 'stroke'
        });
        console.error('Error connecting to Google Meet:', error);
        setIsConnecting(false);
      }
    })
  );

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectMeetMutation.mutateAsync();
    } catch (error) {
      setIsConnecting(false);
      setIsConnected(false);
      notification({
        title: t('error'),
        description: t('error_connecting_meet'),
        variant: 'stroke'
      });
    }
  };

  const handleContinue = () => {
    // Clear the edit_mode cookie if it exists
    clearEditMode();
    
    // Set the conferencing step completion cookie
    setStepComplete('conferencing');
    
    goToStep('/sign-up/availability');
  };

  const handleSkip = () => {
    // Clear the edit_mode cookie if it exists
    clearEditMode();
    
    // Set the conferencing step completion cookie
    setStepComplete('conferencing');
    
    goToStep('/sign-up/availability');
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full">
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiPlugFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('connect_meet')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('connect_meet_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <CalendarIntegrationCard
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        brandIcon={<GoogleMeetBrand />}
        calendarName={t('google_meet')}
        badgeText={isConnected ? t('default') : undefined}
      />

      <FancyButton.Root
        className="w-full"
        variant="neutral"
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

export default ConferencingForm; 