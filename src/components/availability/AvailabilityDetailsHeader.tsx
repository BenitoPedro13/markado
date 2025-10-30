'use client';

import {
  // RiLinksLine,
  // RiAddLine,
  // RiCalendarLine,
  // RiTimeLine,
  // RiDashboard3Line,
  RiArrowLeftSLine,
  RiDeleteBinLine,
  // RiShare2Line,
  // RiCopyleftFill,
  // RiFileCopyFill,
  // RiCodeLine,
  // RiSaveLine,
  RiSaveFill,
  // RiSettings4Line,
  RiPencilLine
} from '@remixicon/react';
import React, {FormEvent} from 'react';
import * as Button from '@/components/align-ui/ui/button';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Modal from '@/components/align-ui/ui/modal';
import {useNotification} from '@/hooks/use-notification';
// import * as ButtonGroup from '@/components/align-ui/ui/button-group';
// import * as Tooltip from '@/components/align-ui/ui/tooltip';
import {useRouter} from 'next/navigation';
import {DatepickerRangeDemo} from '@/components/align-ui/daterange';
import * as Input from '@/components/align-ui/ui/input';
import {usePageContext} from '@/contexts/PageContext';
// import {useAvailability} from '@/contexts/AvailabilityContext';
import {useTRPC} from '@/utils/trpc';
import {useMutation, useQuery} from '@tanstack/react-query';
// import {useTranslations} from 'next-intl';
import {useLocale} from '@/hooks/use-locale';
// import dayjs from 'dayjs';
// import {getQueryClient} from '@/app/get-query-client';
// import {DEFAULT_SCHEDULE} from '@/lib/availability';
import {useAvailabilityDetails} from '@/contexts/availability/availabilityDetails/AvailabilityContext';
import {
  formatAvailabilitySchedule,
  formatScheduleFromDetailed
} from '@/utils/formatAvailability';
import {updateDetailedAvailability} from '~/trpc/server/handlers/availability.handler';
import {ZUpdateInputSchema} from '~/trpc/server/schemas/availability.schema';
import {
  submitDeleteSchedule,
  submitUpdateSchedule
} from '~/trpc/server/handlers/schedule.handler';

// type HeaderVariant =
//   | 'scheduling'
//   | 'availability'
//   | 'services'
//   | 'reports'
//   | 'settings';
// type HeaderMode = 'default' | 'inside';

type HeaderProps = {
  // mode?: HeaderMode;
  // title?: string;
  // subtitle?: string;
  // icon?: React.ReactNode;
  // selectedMenuItem?: {
  //   value: string;
  //   label: string;
  //   iconLine: React.ElementType;
  //   iconFill: React.ElementType;
  // };
  // scheduleId: number;
  // timeZone?: string;
};

