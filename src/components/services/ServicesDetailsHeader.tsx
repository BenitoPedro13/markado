'use client';

import {
  RiArrowLeftSLine,
  RiDeleteBinLine,
  RiShare2Line,
  RiFileCopyFill,
  RiCodeLine,
  RiSaveFill,
  RiPencilLine
} from '@remixicon/react';
import React, {useState} from 'react';
import * as Button from '@/components/align-ui/ui/button';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as Modal from '@/components/align-ui/ui/modal';
import {useNotification} from '@/hooks/use-notification';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import {useRouter} from 'next/navigation';
import * as Input from '@/components/align-ui/ui/input';
import {usePageContext} from '@/contexts/PageContext';
import {useLocale} from '@/hooks/use-locale';
import {useServicesDetails} from '@/contexts/services/servicesDetails/ServicesContext';
import {
  submitDeleteService,
  updateServiceHandler
} from '~/trpc/server/handlers/services.handler';
import {TUpdateInputSchema} from '~/trpc/server/schemas/services.schema';

type ServicesDetailsHeaderProps = {};

function ServicesDetailsHeader({}: ServicesDetailsHeaderProps) {
  const {notification} = useNotification();

  const {
    queries: {serviceDetails},
    state: {isDeleteModalOpen, setIsDeleteModalOpen, isEditing, setIsEditing},
    ServicesDetailsForm: {register, setValue, watch, getValues}
  } = useServicesDetails();

  const {t, locale, isLocaleReady} = useLocale('ServicesDetailsHeader');

  const router = useRouter();

  const name = watch('name');
  // const isDefault = watch('isDefault');

  return (
    <div className="w-full h-[88px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-between items-center overflow-hidden">
      <div className="flex items-center gap-3">
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="small"
          onClick={() => router.push('/services')}
        >
          <Button.Icon as={RiArrowLeftSLine} />
        </Button.Root>
        <div className="flex flex-col">
          <div className="text-text-strong-950 text-lg font-medium font-sans leading-normal">
            {name ? (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input.Root>
                    <Input.Input
                      {...register('name')}
                      onBlur={() => {
                        setIsEditing(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditing(false);
                        }
                      }}
                      autoFocus
                    />
                  </Input.Root>
                ) : (
                  <>
                    <span>{name}</span>
                    <Button.Root
                      variant="neutral"
                      mode="ghost"
                      size="small"
                      onClick={() => setIsEditing(true)}
                    >
                      <Button.Icon as={RiPencilLine} />
                    </Button.Root>
                  </>
                )}
              </div>
            ) : (
              'Configuração do Serviço'
            )}
          </div>
          {/* {subtitle && (
            <div className="text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight">
              {subtitle}
            </div>
          )} */}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <ButtonGroup.Root>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <ButtonGroup.Item>
                  <ButtonGroup.Icon as={RiShare2Line} />
                </ButtonGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content size="small">
                Compartilhar serviço
              </Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <ButtonGroup.Item>
                  <ButtonGroup.Icon as={RiFileCopyFill} />
                </ButtonGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content size="small">
                Copiar link do serviço
              </Tooltip.Content>
            </Tooltip.Root>
            {/* <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <ButtonGroup.Item>
                  <ButtonGroup.Icon as={RiCodeLine} />
                </ButtonGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content size="small">Criar embed</Tooltip.Content>
            </Tooltip.Root> */}
          </ButtonGroup.Root>

          <Modal.Root
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <Modal.Trigger asChild>
              <Button.Root
                variant="neutral"
                mode="stroke"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Button.Icon as={RiDeleteBinLine} />
                Apagar
              </Button.Root>
            </Modal.Trigger>
            <Modal.Content className="max-w-[440px]">
              <form
                action={async (formData) => {
                  try {
                    console.log('serviceDetails.id', serviceDetails.id);
                    await submitDeleteService(serviceDetails.id);

                    setIsDeleteModalOpen(false);

                    router.push(`/services`);
                    notification({
                      title: 'Alterações salvas!',
                      description: 'Seus updates foram salvos com sucesso.',
                      variant: 'stroke',
                      status: 'success'
                    });
                  } catch (error: any) {
                    console.error('Error submitting availability form:', error);
                    notification({
                      title: t('schedule_updated_error'),
                      description: error.message,
                      variant: 'stroke',
                      id: 'schedule_updated_error',
                      status: 'error'
                    });
                  }
                }}
              >
                <Modal.Body className="flex items-start gap-4">
                  <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                    <RiDeleteBinLine className="text-error-base size-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-md text-text-strong-950">
                      Apagar {name}
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600">
                      Você não poderá recuperar a disponibilidade após apagá-lo.
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button.Root
                      variant="neutral"
                      mode="stroke"
                      size="small"
                      className="w-full"
                    >
                      Cancelar
                    </Button.Root>
                  </Modal.Close>
                  <Button.Root variant="error" size="small" className="w-full">
                    Apagar
                  </Button.Root>
                </Modal.Footer>
              </form>
            </Modal.Content>
          </Modal.Root>
        </div>
        <form
          action={async (formData) => {
            try {
              // Get form values from the Schedule component
              const {id, ...rest} = getValues();

              const serviceInputValues: TUpdateInputSchema = {
                id,
                slug: rest.slug,
                badgeColor: rest.badgeColor,
                length: parseInt(`${rest.duration}`) || 0,
                price: parseFloat(`${rest.price}`) || 0,
                title: rest.name,
                description: rest.description || '',
                locations: rest.locations,
                hidden: rest.isHidden,
                schedule: rest.schedule,
                bookingFields: rest.bookingFields,
                // seatsPerTimeSlotEnabled:
                //   !initialServiceDetails?.seatsPerTimeSlot ? false : true,
                seatsPerTimeSlot: rest?.seatsPerTimeSlot,
                requiresConfirmation: rest?.requiresConfirmation,
                requiresConfirmationWillBlockSlot:
                  rest?.requiresConfirmationWillBlockSlot,
                metadata: rest?.metadata,
                lockTimeZoneToggleOnBookingPage:
                  rest?.lockTimeZoneToggleOnBookingPage
              };

              const serviceResult = await updateServiceHandler({
                input: serviceInputValues
              });

              if (!serviceResult) return;

              notification({
                title: 'Alterações salvas!',
                description: 'Seus updates foram salvos com sucesso.',
                variant: 'stroke',
                status: 'success'
              });

              router.push(`/services`);
            } catch (error: any) {
              console.error('Error submitting service details form:', error);
              notification({
                title: t('schedule_updated_error'),
                description: error.message,
                variant: 'stroke',
                id: 'schedule_updated_error',
                status: 'error'
              });
            }
          }}
        >
          <FancyButton.Root
            variant="neutral"
            size="small"
            onClick={(e) => {
              // if ((window as any).submitServiceForm) {
              //   (window as any).submitServiceForm();
              // }
              // submitUpdateSchedule();
            }}
          >
            <FancyButton.Icon as={RiSaveFill} />
            Salvar
          </FancyButton.Root>
        </form>
      </div>
    </div>
  );
}

export default ServicesDetailsHeader;
