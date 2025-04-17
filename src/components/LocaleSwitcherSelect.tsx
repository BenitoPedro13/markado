'use client';

import * as Select from '@/components/align-ui/ui/select';
import { RiGlobalLine } from '@remixicon/react';
import clsx from 'clsx';
import { ReactNode, useTransition, useEffect, useState } from 'react';
import { useTRPC } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

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

  const { mutate: updateLocale } = useMutation(trpc.updateLocale.mutationOptions({
    onSuccess: (_, variables) => {
      setLocaleCookie(variables.locale);
    },
    onError: (error, variables) => {
      console.log('updateLocale error', error);
      // If the error is "Not authenticated", still set the cookie with the attempted locale
      if (error.message === 'Not authenticated') {
        setLocaleCookie(variables.locale);
      }
    }
  }));

  const setLocaleCookie = (locale: string) => {
    console.log('setLocaleCookie', locale);
    // Set the NEXT_LOCALE cookie with the new locale
    Cookies.set('NEXT_LOCALE', locale.toLowerCase());
    console.log('Cookies.get("NEXT_LOCALE")', Cookies.get("NEXT_LOCALE"));
    // Refresh the page to apply the new locale
    window.location.reload();
  };

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      setCurrentLocale(newLocale.toUpperCase());
      updateLocale({ locale: newLocale.toUpperCase() as 'PT' | 'EN' });
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
