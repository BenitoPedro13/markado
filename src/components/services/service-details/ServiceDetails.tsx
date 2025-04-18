'use client';

import {useForm} from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Button from '@/components/align-ui/ui/button';
import {Service, ServiceBadgeColor} from '@/types/service';
import * as Divider from '@/components/align-ui/ui/divider';
import {services} from '@/data/services';
import {useEffect, useRef} from 'react';
import * as Select from '@/components/align-ui/ui/select';

type ServiceDetailsFormData = Pick<
  Service,
  | 'title'
  | 'description'
  | 'slug'
  | 'duration'
  | 'price'
  | 'location'
  | 'badgeColor'
>;

// Array com as opções de cores e seus emojis
const colorOptions: {value: ServiceBadgeColor; label: string}[] = [
  {value: 'faded', label: 'Cinza ⚫️'},
  {value: 'information', label: 'Azul 🔵'},
  {value: 'warning', label: 'Amarelo 🟡'},
  {value: 'error', label: 'Vermelho 🔴'},
  {value: 'success', label: 'Verde 🟢'},
  {value: 'away', label: 'Laranja 🟧'},
  {value: 'feature', label: 'Roxo 🟣'},
  {value: 'verified', label: 'Azul Céu 🔷'},
  {value: 'highlighted', label: 'Rosa 🎀'},
  {value: 'stable', label: 'Verde Água 🌊'}
];

type Props = {
  slug: string;
};

export default function ServiceDetails({slug}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const {register, handleSubmit, watch, setValue} =
    useForm<ServiceDetailsFormData>();
  const description = watch('description') || '';
  const service = services.find((s) => s.slug === slug);

  // Carrega os dados do serviço atual
  useEffect(() => {
    if (service) {
      setValue('title', service.title);
      setValue('slug', service.slug);
      setValue('duration', service.duration);
      setValue('price', service.price);
      setValue('badgeColor', service.badgeColor);
      setValue('description', service.description || '');
      setValue('location', service.location || '');
    }
  }, [slug, setValue, service]);

  const onSubmit = async (data: ServiceDetailsFormData) => {
    try {
      const serviceIndex = services.findIndex(
        (service) => service.slug === slug
      );

      if (serviceIndex !== -1) {
        services[serviceIndex] = {
          ...services[serviceIndex],
          ...data,
          price: Number(data.price),
          duration: Number(data.duration)
        };

        console.log('Serviço atualizado:', services[serviceIndex]);
        alert('Serviço atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      alert('Erro ao atualizar serviço. Tente novamente.');
    }
  };

  // Expõe a função de submit para o componente pai
  useEffect(() => {
    const submitForm = () => {
      formRef.current?.requestSubmit();
    };

    // Adiciona ao objeto window para que o Header possa acessar
    (window as any).submitServiceForm = submitForm;

    return () => {
      delete (window as any).submitServiceForm;
    };
  }, []);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="text-title-h6">Geral</div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-strong-950">
            Título do Serviço
          </label>
          <Input.Root>
            <Input.Input
              {...register('title')}
              placeholder="Ex: Consulta de Marketing"
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
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

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-strong-950">
              Link do Serviço
            </label>
            <Input.Root>
              <Input.Affix>app.markado.co/marcaum/</Input.Affix>
              <Input.Input
                {...register('slug')}
                placeholder="consulta-marketing"
              />
            </Input.Root>
            <span className="text-paragraph-xs text-text-sub-600">
              Este será o link usado para compartilhar seu serviço
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-strong-950">
              Cor do Serviço
            </label>
            <Select.Root
              value={service?.badgeColor}
              onValueChange={(value) =>
                setValue('badgeColor', value as ServiceBadgeColor)
              }
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Selecione uma cor" />
              </Select.Trigger>
              <Select.Content>
                {colorOptions.map((color) => (
                  <Select.Item key={color.value} value={color.value}>
                    {color.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <span className="text-paragraph-xs text-text-sub-600">
              Esta cor será usada para identificar visualmente o serviço
            </span>
          </div>
        </div>

        <Divider.Root />
        <div className="text-title-h6">Dados do Serviço</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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
