'use client';

import { useForm } from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Button from '@/components/align-ui/ui/button';
import { Service } from '@/types/service';
import * as Divider from '@/components/align-ui/ui/divider';
type ServiceDetailsFormData = Pick<Service, 'title' | 'description' | 'slug' | 'duration' | 'price' | 'location'>;

type Props = {
  slug: string;
};

export default function ServiceDetails({ slug }: Props) {
  const { register, handleSubmit, watch } = useForm<ServiceDetailsFormData>();
  const description = watch('description', ''); // Observa o valor do campo description

  const onSubmit = (data: ServiceDetailsFormData) => {
    console.log(data);
    // TODO: Implementar atualização do serviço
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className='text-title-h6'>Geral</div>
        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium text-text-strong-950">
            Título do Serviço
          </label>
          <Input.Root>
            <Input.Input {...register('title')} placeholder="Ex: Consulta de Marketing" />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium text-text-strong-950">
            Descrição
          </label>
          <Textarea.Root 
            placeholder="Descreva seu serviço..."
            {...register('description')}
          >
            <Textarea.CharCounter current={description.length} max={500} />
          </Textarea.Root>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium text-text-strong-950">
            Link do Serviço
          </label>
          <Input.Root>
          <Input.Affix>app.markado.co/marcaum/</Input.Affix>
            <Input.Input {...register('slug')} placeholder="consulta-marketing" />
          </Input.Root>
          <span className="text-paragraph-xs text-text-sub-600">
            Este será o link usado para compartilhar seu serviço
          </span>
        </div>
        <Divider.Root />
        <div className='text-title-h6'>Dados do Serviço</div>
        <div className="grid grid-cols-2 gap-4">
          <div className='flex flex-col gap-2'>
            <label className="text-sm font-medium text-text-strong-950">
              Duração (minutos)
            </label>
            <Input.Root>
              <Input.Input 
                type="number" 
                {...register('duration')} 
                placeholder="60" 
              />
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className="text-sm font-medium text-text-strong-950">
              Preço (R$)
            </label>
            <Input.Root>
              <Input.Input 
                type="number" 
                {...register('price')} 
                placeholder="100.00" 
                step="0.01"
              />
            </Input.Root>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium text-text-strong-950">
            Localização
          </label>
          <Input.Root>
            <Input.Input 
              {...register('location')} 
              placeholder="Ex: Online via Google Meet" 
            />
          </Input.Root>
        </div>
      </div>


    </form>
  );
} 