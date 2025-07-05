'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import * as Button from '@/components/align-ui/ui/button';
import * as TextArea from '@/components/align-ui/ui/textarea';
import * as Badge from '@/components/align-ui/ui/badge';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {RiArrowLeftSLine, RiCloseFill, RiCalendarScheduleLine, RiInformationFill} from '@remixicon/react';

const FinalizationItem = ({
  label,
  value
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex items-center">
      <p className="text-paragraph-lg text-text-strong-950 w-1/2">{label}:</p>
      <p className="text-label-lg font-medium text-text-strong-950 w-1/2">{value}</p>
    </div>
  );
};

const DateTimeItem = ({
  label,
  dayName,
  date,
  time,
  strikethrough = false
}: {
  label: string;
  dayName: string;
  date: string;
  time: string;
  strikethrough?: boolean;
}) => {
  const textClass = strikethrough 
    ? "text-label-lg font-medium text-text-strong-950 line-through decoration-text-strong-950" 
    : "text-label-lg font-medium text-text-strong-950";

  return (
    <div className="flex items-start">
      <p className="text-paragraph-lg text-text-strong-950 w-1/2">{label}:</p>
      <div className="w-1/2">
        <p className={textClass}>{dayName},</p>
        <p className={textClass}>{date}</p>
        <p className={textClass}>{time}</p>
      </div>
    </div>
  );
};

const GuestItem = ({
  label,
  guestName,
  username,
  isHost = false
}: {
  label: string;
  guestName: string;
  username: string;
  isHost?: boolean;
}) => {
  return (
    <div className="flex items-start">
      <p className="text-paragraph-lg text-text-strong-950 w-1/2">{label}:</p>
      <div className="w-1/2">
        <div className="flex items-center gap-2">
          <span className="text-label-lg font-medium text-text-strong-950">
            {guestName}
          </span>
          {isHost && (
            <Badge.Root variant="light" color="sky" size="medium">
              Host
            </Badge.Root>
          )}
        </div>
        <p className="text-label-lg font-medium text-text-strong-950">
          {username}@markado.com
        </p>
      </div>
    </div>
  );
};

const HostItem = ({
  label,
  value
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center">
      <p className="text-paragraph-lg text-text-strong-950 w-1/2">{label}:</p>
      <p className="text-label-lg font-medium text-text-strong-950 w-1/2">{value}</p>
    </div>
  );
};

interface ServiceCancelFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
  bookingId?: string;
  onBack?: () => void;
}

const ServiceCancelForm = ({
  host,
  service,
  bookingId = 'temp-booking-id',
  onBack
}: ServiceCancelFormProps) => {
  dayjs.locale('pt-br');
  const router = useRouter();
  
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowSuccessMessage(true);
    setIsSubmitting(false);
  };

  const handleCancelWithoutReason = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowSuccessMessage(true);
    setIsSubmitting(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full md:max-w-[500px] flex flex-col gap-6 border border-stroke-soft-200 rounded-3xl p-8">
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
          
          <div className="flex flex-col gap-4">
            <FinalizationItem label="Assunto" value={service.title} />
            <DateTimeItem
              label="Horário marcado"
              dayName={dayjs().format('dddd')}
              date={dayjs().format('DD [de] MMMM [de] YYYY')}
              time={`${dayjs().format('HH:mm')}–${dayjs().add(1, 'hour').format('HH:mm')}`}
              strikethrough={true}
            />
            <FinalizationItem label="Local" value="Google Meet" />
            <HostItem label="Anfitrião" value={host.name ?? ''} />
            <GuestItem
              label="Convidado"
              guestName={host.name ?? ''}
              username={host.username ?? ''}
              isHost={true}
            />
          </div>
          
          <div className="flex gap-4">
            <Button.Root
              variant="neutral"
              mode="filled"
              className="items-center text-label-sm grow"
              asChild
            >
              <Link href={`/${host.username}/${service.slug}`}>
                <Button.Icon as={RiCalendarScheduleLine} />
                Agendar nova reunião
              </Link>
            </Button.Root>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[500px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
        <div className="flex flex-col gap-1">
          <Image
            src="/images/logoMarkado_.svg"
            className="mx-auto"
            alt="Logo"
            width={100}
            height={100}
          />
          <h1 className="text-label-xl font-medium text-center">
            Cancelar agendamento
          </h1>
          <p className="text-paragraph-lg text-text-strong-950 text-center">
            Tem certeza que deseja cancelar este agendamento?
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
        <GuestItem
          label="Convidado"
          guestName={host.name ?? ''}
          username={host.username ?? ''}
          isHost={true}
        />
        
        <Divider.Root className="w-full" />

        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-medium text-text-strong-950">
            Motivo do cancelamento
          </label>
          <TextArea.Root
            placeholder="Infelizmente não poderei comparecer por..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            maxLength={200}
            disabled={isSubmitting}
          >
            <TextArea.CharCounter
              current={cancellationReason.length}
              max={200}
            />
          </TextArea.Root>
          <div className="flex items-start gap-2 text-text-sub-600 text-paragraph-xs">
            <RiInformationFill className="w-3 h-3 text-text-soft-400" />
            O motivo do cancelamento será compartilhado com os convidados
          </div>
        </div>

        <div className="flex gap-4">
          <Button.Root
            variant="neutral"
            mode="stroke"
            className="items-center text-label-sm grow"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <Button.Icon as={RiArrowLeftSLine} /></Button.Root>

          <Button.Root
            variant="neutral"
            mode="stroke"
            className="items-center text-label-sm grow"
            onClick={handleCancelWithoutReason}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cancelando...' : 'Não importa'}
          </Button.Root>

          <Button.Root
            variant="error"
            mode="stroke"
            className="items-center text-label-sm grow"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cancelando...' : 'Cancelar este evento'}
          </Button.Root>
        </div>
      </div>
    </div>
  );
};

export default ServiceCancelForm;