function AvailabilityDetailsHeader(
  {
    // mode = 'default',
    // title,
    // subtitle,
    // icon,
    // selectedMenuItem,
    // scheduleId
    // timeZone = 'America/Sao_Paulo'
  }: HeaderProps
) {
  const {notification} = useNotification();

  const {
    queries: {availabilityDetails: availability},
    state: {isDeleteModalOpen, setIsDeleteModalOpen, isEditing, setIsEditing},
    availabilityDetailsForm: {register, setValue, watch, getValues}
  } = useAvailabilityDetails();

  const {t, locale, isLocaleReady} = useLocale('Availability');

  const router = useRouter();
  const name = watch('name');
  const isDefault = watch('isDefault');

  if (!availability) return null;

  return (
    <div className="w-full md:h-[88px] flex min-[475px]:h-32 h-36 px-4 md:px-8 md:py-5 py-8 relative bg-bg-white-0 md:inline-flex md:justify-between items-center overflow-hidden flex-col justify-center md:flex-row gap-4">
      <div className="w-full md:w-fit flex items-center gap-3 justify-between md:justify-start">
        <div className='flex items-center gap-3'>
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="small"
            onClick={() => router.push('/availability')}
          >
            <Button.Icon as={RiArrowLeftSLine} />
          </Button.Root>
          <div className="flex flex-col">
            <div className="text-text-strong-950 text-lg font-medium font-sans leading-normal">
              {availability?.name ? (
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
            {availability?.schedule && (
              <div className="text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight hidden md:block">
                {formatScheduleFromDetailed(availability)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight w-fit md:hidden">
          Definir padrão
          <Switch.Root
            defaultChecked={isDefault}
            onCheckedChange={(checked) => {
              setValue('isDefault', checked);
            }}
          />
        </div>
      </div>
      <div className="w-full md:w-fit flex items-center gap-3 justify-between md:justify-end">
        <div className="md:flex items-center gap-2 text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight w-fit hidden">
          Definir padrão
          <Switch.Root
            defaultChecked={isDefault}
            onCheckedChange={(checked) => {
              setValue('isDefault', checked);
            }}
          />
        </div>
        <div className="w-full md:w-fit flex gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2">
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
                      console.log('availability.id', availability.id);
                      await submitDeleteSchedule(availability.id);

                      notification({
                        title: 'Alterações salvas!',
                        description: 'Seus updates foram salvos com sucesso.',
                        variant: 'stroke',
                        status: 'success'
                      });

                      router.push(`/availability`);
                    } catch (error: any) {
                      console.error(
                        'Error submitting availability form:',
                        error
                      );
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
                        Apagar {availability?.name}
                      </div>
                      <div className="text-paragraph-sm text-text-sub-600">
                        Você não poderá recuperar a disponibilidade após
                        apagá-lo.
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
                    <Button.Root
                      variant="error"
                      size="small"
                      className="w-full"
                      // onClick={() => submitDeleteSchedule(availability.id)}
                    >
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

                const scheduleInputValues = {
                  ...rest,
                  scheduleId: id
                };

                const scheduleResult =
                  await submitUpdateSchedule(scheduleInputValues);

                if (!scheduleResult) return;

                notification({
                  title: 'Alterações salvas!',
                  description: 'Seus updates foram salvos com sucesso.',
                  variant: 'stroke',
                  status: 'success'
                });

                router.push(`/availability`);
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
    </div>
  );

  // const {
  //   icon: headerIcon,
  //   title: variantTitle,
  //   description,
  //   buttons
  // } = getHeaderContent();

  // return (
  //   <div className="w-full px-8 py-5 relative inline-flex justify-start items-center gap-3 overflow-hidden">
  //     <div className="flex-1 flex justify-center items-start gap-3.5">
  //       <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
  //         {headerIcon}
  //       </div>
  //       <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
  //         <div className="self-stretch justify-start text-text-strong-950 text-lg font-medium font-sans leading-normal">
  //           {variantTitle}
  //         </div>
  //         <div className="self-stretch justify-start text-text-sub-600 text-sm font-normal font-sans leading-tight">
  //           {description}
  //         </div>
  //       </div>
  //     </div>
  //     <div className="flex justify-start items-center gap-3">{buttons}</div>
  //     <Modal.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
  //       <Modal.Content className="max-w-[440px]">
  //         <Modal.Body>
  //           <div className="text-xl font-semibold mb-4">
  //             Adicionar nova disponibilidade
  //           </div>
  //           <div className="mb-2 text-label-md">Nome</div>
  //           <Input.Root>
  //             <Input.Input
  //               placeholder="Horas de Trabalho"
  //               value={newName}
  //               onChange={(e) => {
  //                 setNewName(e.target.value);
  //               }}
  //               autoFocus
  //             />
  //           </Input.Root>
  //         </Modal.Body>
  //         <Modal.Footer className="flex gap-2 justify-end">
  //           <Modal.Close asChild>
  //             <Button.Root variant="neutral" mode="stroke" size="small">
  //               Fechar
  //             </Button.Root>
  //           </Modal.Close>
  //           <Button.Root
  //             variant="neutral"
  //             size="small"
  //             className="font-semibold"
  //             disabled={!newName?.trim()}
  //             onClick={async (e) => {
  //               if (!newName?.trim()) return;
  //               // const slug = newName?.trim().toLowerCase().replace(/ /g, '-');
  //               await submitCreateSchedule(e);
  //               setIsCreateModalOpen(false);
  //               setNewName('');
  //               // router.push(`/availability/${slug}`);
  //             }}
  //           >
  //             Criar
  //           </Button.Root>
  //         </Modal.Footer>
  //       </Modal.Content>
  //     </Modal.Root>
  //   </div>
  // );
}

export default AvailabilityDetailsHeader;
