'use client';

import { useScheduling } from '@/contexts/SchedulingContext';
import * as Badge from '@/components/align-ui/ui/badge';
import * as Button from '@/components/align-ui/ui/button';

import { RiComputerLine, RiMapPinLine, RiEditLine, RiTimeLine } from '@remixicon/react';


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
  const { updateSchedulingStatus, deleteScheduling } = useScheduling();

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg shadow ${
      status === 'canceled' ? 'opacity-60' : ''
    }`}>
      {/* Lado Esquerdo */}
      <div className="flex gap-8">
        {/* Bloco do Título e Organizador */}
        <div className="w-[250px]">
          <h3 className="text-paragraph-lg font-medium text-text-strong-950">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge.Root size="medium" variant="lighter" color={type === 'online' ? 'blue' : 'green'}>
              <Badge.Icon as={type === 'online' ? RiComputerLine : RiMapPinLine} />
              {type === 'online' ? 'Online' : 'Presencial'}
            </Badge.Root>
            <span className="text-sm text-text-sub-600">{organizer}</span>
          </div>
        </div>

        {/* Bloco da Data e Duração */}
        <div className='items-start'>
          <div className="flex items-center gap-2 text-text-strong-950">
            <span className="font-medium">{weekDay}</span>
            
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge.Root className='text-paragraph-sm' size="medium" variant="lighter" color="gray">
              <Badge.Icon as={RiTimeLine} />
              {duration}min
            </Badge.Root>
            
            <span className="text-paragraph-sm text-text-sub-600">{time} até {endTime}</span>
          </div>
        </div>
      </div>

      {/* Lado Direito - Ações */}
      <div className="flex items-center gap-3">
        <Button.Root
          variant="neutral"
          mode="ghost"
          size="small"
          asChild
        >
          <a
            href="https://meet.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Button.Icon as={() => <img src="/logo/google-meet.svg" alt="Google Meet" className="w-4 h-4" />} />
            Entrar no Google Meet
          </a>
        </Button.Root>

        <Button.Root
          variant={status === 'confirmed' ? 'error' : 'primary'}
          mode="ghost"
          size="small"
          onClick={() => updateSchedulingStatus(id, status === 'confirmed' ? 'canceled' : 'confirmed')}
        >
          {status === 'confirmed' ? 'Cancelar evento' : 'Confirmar evento'}
        </Button.Root>

        <Button.Root
          variant="neutral"
          mode="ghost"
          size="small"
          onClick={() => deleteScheduling(id)}
        >
          <Button.Icon as={RiEditLine} />
          Editar
        </Button.Root>
      </div>
    </div>
  );
} 