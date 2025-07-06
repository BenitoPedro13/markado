'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import * as Badge from '@/components/align-ui/ui/badge';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {RiCloseFill} from '@remixicon/react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

const DateTimeDisplay = ({
  date,
  endDate,
  timeZone,
  variant = 'default'
}: {
  date: Date;
  endDate: Date;
  timeZone: string;
  variant?: 'default' | 'cancelled';
}) => {
  const userTimezone = timeZone || 'America/Sao_Paulo';
  const startTime = dayjs(date).tz(userTimezone);
  const endTime = dayjs(endDate).tz(userTimezone);
  
  return (
    <div className={`flex flex-col ${variant === 'cancelled' ? 'line-through' : ''}`}>
      <div className="text-label-lg font-medium text-text-strong-950">
        {startTime.format('dddd,')}
      </div>
      <div className="text-label-lg font-medium text-text-strong-950">
        {startTime.format('DD [de] MMMM [de] YYYY')}
      </div>
      <div className="text-label-lg font-medium text-text-strong-950">
        {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
      </div>
    </div>
  );
};

const FinalizationItem = ({
  label,
  value,
  variant = 'default'
}: {
  label: string;
  value: string | number;
  variant?: 'default' | 'cancelled';
}) => {
  return (
    <div className="flex items-start gap-2">
      <p className="text-paragraph-lg text-text-strong-950 w-1/2">{label}:</p>
      <p
        className={`text-label-lg font-medium text-text-strong-950 w-1/2 text-left ${variant === 'cancelled' && 'line-through'}`}
      >
        {value}
      </p>
    </div>
  );
};

interface ServiceFinalizationFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
  bookingId?: string; 
}

const ServiceCancelledView = ({
  host,
  service,
  bookingId = 'temp-booking-id' 
}: ServiceFinalizationFormProps) => {
  dayjs.locale('pt-br');
  
  // Create example dates for display
  const exampleDate = new Date();
  const exampleEndDate = new Date(exampleDate.getTime() + 60 * 60 * 1000); // 1 hour later

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[500px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
          <div className="flex flex-col gap-4 items-center">

              <div className="full bg-[#f8dedd] dark:bg-[#2b1718]  rounded-full flex items-center justify-center">
              <RiCloseFill 
                size={100} 
                className='stroke-2 stroke-[#de5354] fill-[#de5354] dark:stroke-[#ea1714]  dark:fill-[#ea1714]'
              />
              </div>
              
              <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-2xl font-semibold text-label-xl">
                    Evento cancelado
                  </h1>
                  <p className="text-text-sub-600 paragraph-lg">
                    Um e-mail com detalhes sobre a reunião foi enviado para todos os participantes.
                  </p>
              </div>
            </div>
          
        <Divider.Root className="w-full" />
        
        <FinalizationItem label="Assunto" value={service.title} />
        
        <div className="flex items-start gap-2">
          <p className="text-paragraph-lg text-text-strong-950 w-1/2">Horário marcado:</p>
          <div className="w-1/2">
            <DateTimeDisplay
              date={exampleDate}
              endDate={exampleEndDate}
              timeZone={host.timeZone || 'America/Sao_Paulo'}
              variant="cancelled"
            />
          </div>
        </div>
        <FinalizationItem label="Local" value="Google Meet" />
        <FinalizationItem label="Anfitrião" value={host.name ?? ''} />
        <div className="flex items-start gap-2">
          <p className="text-paragraph-lg text-text-strong-950 w-1/2">Convidado:</p>
          <div className="w-1/2 flex items-center gap-2">
            <p className="text-label-lg font-medium text-text-strong-950">
              João da Silva
            </p>
            <Badge.Root variant="light" color="blue" size="small">
              Host
            </Badge.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCancelledView;
