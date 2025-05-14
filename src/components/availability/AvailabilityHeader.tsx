'use client';

import {
  RiLinksLine,
  RiAddLine,
  RiCalendarLine,
  RiTimeLine,
  RiDashboard3Line,
  RiArrowLeftSLine,
  RiDeleteBinLine,
  RiShare2Line,
  RiCopyleftFill,
  RiFileCopyFill,
  RiCodeLine,
  RiSaveLine,
  RiSaveFill,
  RiSettings4Line,
  RiPencilLine
} from '@remixicon/react';
import React, {FormEvent, useState} from 'react';
import * as Button from '@/components/align-ui/ui/button';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Modal from '@/components/align-ui/ui/modal';
import {useNotification} from '@/hooks/use-notification';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import {useRouter} from 'next/navigation';
import {DatepickerRangeDemo} from '@/components/align-ui/daterange';
import * as Input from '@/components/align-ui/ui/input';
import {usePageContext} from '@/contexts/PageContext';
import {useAvailability} from '@/contexts/AvailabilityContext';
import {useTRPC} from '@/utils/trpc';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {useLocale} from '@/hooks/use-locale';
import dayjs from 'dayjs';
import {getQueryClient} from '@/app/get-query-client';
import {DEFAULT_SCHEDULE} from '@/lib/availability';

type HeaderVariant =
  | 'scheduling'
  | 'availability'
  | 'services'
  | 'reports'
  | 'settings';
type HeaderMode = 'default' | 'inside';

type HeaderProps = {
  mode?: HeaderMode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selectedMenuItem?: {
    value: string;
    label: string;
    iconLine: React.ElementType;
    iconFill: React.ElementType;
  };
  scheduleId?: number;
  timeZone?: string;
};

