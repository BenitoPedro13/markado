'use client';

import {TimezoneSelectWithStyle} from '@/components/TimezoneSelectWithStyle';
import * as Select from '@/components/align-ui/ui/select';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {useActionState, useState} from 'react';

import {routing} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import {RiGlobalLine} from '@remixicon/react';

import {updateGeneralAction} from '~/trpc/server/handlers/settings.handler';
import {FormActionState} from '@/types/formTypes';

interface GeneralFieldProps {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}

type Props = {
  me: NonNullable<Awaited<ReturnType<typeof getMeByUserId>>>;
};

const localeNames: Record<string, string> = {
  pt: 'PT-BR',
  en: 'EN-US'
};

const timeFormats = [
  {value: '24', label: '24 horas'},
  {value: '12', label: '12 horas (AM/PM)'}
];

const initialState: FormActionState = {
  success: false,
  errors: undefined
};

export default function General({me}: Props) {
  const [selectedLocale, setSelectedLocale] = useState(me.locale || 'EN-US');
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    me.timeZone || 'America/Sao_Paulo'
  );
  const [selectedHourFormat, setSelectedHourFormat] = useState(
    me.timeFormat?.toString() || '24'
  );
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    me.weekStart.toLocaleLowerCase() || 'sunday'
  );

  const t = useTranslations('LocaleSwitcher');

  const [state, formAction, isPending] = useActionState(
    updateGeneralAction,
    initialState
  );

  return (
    <form
      className="border border-stroke-soft-200 rounded-lg"
      action={formAction}
      id="form_general"
    >
      {state.errors && JSON.stringify(state.errors) !== '{}' && (
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="text-red-500 text-paragraph-sm">
            {Object.values(state.errors).map((error, index) => (
              <p key={index}>{error.join(', ')}</p>
            ))}
          </div>
        </div>
      )}
      <div className="p-6 border-b border-stroke-soft-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">Idioma</h3>
            <p className="text-paragraph-sm text-text-sub-600">
              O idioma exibido na interface.
            </p>
          </div>
          <div className="w-[400px]">
            <Select.Root
              value={selectedLocale}
              name="locale"
              onValueChange={setSelectedLocale}
              disabled={isPending}
            >
              <Select.Trigger className={'w-[120px] justify-between'}>
                <Select.Value>
                  <p className="whitespace-nowrap">
                    {localeNames[selectedLocale.toLowerCase()] ||
                      selectedLocale}
                  </p>
                </Select.Value>
                <RiGlobalLine size={20} />
              </Select.Trigger>
              <Select.Content>
                {routing.locales.map((cur) => (
                  <Select.Item
                    key={cur}
                    value={cur.toUpperCase()}
                    className="text-text-sub-600 text-paragraph-sm"
                  >
                    {t('locale', {locale: cur})}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-stroke-soft-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">
              Fuso Horário
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Alinhe com sua localização atual.
            </p>
          </div>
          <div className="w-[400px]">
            <TimezoneSelectWithStyle
              // value="America/Sao_Paulo"
              value={selectedTimeZone}
              onChange={setSelectedTimeZone}
              autoDetect={false}
              name="timeZone"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-stroke-soft-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">
              Formato de hora
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Escolha entre 24h ou 12h (AM/PM).
            </p>
          </div>
          <div className="w-[400px]">
            <Select.Root
              value={selectedHourFormat}
              onValueChange={(value) => setSelectedHourFormat(value)}
              name="timeFormat"
              disabled={isPending}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {timeFormats.map((format) => (
                  <Select.Item key={format.value} value={format.value}>
                    {format.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">
              Início da semana
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Dia inicial, geralmente domingo ou segunda-feira.
            </p>
          </div>
          <div className="w-[400px]">
            <Select.Root
              value={selectedWeekStart}
              onValueChange={setSelectedWeekStart}
              name="weekStart"
              disabled={isPending}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="sunday">Domingo</Select.Item>
                <Select.Item value="monday">Segunda-feira</Select.Item>
                <Select.Item value="tuesday">Terça-feira</Select.Item>
                <Select.Item value="wednesday">Quarta-feira</Select.Item>
                <Select.Item value="thursday">Quinta-feira</Select.Item>
                <Select.Item value="friday">Sexta-feira</Select.Item>
                <Select.Item value="saturday">Sábado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>
    </form>
  );
}
