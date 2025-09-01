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
import { usePathname, useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import VerticalStripesPattern from '~/public/patterns/vertical_stripes.svg';


type ContextType = {
  pathname: string | null;
  isInSignUpFlow: boolean;
  steps: { path: string; label: string }[];
  getStepState: (stepPath: string) => 'default' | 'active' | 'completed';
  currentIndex: number;
};

const Context = createContext<ContextType>({
  pathname: null,
  isInSignUpFlow: false,
  steps: [],
  getStepState: () => 'default',
  currentIndex: 0,
});

const stepOrder = [
  '/sign-up/email',
  '/sign-up/password',
  '/sign-up/personal',
  '/sign-up/calendar',
  '/sign-up/availability',
  '/sign-up/profile',
  '/sign-up/summary'
];

const Provider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const t = useTranslations('SignUpStepper');

  const isInSignUpFlow =
    (pathname?.startsWith('/sign-up') &&
      pathname !== '/sign-up' &&
      pathname !== '/sign-up/email') ||
    false;

  const steps: { path: string; label: string }[] = [
    { path: '/sign-up/password', label: t('password') },
    { path: '/sign-up/personal', label: t('personal') },
    { path: '/sign-up/calendar', label: t('connect') },
    { path: '/sign-up/availability', label: t('availability') },
    { path: '/sign-up/profile', label: t('finalization') }
  ];

  const getStepState = (stepPath: string) => {
    const currentIndex = stepOrder.indexOf(pathname || '');
    const stepIndex = stepOrder.indexOf(stepPath);

    // Special case for profile and summary steps
    if (
      stepPath === '/sign-up/profile' &&
      (pathname === '/sign-up/profile' || pathname === '/sign-up/summary')
    ) {
      return 'active';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'default';
  };

  return (
    <Context.Provider
      value={{ pathname: pathname || '', isInSignUpFlow, steps, getStepState, currentIndex: stepOrder.indexOf(pathname || '') }}
    >
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

  const { pathname, isInSignUpFlow, steps, getStepState } = useAuthContext();

  return (
    <header className="relative w-full py-6 px-11 gap-6 border-b border-b-bg-soft-200 border-b-soft flex justify-between items-center">
      <div className="w-full flex flex-row justify-between items-center gap-6">
        <Link
          href={process.env.NEXT_PUBLIC_LANDING_URL || 'https://markado.co'}
          className=""
          target="_blank"
          rel="noopener"
        >
          <Logo />
        </Link>

        {isInSignUpFlow && (
          <HorizontalStepper.Root className="absolute left-1/2 -translate-x-1/2 gap-1 flex-grow flex justify-center">
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
              <p className="text-paragraph-sm text-text-sub-600">
                {t('need_help')}
              </p>
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

export default function AuthLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isInSignUpFlow =
    (pathname?.startsWith('/sign-up') &&
      pathname !== '/sign-up' &&
      pathname !== '/sign-up/email') ||
    false;
  const t = useTranslations('SignInPage');
  const router = useRouter();

  const handleBack = () => {
    const currentPath = pathname || '';
    const currentIndex = stepOrder.indexOf(currentPath);

    if (currentIndex > 0) {
      router.push(stepOrder[currentIndex - 1]);
      return;
    }

    if (currentIndex === 0) {
      router.push('/sign-up');
      return;
    }

    router.back();
  };

  return (
    <Provider>
      <Header />

      <div className="w-full h-full px-11 py-6 flex flex-col justify-between">
        {/* Show back when in sign-up flow or on email page */}
        {isInSignUpFlow && (
          <>
            {/** Back button */}
            {/* <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 top-0"
            > */}
              <Button variant="neutral" mode="stroke" onClick={handleBack} className="absolute left-12 top-[114px]">
                <RiArrowLeftSLine size={20} color="var(--text-sub-600)" />
                <span className="text-text-sub-600">Voltar</span>
              </Button>
            {/* </button> */}
          </>
        )}

        <div className="flex justify-center my-auto w-full">{children}</div>

        <Footer />
      </div>
    </Provider>
  );
}