function AvailabilityHeader({
  mode = 'default',
  title,
  subtitle,
  icon,
  selectedMenuItem,
  scheduleId,
  timeZone = 'America/Sao_Paulo'
}: HeaderProps) {
  const {notification} = useNotification();
  const {
    queries: {availabilityDetails: availability},
    state: {
      isCreateModalOpen,
      setIsCreateModalOpen,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isEditing,
      setIsEditing
    },
    availabilityDetailsForm: {register, setValue, watch, getValues, reset}
  } = useAvailability();

  const [newName, setNewName] = useState('');

  const {t, locale, isLocaleReady} = useLocale('Availability');

  const router = useRouter();
  const name = watch('name');
  const isDefault = watch('isDefault');
  const trpc = useTRPC();

  const queryClient = getQueryClient();

  // // Get the prefetched data using tRPC query
  // const {data: availability} = useQuery(
  //   trpc.availability.findDetailedScheduleById.queryOptions(
  //     {
  //       scheduleId: scheduleId || 0,
  //       timeZone
  //     },
  //     {
  //       enabled: !!scheduleId,
  //       // This ensures we use the prefetched data
  //       staleTime: Infinity
  //     }
  //   )
  // );

  const updateScheduleMutation = useMutation(
    trpc.availability.updateDetailedAvailability.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            ['availability', 'findDetailedScheduleById'],
            {
              type: 'query'
            }
          ]
        });

        queryClient.invalidateQueries({
          queryKey: [
            ['availability', 'getAll'],
            {
              type: 'query'
            }
          ]
        });

        reset();
      },
      onError: (error) => {
        // notification({
        //   title: t('schedule_updated_error'),
        //   description: error.message,
        //   variant: 'stroke',
        //   id: 'schedule_updated_error'
        // });
      }
    })
  );

  const createScheduleMutation = useMutation(
    trpc.schedule.create.mutationOptions({
      onSuccess: () => {
        notification({
          title: t('schedule_created_success'),
          variant: 'stroke',
          id: 'schedule_created_success',
          status: 'success'
        });
      },
      onError: (error) => {
        notification({
          title: t('schedule_created_error'),
          description: error.message,
          variant: 'stroke',
          id: 'schedule_created_error',
          status: 'error'
        });
      }
    })
  );

  const createAvailabilityMutation = useMutation(
    trpc.availability.create.mutationOptions({
      onSuccess: () => {
        // notification({
        //   title: t('availability_created_success'),
        //   variant: 'stroke',
        //   id: 'availability_created_success'
        // });
        console.log('availability created successfully');
      },
      onError: (error) => {
        // notification({
        //   title: t('availability_created_error'),
        //   description: error.message,
        //   variant: 'stroke',
        //   id: 'availability_created_error'
        // });
        console.log('availability created error', error);
      }
    })
  );

  const deleteScheduleMutation = useMutation(
    trpc.schedule.delete.mutationOptions({
      onSuccess: () => {
        console.log('schedule deleted successfully');

        queryClient.invalidateQueries({
          queryKey: [
            ['availability', 'getAll'],
            {
              type: 'query'
            }
          ]
        });

        router.push('/availability');
      }
    })
  );

  const submitUpdateSchedule = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // setIsSubmitting(true);

    try {
      // Get form values from the Schedule component
      const scheduleValues = getValues();

      const scheduleResult = await updateScheduleMutation.mutateAsync({
        id: scheduleValues.id,
        data: {
          schedule: scheduleValues.schedule,
          scheduleId: scheduleValues.id,
          isDefault: scheduleValues.isDefault,
          timeZone: scheduleValues.timeZone,
          name: scheduleValues.name
        }
      });

      if (scheduleResult.schedule.id) {
        notification({
          title: 'Alterações salvas!',
          description: 'Seus updates foram salvos com sucesso.',
          variant: 'stroke',
          status: 'success'
        });

        router.push(`/availability`);
      }
    } catch (error: any) {
      console.error('Error submitting availability form:', error);
      notification({
        title: t('schedule_updated_error'),
        description: error.message,
        variant: 'stroke',
        id: 'schedule_updated_error'
      });
    } finally {
      // setIsSubmitting(false);
      notification({
        title: 'Alterações salvas!',
        description: 'Seus updates foram salvos com sucesso.',
        variant: 'stroke',
        status: 'success'
      });
    }
  };

  const submitCreateSchedule = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // setIsSubmitting(true);

    try {
      // Get form values from the Schedule component
      const scheduleValues = DEFAULT_SCHEDULE;

      // Create a schedule first
      const scheduleResult = await createScheduleMutation.mutateAsync({
        name: newName,
        timeZone:
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          'America/Sao_Paulo'
      });

      // Convert the schedule format to availability format
      const schedule = scheduleValues;

      // Create availabilities for each day
      for (let dayIndex = 0; dayIndex < schedule.length; dayIndex++) {
        const timeRanges = schedule[dayIndex];
        if (timeRanges && timeRanges.length > 0) {
          for (const timeRange of timeRanges) {
            // Format the time values as HH:MM strings to match the schema requirements
            const startTime = dayjs(timeRange.start).format('HH:mm');
            const endTime = dayjs(timeRange.end).format('HH:mm');

            await createAvailabilityMutation.mutateAsync({
              days: [dayIndex],
              startTime,
              endTime,
              scheduleId: scheduleResult.id
            });
          }
        }
      }

      queryClient.invalidateQueries({
        queryKey: [
          ['availability', 'getAll'],
          {
            type: 'query'
          }
        ]
      });

      // Clear the edit_mode cookie if it exists
      // clearEditMode();

      // Set the availability step completion cookie
      // setStepComplete('availability');

      router.push(`/availability/${scheduleResult.id}`);

      notification({
        title: t('schedule_created_success'),
        variant: 'stroke',
        id: 'schedule_created_success'
      });
    } catch (error: any) {
      console.error('Error submitting availability form:', error);
      notification({
        title: t('availability_created_error'),
        description: error.message,
        variant: 'stroke',
        id: 'availability_created_error'
      });
    } finally {
      // setIsSubmitting(false);
    }
  };

  const submitDeleteSchedule = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!scheduleId) {
        throw new Error('Schedule ID is required');
      }

      await deleteScheduleMutation.mutateAsync({
        id: scheduleId || 0
      });

      notification({
        title: t('schedule_deleted_success'),
        variant: 'stroke',
        id: 'schedule_deleted_success',
        status: 'success'
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const getHeaderContent = () => {
    if (selectedMenuItem) {
      const IconLine = selectedMenuItem.iconLine;
      const IconFill = selectedMenuItem.iconFill;
      return {
        icon: <IconFill className="text-bg-strong-950" />,
        title: selectedMenuItem.label,
        description: getDescriptionForMenuItem(selectedMenuItem.value),
        buttons: getButtonsForMenuItem(selectedMenuItem.value)
      };
    }

    return {
      icon: <RiTimeLine className="text-bg-strong-950" />,
      title: 'Disponibilidade',
      description: 'Configure seus horários disponíveis para agendamentos.',
      buttons: (
        <div className="flex justify-start items-center gap-3 availability">
          <FancyButton.Root
            variant="neutral"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FancyButton.Icon as={RiAddLine} />
            Criar Disponibilidade
          </FancyButton.Root>
        </div>
      )
    };
  };

  const getDescriptionForMenuItem = (value: string) => {
    switch (value) {
      case 'profile':
        return 'Gerencie suas informações pessoais e preferências.';
      case 'business':
        return 'Configure as informações da sua página de negócio.';
      case 'general':
        return 'Ajuste as configurações gerais do seu projeto.';
      case 'calendars':
        return 'Gerencie seus calendários e integrações.';
      case 'conference':
        return 'Configure suas opções de videoconferência.';
      case 'privacy':
        return 'Gerencie suas configurações de privacidade e segurança.';
      case 'subscription':
        return 'Visualize e gerencie sua assinatura.';
      case 'payment':
        return 'Configure seus métodos de pagamento.';
      default:
        return 'Gerencie suas configurações.';
    }
  };

  const getButtonsForMenuItem = (value: string) => {
    switch (value) {
      case 'profile':
      case 'business':
      case 'general':
      case 'calendars':
      case 'conference':
      case 'privacy':
      case 'subscription':
      case 'payment':
        return (
          <div className="settings">
            <FancyButton.Root variant="neutral">
              <FancyButton.Icon as={RiSaveFill} />
              Salvar
            </FancyButton.Root>
          </div>
        );
      default:
        return null;
    }
  };

  if (mode === 'inside') {
    return (
      <div className="w-full h-[88px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
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
            {subtitle && (
              <div className="text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight w-fit">
            Definir padrão
            <Switch.Root defaultChecked={isDefault} onCheckedChange={(checked) => {
              setValue('isDefault', checked);
            }} />
          </div> 
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
                <Modal.Body className="flex items-start gap-4">
                  <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                    <RiDeleteBinLine className="text-error-base size-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-md text-text-strong-950">
                      Apagar {title}
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
                  <Button.Root variant="error" size="small" className="w-full" onClick={submitDeleteSchedule}>
                    Apagar
                  </Button.Root>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </div>
          <FancyButton.Root
            variant="neutral"
            size="small"
            onClick={(e) => {
              // if ((window as any).submitServiceForm) {
              //   (window as any).submitServiceForm();
              // }
              submitUpdateSchedule(e);
            }}
          >
            <FancyButton.Icon as={RiSaveFill} />
            Salvar
          </FancyButton.Root>
        </div>
      </div>
    );
  }

  const {
    icon: headerIcon,
    title: variantTitle,
    description,
    buttons
  } = getHeaderContent();

  return (
    <div className="w-full px-8 py-5 relative inline-flex justify-start items-center gap-3 overflow-hidden">
      <div className="flex-1 flex justify-center items-start gap-3.5">
        <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
          {headerIcon}
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-start text-text-strong-950 text-lg font-medium font-sans leading-normal">
            {variantTitle}
          </div>
          <div className="self-stretch justify-start text-text-sub-600 text-sm font-normal font-sans leading-tight">
            {description}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-3">{buttons}</div>
      <Modal.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Modal.Content className="max-w-[440px]">
          <Modal.Body>
            <div className="text-xl font-semibold mb-4">
              Adicionar nova disponibilidade
            </div>
            <div className="mb-2 text-label-md">Nome</div>
            <Input.Root>
              <Input.Input
                placeholder="Horas de Trabalho"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                autoFocus
              />
            </Input.Root>
          </Modal.Body>
          <Modal.Footer className="flex gap-2 justify-end">
            <Modal.Close asChild>
              <Button.Root variant="neutral" mode="stroke" size="small">
                Fechar
              </Button.Root>
            </Modal.Close>
            <Button.Root
              variant="neutral"
              size="small"
              className="font-semibold"
              disabled={!newName?.trim()}
              onClick={async(e) => {
                if (!newName?.trim()) return;
                // const slug = newName?.trim().toLowerCase().replace(/ /g, '-');
                await submitCreateSchedule(e)
                setIsCreateModalOpen(false);
                setNewName('');
                // router.push(`/availability/${slug}`);
              }}
            >
              Criar
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export default AvailabilityHeader;
