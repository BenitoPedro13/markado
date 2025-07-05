'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import * as Button from '@/components/align-ui/ui/button';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {RiCalendarScheduleLine, RiCloseLine} from '@remixicon/react';
import ServiceCancelForm from './ServiceCancelForm';

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
  bookingId?: string; 
}

const ServiceFinalizationForm = ({
  host,
  service,
  bookingId = 'temp-booking-id' 
}: ServiceFinalizationFormProps) => {
  dayjs.locale('pt-br');
  
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleCancelClick = () => {
    setShowCancelForm(true);
  };

  const handleBackToMain = () => {
    setShowCancelForm(false);
  };

  if (showCancelForm) {
    return (
      <ServiceCancelForm 
        host={host}
        service={service}
        bookingId={bookingId}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[500px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
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
            Um e-mail com detalhes sobre a reunião foi enviado para todos os participantes.
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
            onClick={handleCancelClick}
          >
            <Button.Icon as={RiCloseLine} />
            Cancelar
          </Button.Root>

          <Button.Root
            variant="neutral"
            mode="stroke"
            className="items-center text-label-sm text-text-sub-600 grow"
            asChild
          >
            <Link href={`/${host.username}/${service.slug}`}> 
              <Button.Icon as={RiCalendarScheduleLine} />
              Reagendar
            </Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
};

export default ServiceFinalizationForm;
