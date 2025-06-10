'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Image from 'next/image';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';

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
    <div className="flex justify-between items-center">
      <p className="text-paragraph-lg text-text-strong-950">{label}:</p>
      <p
        className={`text-label-lg font-medium text-text-strong-950 text-end ${variant === 'cancelled' && 'line-through'}`}
      >
        {value}
      </p>
    </div>
  );
};

interface ServiceFinalizationFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
}

const ServiceCancelForm = ({host, service}: ServiceFinalizationFormProps) => {
  dayjs.locale('pt-br');

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[400px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
        <div className="flex flex-col gap-1 ">
          <Image
            src="/images/red_x.svg"
            className="mx-auto"
            alt="Logo"
            width={100}
            height={100}
          />
          <h1 className="text-label-xl font-medium text-center">
            Evento cancelado
          </h1>
          <p className="text-paragraph-lg text-text-strong-950 text-center">
            Um e-mail com o motivo do cancelamento foi enviado para todos os
            participantes.
          </p>
        </div>
        <Divider.Root className="w-full" />
        <FinalizationItem label="Assunto" value={service.title} />

        <FinalizationItem
          label="Data marcada"
          value={dayjs().format('DD/MM/YYYY')}
        />

        <FinalizationItem
          label="Horário marcado"
          value={`${dayjs().format('dddd, DD [de] MMMM [de] YYYY')} ${dayjs().format('HH:mm')} até ${dayjs()
            .add(1, 'hour')
            .format('HH:mm')}`}
          variant="cancelled"
        />

        <FinalizationItem label="Local" value="Google Meet" />
        <FinalizationItem label="Anfitrião" value={host.name ?? ''} />
        <FinalizationItem label="Convidado" value="João da Silva" />
      </div>
    </div>
  );
};

export default ServiceCancelForm;
