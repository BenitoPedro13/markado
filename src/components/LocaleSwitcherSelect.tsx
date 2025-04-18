'use client';

import * as Select from '@/components/align-ui/ui/select';
import { RiGlobalLine } from '@remixicon/react';
import clsx from 'clsx';
import { ReactNode, useTransition, useEffect, useState } from 'react';
import { useTRPC } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { type inferRouterInputs } from '@trpc/server';
import { type AppRouter } from '~/trpc/server';
import { TRPCClientErrorLike } from '@trpc/client';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

type UpdateLocaleInput = inferRouterInputs<AppRouter>['auth']['updateLocale'];

const localeNames: Record<string, string> = {
  pt: 'PT-BR',
  en: 'EN-US'
};

/**
 * A select element to switch between locales.
 *
 * Change to the layout of your preference.
 *
 * @param children The options to render inside the select element.
 * @param defaultValue The default value for the select element.
 * @param label The label for the select element.
 */
export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState(defaultValue);
  const trpc = useTRPC();

  useEffect(() => {
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale) {
      setCurrentLocale(cookieLocale.toUpperCase());
    }
  }, []);

  const { mutate: updateLocale } = useMutation(trpc.auth.updateLocale.mutationOptions({
    onSuccess: (_result, variables: UpdateLocaleInput) => {
      setLocaleCookie(variables.locale);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>, variables: UpdateLocaleInput) => {
      console.log('updateLocale error', error);
      // If the error is "Not authenticated", still set the cookie with the attempted locale
      if (error.message === 'Not authenticated') {
        setLocaleCookie(variables.locale);
      }
    }
  }));

  const setLocaleCookie = (locale: string) => {
    // Set the NEXT_LOCALE cookie with the new locale
    Cookies.set('NEXT_LOCALE', locale.toLowerCase());
    // Refresh the page to apply the new locale
    window.location.reload();
  };

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      const locale = newLocale.toUpperCase() as UpdateLocaleInput['locale'];
      setCurrentLocale(locale);
      updateLocale({ locale });
    });
  };

  return (
    <Select.Root
      value={currentLocale}
      onValueChange={handleLocaleChange}
      disabled={isPending}
    >
      <Select.Trigger
        className={clsx(
          'w-[120px] justify-between',
          isPending && 'opacity-50'
        )}
      >
        <Select.Value>
          <p className='whitespace-nowrap'>
            {localeNames[currentLocale.toLowerCase()] || currentLocale}
          </p>
        </Select.Value>
        <RiGlobalLine size={20} />
      </Select.Trigger>
      <Select.Content>
        <div className="px-2 py-1.5 text-sm font-semibold">{label}</div>
        {children}
      </Select.Content>
    </Select.Root>
  );
}
