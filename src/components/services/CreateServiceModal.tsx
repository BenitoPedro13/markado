'use client';

import {useForm} from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import * as Modal from '@/components/align-ui/ui/modal';
import {useServices} from '@/contexts/services/ServicesContext';
import {Service, ServiceBadgeColor} from '@/types/service';
import {useState} from 'react';
import React from 'react';

import * as Hint from '@/components/align-ui/ui/hint';
import {RiErrorWarningFill} from '@remixicon/react';
import {MARKADO_DOMAIN} from '@/constants';
import {createServiceHandler} from '~/trpc/server/handlers/services.handler';
import {useNotification} from '@/hooks/use-notification';
import {useLocale} from '@/hooks/use-locale';

type CreateServiceFormData = Omit<Service, 'status'>;

const colorOptions = [
  {value: 'faded' as ServiceBadgeColor, label: 'Cinza', emoji: '⚫️'},
  {value: 'information' as ServiceBadgeColor, label: 'Azul', emoji: '🔵'},
  {value: 'warning' as ServiceBadgeColor, label: 'Amarelo', emoji: '🟡'},
  {value: 'error' as ServiceBadgeColor, label: 'Vermelho', emoji: '🔴'},
  {value: 'success' as ServiceBadgeColor, label: 'Verde', emoji: '🟢'},
  {value: 'away' as ServiceBadgeColor, label: 'Laranja', emoji: '🟧'},
  {value: 'feature' as ServiceBadgeColor, label: 'Roxo', emoji: '🟣'},
  {value: 'verified' as ServiceBadgeColor, label: 'Azul Céu', emoji: '🔷'},
  {value: 'highlighted' as ServiceBadgeColor, label: 'Rosa', emoji: '🎀'},
  {value: 'stable' as ServiceBadgeColor, label: 'Verde Água', emoji: '🌊'}
];

