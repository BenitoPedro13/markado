'use client';

import * as Input from '@/components/align-ui/ui/input';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {TimezoneSelectWithStyle} from '@/components/TimezoneSelectWithStyle';
import * as Select from '@/components/align-ui/ui/select';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';

interface GeneralFieldProps {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}

type Props = {
  me: NonNullable<Awaited<ReturnType<typeof getMeByUserId>>>;
};

export default function General({me}: Props) {
  return (
    <div className="space-y-8">
      <div className="border border-stroke-soft-200 rounded-lg ">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1 w-[280px]">
              <h3 className="text-paragraph-md text-text-strong-950">Idioma</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                O idioma exibido na interface.
              </p>
            </div>
            <div className="w-[400px]">
              <LocaleSwitcher />
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
                value={me.timeZone}
                onChange={(value) => {}}
                autoDetect={false}
                defaultValue="America/Sao_Paulo"
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
              <Select.Root defaultValue="24h">
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="24h">24 horas</Select.Item>
                  <Select.Item value="12h">12 horas (AM/PM)</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-stroke-soft-200">
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
              <Select.Root defaultValue="monday">
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
      </div>
    </div>
  );
}
