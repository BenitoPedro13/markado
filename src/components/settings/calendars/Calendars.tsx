'use client';

import * as Input from '@/components/align-ui/ui/input';
import * as Button from '@/components/align-ui/ui/button';
import { RiAddLine, RiDeleteBinLine, RiInformationLine } from '@remixicon/react';

interface CalendarItemProps {
  icon?: React.ReactNode;
  name: string;
  email?: string;
  onDelete?: () => void;
  isActive?: boolean;
}

const CalendarItem = ({ icon, name, email, onDelete, isActive = true }: CalendarItemProps) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isActive} className="sr-only peer" onChange={() => {}} />
          <div className="w-9 h-5 bg-bg-weak-50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-base"></div>
        </label>
      </div>
      <div className="flex flex-col">
        <span className="text-paragraph-md text-text-strong-950">{name}</span>
        {email && <span className="text-paragraph-sm text-text-sub-600">{email}</span>}
      </div>
    </div>
    {onDelete && (
      <Button.Root variant="neutral" mode="ghost" onClick={onDelete}>
        <RiDeleteBinLine className="size-5 text-text-sub-600" />
      </Button.Root>
    )}
  </div>
);

export default function Calendars() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-sm text-text-strong-950">Configurações de calendário</h2>
        <p className="text-paragraph-md text-text-sub-600">Gerencie suas integrações de calendário.</p>
      </div>

      <div className="space-y-8">
        <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
          <div className="p-6">
            <div className="space-y-1">
              <h3 className="text-paragraph-md text-text-strong-950">Adicionar ao calendário</h3>
              <p className="text-paragraph-sm text-text-sub-600">Selecione onde adicionar eventos quando estiver reservado.</p>
            </div>
            <div className="mt-4">
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value="Marcus Vinicius da Silva Dutra (Google - Marcus Vinicius da Silva Dutra)"
                  />
                </Input.Wrapper>
              </Input.Root>
              <div className="mt-2 flex items-center gap-2 text-paragraph-sm text-text-sub-600">
                <RiInformationLine className="size-4" />
                <span>Você pode substituir isso por evento em Configurações avançadas em cada tipo de evento.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-paragraph-md text-text-strong-950">Verifique se há conflitos</h3>
                <p className="text-paragraph-sm text-text-sub-600">Selecione quais calendários você deseja verificar se há conflitos para evitar reservas duplicadas.</p>
              </div>
              <Button.Root variant="neutral" mode="ghost">
                <RiAddLine className="size-5" />
                <span>Adicionar</span>
              </Button.Root>
            </div>
          </div>

          <div className="divide-y divide-stroke-soft-200">
            <div className="px-6">
              <CalendarItem
                icon={<img src="/google-calendar-icon.png" alt="Google Calendar" className="size-6" />}
                name="Google calendar"
                email="navalservice1@gmail.com"
                onDelete={() => {}}
              />
            </div>
            <div className="px-6">
              <CalendarItem
                name="Marcus Vinicius da Silva Dutra"
                isActive={true}
              />
            </div>
            <div className="px-6">
              <CalendarItem
                name="Coursera Calendar - Marcus Dutra - navalservice1@gmail.com"
                isActive={false}
              />
            </div>
            <div className="px-6">
              <CalendarItem
                name="Feriados no Brasil"
                isActive={false}
              />
            </div>
            <div className="px-6">
              <CalendarItem
                name="Family"
                isActive={false}
              />
            </div>
            <div className="px-6">
              <CalendarItem
                name="Go park"
                isActive={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 