export default function CreateServiceModal() {
  const {notification} = useNotification();
  const {t} = useLocale('Services');

  const {
    createService,
    state: {
      isCreateServiceModalOpen: open,
      setIsCreateServiceModalOpen: onOpenChange
    }
  } = useServices();

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    getValues,
    setValue,
    reset
  } = useForm<CreateServiceFormData>({
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      duration: 0,
      price: 0,
      location: '',
      badgeColor: 'faded'
    }
  });

  const title = watch('title');
  const description = watch('description');
  const slug = watch('slug');
  const badgeColor = watch('badgeColor');

  // Função para converter texto em kebab-case
  const toKebabCase = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
  };

  // Atualiza o slug quando o título mudar
  React.useEffect(() => {
    if (title) {
      setValue('slug', toKebabCase(title));
    }
  }, [title, setValue]);

  const validateFirstStep = () => {
    const trimmedTitle = title ? title?.trim() : '';
    const trimmedSlug = slug ? slug?.trim() : '';
    const titleIsValid = trimmedTitle && trimmedTitle.length > 0;
    const slugIsValid = trimmedSlug && trimmedSlug.length > 0;

    return titleIsValid === true && slugIsValid === true;
  };

  // const onSubmit = (data: CreateServiceFormData) => {
  //   // const newService = {
  //   //   ...data,
  //   //   price: Number(data.price),
  //   //   duration: Number(data.duration)
  //   // };
  //   createService(newService);
  //   onOpenChange(false);
  //   setStep(1);
  // };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      const {duration, price, location} = watch();
      if (duration && price && location) {
        setStep(2);
      }
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="max-w-[640px]">
        <Modal.Header>
          <Modal.Title>Criar Novo Serviço</Modal.Title>
        </Modal.Header>

        <form
          action={async () => {
            // const nameValue = newName.trim();
            // console.log("formData", formData.get('title'));

            if (step < 2) return;

            // addOptimisticAvailabilityList({
            //   scheduleId: Math.trunc(Math.random() * 1000),
            //   scheduleName: nameValue,
            //   timeZone: 'America/Sao_Paulo',
            //   availability: 'seg. - sex., 9:00 até 17:00',
            //   isDefault: false
            // });
            const formData = getValues();

            const input = {
              title: formData.title,
              description: formData.description,
              slug: formData.slug,
              length: Number(formData.duration),
              // price: Number(formData.price),
              // locations: formData.location,
              // badgeColor: formData.badgeColor
            };

            try {
              const serviceResult = await createServiceHandler({input});
              onOpenChange(false);
              setStep(1);
              console.log('serviceResult', serviceResult);
              // const scheduleResult = await submitCreateSchedule(nameValue);
              // setNewName('');
              if (serviceResult) {
                reset();
                notification({
                  title: t('service_created_success'),
                  variant: 'stroke',
                  // id: 'schedule_created_success',
                  status: 'success'
                });
                // router.push(`/availability/${scheduleResult.id}`);
              }
            } catch (error) {
              console.log('error', error);
            }
          }}
          // onSubmit={handleSubmit(onSubmit)}
        >
          <Modal.Body>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-strong-950">
                    Título
                  </label>
                  <Input.Root hasError={!!errors.title}>
                    <Input.Input
                      placeholder="Digite o título do serviço"
                      {...register('title', {required: true})}
                    />
                  </Input.Root>
                  {errors.title && (
                    <Hint.Root className="text-error-base">
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />
                      O título é obrigatório
                    </Hint.Root>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-strong-950">
                    Descrição
                  </label>
                  <Textarea.Root
                    placeholder="Digite a descrição do serviço"
                    {...register('description')}
                  />
                  {errors.description && (
                    <Hint.Root className="text-error-base">
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />
                      A descrição é obrigatória
                    </Hint.Root>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-strong-950">
                    Slug
                  </label>
                  <Input.Root hasError={!!errors.slug}>
                    <Input.Affix>{MARKADO_DOMAIN}/marcaum/</Input.Affix>
                    <Input.Input
                      placeholder="consulta-30min"
                      {...register('slug', {required: true})}
                    />
                  </Input.Root>
                  {errors.slug && (
                    <Hint.Root className="text-error-base">
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />
                      O slug é obrigatório
                    </Hint.Root>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-strong-950">
                    Cor do Evento
                  </label>
                  <Select.Root
                    defaultValue="faded"
                    {...register('badgeColor', {required: true})}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione uma cor" />
                    </Select.Trigger>
                    <Select.Content>
                      {colorOptions.map((color) => (
                        <Select.Item key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <span>{color.emoji}</span>
                            <span>{color.label}</span>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {errors.badgeColor && (
                    <Hint.Root className="text-error-base">
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />
                      A cor é obrigatória
                    </Hint.Root>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 w-full">
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-text-strong-950">
                      Duração (minutos)
                    </label>
                    <Input.Root className="w-full" hasError={!!errors.duration}>
                      <Input.Input
                        type="number"
                        placeholder="Digite a duração em minutos"
                        {...register('duration', {required: true, min: 1})}
                      />
                    </Input.Root>
                    {errors.duration && (
                      <Hint.Root className="text-error-base">
                        <Hint.Icon
                          as={RiErrorWarningFill}
                          className="text-error-base"
                        />
                        A duração é obrigatória
                      </Hint.Root>
                    )}
                  </div>

                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-text-strong-950">
                      Preço (R$)
                    </label>
                    <Input.Root className="w-full" hasError={!!errors.price}>
                      <Input.Input
                        type="number"
                        placeholder="Digite o preço"
                        {...register('price', {required: true, min: 0})}
                      />
                    </Input.Root>
                    {errors.price && (
                      <Hint.Root className="text-error-base">
                        <Hint.Icon
                          as={RiErrorWarningFill}
                          className="text-error-base"
                        />
                        O preço é obrigatório
                      </Hint.Root>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-strong-950">
                    Local
                  </label>
                  <Input.Root hasError={!!errors.location}>
                    <Input.Input
                      placeholder="Digite o local do serviço"
                      {...register('location', {required: true})}
                    />
                  </Input.Root>
                  {errors.location && (
                    <Hint.Root className="text-error-base">
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />
                      O local é obrigatório
                    </Hint.Root>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            {step === 1 ? (
              <>
                <Modal.Close asChild>
                  <Button.Root
                    type="reset"
                    variant="neutral"
                    mode="stroke"
                    size="small"
                  >
                    Cancelar
                  </Button.Root>
                </Modal.Close>
                <Button.Root
                  type="button"
                  variant="neutral"
                  size="small"
                  onClick={handleNextStep}
                  disabled={!validateFirstStep()}
                >
                  Próximo
                </Button.Root>
              </>
            ) : (
              <>
                <Button.Root
                  type="button"
                  variant="neutral"
                  mode="stroke"
                  size="small"
                  onClick={handleBackStep}
                >
                  Voltar
                </Button.Root>
                <Button.Root variant="neutral" size="small">
                  Criar Serviço
                </Button.Root>
              </>
            )}
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
