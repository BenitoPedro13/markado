'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import * as Button from '@/components/align-ui/ui/button';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {RiCalendarScheduleLine, RiCloseLine} from '@remixicon/react';

const FinalizationItem = ({
  label,
  value
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-paragraph-lg text-text-strong-950">{label}:</p>
      <p className="text-label-lg font-medium text-text-strong-950">{value}</p>
    </div>
  );
};

interface ServiceFinalizationFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
}

const ServiceFinalizationForm = ({
  host,
  service
}: ServiceFinalizationFormProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[400px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
        <div className="flex flex-col gap-1 ">
          <Image
            src="/images/logoMarkado_.svg"
            className="mx-auto"
            alt="Logo"
            width={100}
            height={100}
          />
          <h1 className="text-label-xl font-medium text-center">
            Reunião marcada com sucesso!
          </h1>
          <p className="text-paragraph-lg text-text-strong-950 text-center">
            Um e-mail com detalhes sobre a reunião foi enviado para todos os
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
          label="Hora marcada"
          value={`${dayjs().format('HH:mm')} até ${dayjs()
            .add(1, 'hour')
            .format('HH:mm')}`}
        />

        <FinalizationItem label="Local" value="Google Meet" />
        <FinalizationItem label="Anfitrião" value={host.name ?? ''} />
        <FinalizationItem label="Convidado" value="João da Silva" />
        <Divider.Root className="w-full" />

        <p className="text-label-sm text-text-strong-950 mx-auto underline">
          Precisa alterar?
        </p>
        <div className="flex gap-4 itemc">
          <Button.Root
            variant="error"
            mode="stroke"
            className="items-center text-label-sm grow"
          >
            <Button.Icon as={RiCloseLine} />
            <Link href={`/${host.username}`}>Cancelar</Link>
          </Button.Root>

          <Button.Root
            variant="neutral"
            mode="stroke"
            className="items-center text-label-sm text-text-sub-600 grow"
          >
            <Button.Icon as={RiCalendarScheduleLine} />
            <Link href={`/${host.username}/${service.slug}`}>Reagendar</Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
};

export default ServiceFinalizationForm;
