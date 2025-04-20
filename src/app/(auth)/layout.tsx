'use client';

import Logo from '@/components/navigation/Logo';
import VerticalStripesPattern from '~/public/patterns/vertical_stripes.svg';
import {
  Root as Button,
  Icon as ButtonIcon
} from '@/components/align-ui/ui/button';
import * as HorizontalStepper from '@/components/align-ui/ui/horizontal-stepper';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { RiHeadphoneLine, RiArrowLeftSLine } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const t = useTranslations('SignInHeader');
  const pathname = usePathname();
  
  // Check if we're in the sign-up flow and past the email step
  const isInSignUpFlow = pathname.startsWith('/sign-up') && 
    pathname !== '/sign-up' && 
    pathname !== '/sign-up/email';
  
  // Define the steps and their labels
  const steps: {path: string; label: string}[] = [
    { path: '/sign-up/password', label: 'Senha' },
    { path: '/sign-up/personal', label: 'Pessoal' },
    { path: '/sign-up/calendar', label: 'Conectar' },
    { path: '/sign-up/availability', label: 'Disponibilidade' },
    { path: '/sign-up/ending', label: 'Finalização' },
  ];

  // Function to determine step state based on the current pathname
  const getStepState = (stepPath: string) => {
    const stepOrder = [
      '/sign-up/email',
      '/sign-up/password',
      '/sign-up/personal',
      '/sign-up/calendar',
      '/sign-up/availability',
      '/sign-up/ending'
    ];
    
    const currentIndex = stepOrder.indexOf(pathname);
    const stepIndex = stepOrder.indexOf(stepPath);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'default';
  };

  return (
    <header className="w-full py-6 px-11 gap-6 border-b border-b-bg-soft-200 border-b-soft flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link href={'/'}>
          <Logo />
        </Link>
        
        {isInSignUpFlow && (
          <HorizontalStepper.Root className="gap-1">
            {steps.map((s, index) => {
              const state = getStepState(s.path);
              return (
                <div key={index} className="flex items-center">
                  {index > 0 && <HorizontalStepper.SeparatorIcon className="mx-1" />}
                  <HorizontalStepper.Item state={state}>
                    <HorizontalStepper.ItemIndicator>
                      {index + 1}
                    </HorizontalStepper.ItemIndicator>
                    <span>{s.label}</span>
                  </HorizontalStepper.Item>
                </div>
              );
            })}
          </HorizontalStepper.Root>
        )}
      </div>

      {isInSignUpFlow ? (
        <div>
          {pathname !== '/sign-up/email' && pathname !== '/sign-up' && (
            <Link href={pathname.split('/').slice(0, -1).join('/')}>
              <Button variant="neutral" mode="stroke">
                <RiArrowLeftSLine size={20} color="var(--text-sub-600)" />
                <span className="text-text-sub-600">Voltar</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-paragraph-sm text-sub-600">{t('need_help')}</p>
          <Button variant="neutral" mode="stroke">
            <ButtonIcon>
              <RiHeadphoneLine size={20} color="var(--text-sub-600)" />
            </ButtonIcon>
            <span className="text-label-sm text-sub-600">
              {t('speak_with_us')}
            </span>
          </Button>
        </div>
      )}
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
  return (
    <>
      <Header />

      <div className="w-full h-full px-11 py-6 flex relative flex-col justify-between">
        <div className="flex justify-center my-auto w-full">{children}</div>

        <Footer />
      </div>
    </>
  );
}
