'use client';

import {
  Root as Button,
  Icon as ButtonIcon
} from '@/components/align-ui/ui/button';
import * as HorizontalStepper from '@/components/align-ui/ui/horizontal-stepper';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import Logo from '@/components/navigation/Logo';
import { RiArrowLeftSLine, RiHeadphoneLine } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import VerticalStripesPattern from '~/public/patterns/vertical_stripes.svg';

type ContextType = {
  pathname: string;
  isInSignUpFlow: boolean;
  steps: {path: string; label: string}[];
  getStepState: (stepPath: string) => 'default' | 'active' | 'completed';
};

const Context = createContext<ContextType>({
  pathname: '',
  isInSignUpFlow: false,
  steps: [],
  getStepState: () => 'default'
});

const Provider = ({children}: PropsWithChildren) => {
  const pathname = usePathname();
  const t = useTranslations('SignUpStepper');

  const isInSignUpFlow =
    pathname.startsWith('/sign-up') &&
    pathname !== '/sign-up' &&
    pathname !== '/sign-up/email';

  const steps: {path: string; label: string}[] = [
    {path: '/sign-up/password', label: t('password')},
    {path: '/sign-up/personal', label: t('personal')},
    {path: '/sign-up/calendar', label: t('connect')},
    {path: '/sign-up/availability', label: t('availability')},
    {path: '/sign-up/profile', label: t('finalization')}
  ];

  const getStepState = (stepPath: string) => {
    const stepOrder = [
      '/sign-up/email',
      '/sign-up/password',
      '/sign-up/personal',
      '/sign-up/calendar',
      '/sign-up/availability',
      '/sign-up/profile',
      '/sign-up/summary'
    ];

    const currentIndex = stepOrder.indexOf(pathname);
    const stepIndex = stepOrder.indexOf(stepPath);

    // Special case for profile and summary steps
    if (stepPath === '/sign-up/profile' && (pathname === '/sign-up/profile' || pathname === '/sign-up/summary')) {
      return 'active';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'default';
  };

  return (
    <Context.Provider value={{pathname, isInSignUpFlow, steps, getStepState}}>
      {children}
    </Context.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error('useAuthContext must be used within a AuthProvider');
  return context;
};

const Header = () => {
  const t = useTranslations('SignInHeader');

  const {pathname, isInSignUpFlow, steps, getStepState} = useAuthContext();

  return (
    <header className="relative w-full py-6 px-11 gap-6 border-b border-b-bg-soft-200 border-b-soft flex justify-between items-center">
      <div className="w-full flex flex-row justify-between items-center gap-6">
        <Link href={'/'} className="">
          <Logo />
        </Link>

        {isInSignUpFlow && (
          <HorizontalStepper.Root className="gap-1 flex-grow flex justify-center">
            {steps.map((s, index) => {
              const state = getStepState(s.path);
              return (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <HorizontalStepper.SeparatorIcon className="mx-1" />
                  )}
                  <HorizontalStepper.Item state={state} className="">
                    <HorizontalStepper.ItemIndicator className="">
                      {index + 1}
                    </HorizontalStepper.ItemIndicator>
                    <span>{s.label}</span>
                  </HorizontalStepper.Item>
                </div>
              );
            })}
          </HorizontalStepper.Root>
        )}

        {!isInSignUpFlow && (
          <>
            {/** Help button */}
            <div className="flex items-center gap-3">
              <p className="text-paragraph-sm text-text-sub-600">{t('need_help')}</p>
              <Button variant="neutral" mode="stroke">
                <ButtonIcon>
                  <RiHeadphoneLine size={20} color="var(--text-sub-600)" />
                </ButtonIcon>
                <span className="text-label-sm text-sub-600">
                  {t('speak_with_us')}
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('SignInPage');

  return (
    <div className="relative w-full">
      <div className="absolute -bottom-6 -z-10 flex justify-center items-center min-w-full">
        <Image
          draggable={false}
          alt=""
          src={VerticalStripesPattern}
          width={964}
        />
      </div>

      <footer className="self-end w-full flex justify-between items-center">
        <p className="text-paragraph-sm text-text-sub-600">
          &copy;{`${currentYear} ${t('markado')}`}
        </p>
        <LocaleSwitcher />
      </footer>
    </div>
  );
};

export default function AuthLayout({children}: PropsWithChildren) {
  const {pathname, isInSignUpFlow, steps, getStepState} = useAuthContext();
  const t = useTranslations('SignInPage');

  return (
    <Provider>
      <Header />

      <div className="w-full h-full px-11 py-6 flex flex-col justify-between">
        {isInSignUpFlow && (
          <>
            {/** Back button */}
            {pathname !== '/sign-up/email' && pathname !== '/sign-up' && (
              <Link
                className="absolute left-0 top-0"
                href={pathname.split('/').slice(0, -1).join('/')}
              >
                <Button variant="neutral" mode="stroke">
                  <RiArrowLeftSLine size={20} color="var(--text-sub-600)" />
                  <span className="text-text-sub-600">Voltar</span>
                </Button>
              </Link>
            )}
          </>
        )}

        <div className="flex justify-center my-auto w-full">{children}</div>

        <Footer />
      </div>
    </Provider>
  );
}
