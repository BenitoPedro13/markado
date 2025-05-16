'use client';

import * as Divider from '@/components/align-ui/ui/divider';
import {useScheduling} from '@/contexts/SchedulingContext';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
const ServiceFinalizationForm = () => {
  const {status} = useParams();
  const {service} = useScheduling();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="w-full md:max-w-[400px] flex flex-col gap-5 border border-stroke-soft-200 rounded-3xl p-6">
        <div className="flex flex-col gap-1">
          <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
          <h1 className="text-label-xl font-medium text-center">
            Reunião marcada com sucesso!
          </h1>
          <p className="text-paragraph-lg text-text-strong-950 text-center">
            Um e-mail com detalhes sobre a reunião foi enviado para todos os
            participantes.
          </p>
        </div>
        <Divider.Root className="w-full" />
        <div className="flex justify-between items-center">
          <p className="text-paragraph-lg text-text-strong-950">Assunto:</p>
          <p className="text-label-sm font-medium text-text-strong-950">
            {service}
          </p>
        </div>
        <Divider.Root className="w-full" />
        <Link href="/">Precisa alterar?</Link>
      </div>
    </div>
  );
};

export default ServiceFinalizationForm;
