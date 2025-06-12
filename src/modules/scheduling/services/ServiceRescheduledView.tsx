'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import * as Button from '@/components/align-ui/ui/button';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Hint from '@/components/align-ui/ui/hint';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {
  RiCalendarScheduleLine,
  RiCloseLine,
  RiInformationFill
} from '@remixicon/react';
import {useState} from 'react';

const FinalizationItem = ({
  label,
  value,
  variant = 'default'
}: {
  label: string;
  value: string | number;
  variant?: 'default' | 'cancelled' | 'blank';
}) => {
  return (
    <div className="flex justify-between items-center">
      {variant !== 'blank' && (
        <p className="text-paragraph-lg text-text-strong-950">{label}:</p>
      )}
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

const ServiceRescheduledView = ({
  host,
  service
}: ServiceFinalizationFormProps) => {
  const [canceling, setCanceling] = useState(false);

  const FinalizationFooter = (
    <>
      <p className="text-label-sm text-text-strong-950 mx-auto underline">
        Precisa alterar?
      </p>
      <div className="flex gap-4 itemc">
        <Button.Root
          variant="error"
          mode="stroke"
          className="items-center text-label-sm grow"
          onClick={() => setCanceling(true)}
        >
          <Button.Icon as={RiCloseLine} />
          Cancelar
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
    </>
  );

  const CancelingFooter = (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-label-sm">Motivo do cancelamento</p>
        <Textarea.Root
          className="w-full pb-0"
          placeholder="Infelizmente não poderei comparecer por...."
        >
          <Textarea.CharCounter className="text-text-soft-400" />
        </Textarea.Root>
        <Hint.Root className="text-label-xs">
          <Hint.Icon as={RiInformationFill} />O motivo do cancelamento será
          compartilhado com os convidados
        </Hint.Root>
      </div>
      <div className="flex gap-4 justify-start">
        <Button.Root variant="neutral" mode="stroke" className="">
          <Link
            href={`/${host.username}/${service.slug}/finalization?status=cancelled`}
          >
            Não importa
          </Link>
        </Button.Root>
        <Button.Root variant="error" mode="stroke" className="">
          <Link
            href={`/${host.username}/${service.slug}/finalization?status=cancelled`}
          >
            Cancelar este evento
          </Link>
        </Button.Root>
      </div>
    </>
  );

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
            Reunião reagendada com sucesso!
          </h1>
          <p className="text-paragraph-lg text-text-strong-950 text-center">
            Um e-mail com detalhes sobre a alteração foi enviado para todos os
            participantes.
          </p>
        </div>
        <Divider.Root className="w-full" />
        <FinalizationItem label="Assunto" value={service.title} />

        <FinalizationItem
          label="Horário anterior"
          value={`${dayjs().format('dddd, DD [de] MMMM [de] YYYY')} ${dayjs().format('HH:mm')} até ${dayjs()
            .add(1, 'hour')
            .format('HH:mm')}`}
          variant="cancelled"
        />
        <FinalizationItem
          label="Novo horário"
          value={`${dayjs().add(2, 'day').format('dddd, DD [de] MMMM [de] YYYY')} ${dayjs().format('HH:mm')} até ${dayjs()
            .add(1, 'hour')
            .format('HH:mm')}`}
        />

        <FinalizationItem label="Local" value="Google Meet" />
        <FinalizationItem label="Anfitrião" value={host.name ?? ''} />
        <FinalizationItem label="Convidado" value="João da Silva" />
        <Divider.Root className="w-full" />
        {canceling ? CancelingFooter : FinalizationFooter}
      </div>
    </div>
  );
};

export default ServiceRescheduledView;
