'use client';

import {useScheduling} from '@/contexts/SchedulingContext';
import * as Badge from '@/components/align-ui/ui/badge';
import * as Button from '@/components/align-ui/ui/button';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import * as Drawer from '@/components/align-ui/ui/drawer';
import * as Divider from '@/components/align-ui/ui/divider';
import {
  RiComputerLine,
  RiMapPinLine,
  RiEditLine,
  RiTimeLine,
  RiMore2Fill,
  RiDeleteBinLine,
  RiPencilLine,
  RiUserAddLine,
  RiMapPin2Line
} from '@remixicon/react';

type SchedulingProps = {
  id: string;
  title: string;
  duration: number;
  date: string;
  weekDay: string;
  time: string;
  endTime: string;
  organizer: string;
  type: 'online' | 'presential';
  status: 'confirmed' | 'canceled';
};

export default function Scheduling({
  id,
  title,
  duration,
  date,
  weekDay,
  time,
  endTime,
  organizer,
  type,
  status
}: SchedulingProps) {
  const {updateSchedulingStatus, deleteScheduling} = useScheduling();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <div
          className={`flex items-center justify-between  cursor-pointer p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg shadow ${
            status === 'canceled' ? 'opacity-60' : ''
          }`}
        >
          {/* Lado Esquerdo */}
          <div className="flex gap-8">
            {/* Bloco do Título e Organizador */}
            <div className="w-[250px]">
              <h3 className="text-paragraph-lg font-medium text-text-strong-950">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge.Root
                  className="text-label-sm"
                  size="medium"
                  variant="lighter"
                  color={type === 'online' ? 'blue' : 'green'}
                >
                  <Badge.Icon
                    as={type === 'online' ? RiComputerLine : RiMapPinLine}
                  />
                  {type === 'online' ? 'Online' : 'Presencial'}
                </Badge.Root>
                <span className="text-sm text-text-sub-600">{organizer}</span>
              </div>
            </div>

            {/* Bloco da Data e Duração */}
            <div className="items-start">
              <div className="flex items-center gap-2 text-text-strong-950">
                <span className="font-medium">{weekDay}</span>
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge.Root
                  className="text-label-sm"
                  size="medium"
                  variant="lighter"
                  color="orange"
                >
                  <Badge.Icon as={RiTimeLine} />
                  {duration}min
                </Badge.Root>
                <span className="text-paragraph-sm text-text-sub-600">
                  {time} até {endTime}
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito - Ações */}
          <div className="flex items-center gap-3">
          {type === 'online' ? (
            <Button.Root variant="neutral" mode="ghost" size="small" className='text-blue-400'>
              <img src="/logos/Google Meet.svg" width={20} height={20}/>
              Entrar no Google Meet
            </Button.Root>
          ) : (<Button.Root variant="neutral" mode="stroke" size="small" className='text-text-strong-950'>
            <Button.Icon as={RiMapPinLine}/>
            Obter Rotas
          </Button.Root>)}
            <Button.Root variant="neutral" mode="stroke" size="small">
              Reagendar agendamento
            </Button.Root>

            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <Button.Root variant="neutral" mode="stroke" size="small">
                  <Button.Icon as={RiMore2Fill} />
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content align="end" className="w-fit">
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiMapPinLine} />
                  Editar localização
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiUserAddLine} />
                  Adicionar participantes
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiDeleteBinLine} />
                  Cancelar agendamento
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        </div>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Detalhe do agendamento</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="space-y-4 h-full flex flex-col">
            <Divider.Root variant="solid-text">Data e Hora</Divider.Root>
            <div className="rounded-lg px-6 py-4 space-y-2">
              <div className="text-title-h4 text-text-strong-950">
                {time} até {endTime}
              </div>
              <div className="text-paragraph-md text-text-strong-950">
                {weekDay}, {date}
              </div>
            </div>
            <Divider.Root variant='solid-text'>Convidado</Divider.Root>
            <div className="px-4 rounded-lg space-y-2">
              
              <div className="flex items-center gap-3">
                <div className="bg-success-lighter text-success-base rounded-full size-10 flex items-center justify-center text-heading-sm">
                  {organizer
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {organizer}
                  </div>
                  <div className="text-paragraph-sm text-text-sub-600">
                    {organizer.toLowerCase()}@gmail.com
                  </div>
                </div>
              </div>
            </div>
            <Divider.Root variant='solid-text'>Convidado</Divider.Root>
            <div className="px-4 rounded-lg space-y-2">
              <div className="space-y-4">
                <div className='flex flex-col gap-2'>
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    ASSUNTO
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {title}
                  </div>
                </div>
                <Divider.Root/>
                <div className='flex flex-col gap-2'>
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    LOCAL
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {type === 'online' ? <Button.Root variant="neutral" mode="ghost" size="small">
              <img src="/logos/Google Meet.svg" width={20} height={20}/>
              Entrar com Google Meet
            </Button.Root> : 'Presencial'}
                  </div>
                </div>
                <Divider.Root/>
                <div className='flex flex-col gap-2'>
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    DESCRIÇÃO
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    Um e-mail com detalhes sobre a reunião foi enviado para
                    todos os participantes.
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col justify-end ">
              <div className="bg-bg-weak-50 p-4 rounded-lg">
                <div className="text-subheading-xs text-text-soft-400 uppercase">
                  PRECISA ALTERAR?
              </div>
              <div className="mt-4 flex gap-3">
                <Button.Root
                  variant="error"
                  mode="stroke"
                  size="medium"
                  className="w-full"
                  onClick={() => updateSchedulingStatus(id, 'canceled')}
                >
                  Cancelar
                </Button.Root>
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="medium"
                  className="w-full"
                >
                  Reagendar
                </Button.Root>
              </div>
              </div>
              </div>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
