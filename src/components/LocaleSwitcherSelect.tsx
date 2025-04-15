'use client';

import * as Select from '@/components/align-ui/ui/select';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { RiGlobalLine } from '@remixicon/react';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { ReactNode, useTransition } from 'react';

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const locale = useLocale();
  const localeDisplayName = localeNames[locale] || locale; // Obter o nome completo ou usar o código como fallback

  function onSelectChange(value: any) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <label
      className={clsx(
        'relative text-gray-400 flex gap-1 items-center',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <p className="sr-only">{label}</p>

      <Select.Root
        defaultValue={defaultValue}
        disabled={isPending}
        onValueChange={onSelectChange}
      >
        <Select.Trigger className="flex items-center gap-1 border-none">
          <RiGlobalLine size={20} color="var(--text-soft-400)" />
          <span className='text-text-sub-600 text-paragraph-sm'>{localeDisplayName}</span>
          
        </Select.Trigger>
        <Select.Content>{children}</Select.Content>
      </Select.Root>
      {/* <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span> */}
    </label>
  );
}
