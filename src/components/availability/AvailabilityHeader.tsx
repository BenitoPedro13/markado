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
  RiPencilLine,
  RiCloseLine
} from '@remixicon/react';
import React, {FormEvent, useRef, useState} from 'react';
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
// import {useAvailability} from '@/contexts/AvailabilityContext';
import {useTRPC} from '@/utils/trpc';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {useLocale} from '@/hooks/use-locale';
import dayjs from 'dayjs';
import {getQueryClient} from '@/app/get-query-client';
import {DEFAULT_SCHEDULE} from '@/lib/availability';
import {useAvailability} from '@/contexts/availability/AvailabilityContext';
import {submitCreateSchedule} from '~/trpc/server/handlers/schedule.handler';

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

function AvailabilityHeader({selectedMenuItem}: HeaderProps) {
  // const {notification} = useNotification();

  const {
    state: {isCreateModalOpen, setIsCreateModalOpen}
  } = useAvailability();

  // const {t, locale, isLocaleReady} = useLocale('Availability');

  // const router = useRouter();
  // const trpc = useTRPC();
  // const formRef = useRef<HTMLFormElement>(null);

  //createScheduleHandler
  // const createScheduleMutation = useMutation(
  //   trpc.schedule.create.mutationOptions({
  //     onSuccess: () => {
  //       notification({
  //         title: t('schedule_created_success'),
  //         variant: 'stroke',
  //         id: 'schedule_created_success',
  //         status: 'success'
  //       });
  //     },
  //     onError: (error) => {
  //       notification({
  //         title: t('schedule_created_error'),
  //         description: error.message,
  //         variant: 'stroke',
  //         id: 'schedule_created_error',
  //         status: 'error'
  //       });
  //     }
  //   })
  // );

  // // createAvailabilityHandler
  // const createAvailabilityMutation = useMutation(
  //   trpc.availability.create.mutationOptions({
  //     onSuccess: () => {
  //       // notification({
  //       //   title: t('availability_created_success'),
  //       //   variant: 'stroke',
  //       //   id: 'availability_created_success'
  //       // });
  //       console.log('availability created successfully');
  //     },
  //     onError: (error) => {
  //       // notification({
  //       //   title: t('availability_created_error'),
  //       //   description: error.message,
  //       //   variant: 'stroke',
  //       //   id: 'availability_created_error'
  //       // });
  //       console.log('availability created error', error);
  //     }
  //   })
  // );

  // const submitCreateSchedule = async (
  //   newName: string
  // ) => {
  //   // e.preventDefault();
  //   // setIsSubmitting(true);

  //   try {
  //     // Get form values from the Schedule component
  //     const scheduleValues = DEFAULT_SCHEDULE;

  //     // Create a schedule first
  //     const scheduleResult = await createScheduleMutation.mutateAsync({
  //       name: newName,
  //       timeZone:
  //         Intl.DateTimeFormat().resolvedOptions().timeZone ||
  //         'America/Sao_Paulo'
  //     });

  //     // Convert the schedule format to availability format
  //     const schedule = scheduleValues;

  //     // Create availabilities for each day
  //     for (let dayIndex = 0; dayIndex < schedule.length; dayIndex++) {
  //       const timeRanges = schedule[dayIndex];
  //       if (timeRanges && timeRanges.length > 0) {
  //         for (const timeRange of timeRanges) {
  //           // Format the time values as HH:MM strings to match the schema requirements
  //           const startTime = dayjs(timeRange.start).format('HH:mm');
  //           const endTime = dayjs(timeRange.end).format('HH:mm');

  //           await createAvailabilityMutation.mutateAsync({
  //             days: [dayIndex],
  //             startTime,
  //             endTime,
  //             scheduleId: scheduleResult.id
  //           });
  //         }
  //       }
  //     }

  //     // queryClient.invalidateQueries({
  //     //   queryKey: [
  //     //     ['availability', 'getAll'],
  //     //     {
  //     //       type: 'query'
  //     //     }
  //     //   ]
  //     // });

  //     // Clear the edit_mode cookie if it exists
  //     // clearEditMode();

  //     // Set the availability step completion cookie
  //     // setStepComplete('availability');

  //     router.push(`/availability/${scheduleResult.id}`);

  //     notification({
  //       title: t('schedule_created_success'),
  //       variant: 'stroke',
  //       id: 'schedule_created_success'
  //     });
  //   } catch (error: any) {
  //     console.error('Error submitting availability form:', error);
  //     notification({
  //       title: t('availability_created_error'),
  //       description: error.message,
  //       variant: 'stroke',
  //       id: 'availability_created_error'
  //     });
  //   } finally {
  //     // setIsSubmitting(false);
  //   }
  // };

  const getHeaderContent = () => {
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
          <Modal.Header className="flex justify-start items-center gap-3">
            <Modal.Title className="text-text-strong-950 text-lg font-semibold">
              Criar Disponibilidade
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-2 text-label-md">Nome</div>
            <Input.Root>
              <Input.Input
                name="name"
                type="text"
                placeholder="Horas de Trabalho"
                // value={newName}
                // onChange={(e) => {
                //   setNewName(e.target.value);
                // }}
                required
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
              // disabled={!newName?.trim()}
              onClick={async (e) => {
                // if (!newName?.trim()) return;
                // // const slug = newName?.trim().toLowerCase().replace(/ /g, '-');
                // await submitCreateSchedule(e);
                setIsCreateModalOpen(false);
                // setNewName('');
                // router.push(`/availability/${slug}`);
              }}
            >
              Criar
            </Button.Root>
          </Modal.Footer>
          {/* </form> */}
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export default AvailabilityHeader;
