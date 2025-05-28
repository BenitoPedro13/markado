'use client';

import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Button from '@/components/align-ui/ui/button';
import * as Divider from '@/components/align-ui/ui/divider';
import * as Select from '@/components/align-ui/ui/select';
// import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Badge from '@/components/align-ui/ui/badge';
// import * as Label from '@/components/align-ui/ui/label';
import {Text as SkeletonText} from '@/components/align-ui/ui/skeleton';
import {ServiceAvailability as ServiceAvailabilityType} from '@/types/service';
import {RowDivider} from '@/components/align-ui/ui/table';
import {
  RiArrowLeftUpLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiGlobalLine,
  RiExternalLinkLine,
  RiGlobeLine
} from '@remixicon/react';

import {
  useEffect,
  useRef,
  useCallback,
  memo,
  useActionState,
  useTransition,
  Fragment
} from 'react';

import type {UseQueryResult} from '@tanstack/react-query';
import {Controller, useFormContext, useForm} from 'react-hook-form';
// import {components} from 'react-select';

import {GetAllSchedulesByUserIdQueryType} from '~/trpc/server/handlers/schedule.handler';
import dayjs from '@/lib/dayjs';
// import {SelectSkeletonLoader} from '@/features/availability/components/SkeletonLoader';
// import useLockedFieldsManager from '@/features/ee/managed-event-types/hooks/useLockedFieldsManager';
// import type {TeamMembers} from '@/features/eventtypes/components/EventType';
import type {
  AvailabilityOption,
  FormValues,
  EventTypeSetup
} from '@/features/eventtypes/lib/types';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import {weekdayNames} from '@/lib/weekday';
import {weekStartNum} from '@/lib/weekstart';
import Link from 'next/link';
import {AvailabilityById} from '@/contexts/availability/availabilityDetails/AvailabilityContext';
import {Me} from '@/app/settings/page';
import {useServicesDetails} from '@/contexts/services/servicesDetails/ServicesContext';
import {
  findDetailedScheduleByIdAction,
  TSchedulesList
} from '~/trpc/server/handlers/availability.handler';
// import {
//   // Avatar,
//   // Badge,
//   // Icon,
//   // Label,
//   SettingsToggle,
//   // SkeletonText
// } from '@/ui';
// import {Spinner} from '@/ui/components/icon/Spinner';

type ScheduleQueryData = AvailabilityById;

type EventTypeScheduleDetailsProps = {
  scheduleQueryData?: Pick<
    ScheduleQueryData,
    'timeZone' | 'id'
    // 'isManaged' |
    // | 'readOnly'
  > & {
    schedule: Array<
      Pick<
        ScheduleQueryData['schedule'][number],
        'days' | 'startTime' | 'endTime'
      >
    >;
  };
  isSchedulePending?: boolean;
  user?: Pick<Me, 'timeFormat' | 'weekStart'>;
  editAvailabilityRedirectUrl?: string;
};

type HostSchedulesQueryType =
  | GetAllSchedulesByUserIdQueryType
  | (({userId}: {userId: number}) => UseQueryResult<
      {
        schedules: {
          id: number;
          name: string;
          isDefault: boolean;
          userId: number;
          readOnly: boolean;
        }[];
      },
      Error
    >);

type EventTypeTeamScheduleProps = {
  hostSchedulesQuery?: HostSchedulesQueryType;
};

// type TeamMember = Pick<TeamMembers[number], 'avatar' | 'name' | 'id'>;

type EventTypeScheduleProps = {
  schedulesQueryData?: Array<
    Omit<TSchedulesList['schedules'][number], 'availability'>
  >;
  isSchedulesPending?: boolean;
  eventType: EventTypeSetup;
  // teamMembers: TeamMember[]; // Uncomment this line if you need to use teamMembers
} & EventTypeScheduleDetailsProps &
  EventTypeTeamScheduleProps;

export type EventAvailabilityTabBaserProps = {
  isTeamEvent: boolean;
};

type EventAvailabilityTabProps = EventAvailabilityTabBaserProps &
  EventTypeScheduleProps;

const format = (date: Date, hour12: boolean) =>
  Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: hour12 ? 'h12' : 'h24'
  }).format(new Date(dayjs.utc(date).format('YYYY-MM-DDTHH:mm:ss')));

const EventTypeScheduleDetails = memo(
  ({
    scheduleQueryData,
    isSchedulePending,
    user,
    editAvailabilityRedirectUrl
  }: EventTypeScheduleDetailsProps) => {
    const timeFormat = user?.timeFormat;
    const {t, locale} = useLocale();

    const weekStart = weekStartNum('Monday'); // Default to Monday
    //   user?.weekStart
    // );

    const filterDays = (dayNum: number) =>
      scheduleQueryData?.schedule?.filter((item) =>
        item.days.includes((dayNum + weekStart) % 7)
      ) || [];

    return (
      <div className="">
        <h3 className="text-title-h6">Horários Configurados</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-background-soft-100 rounded">
            <table className="mt-4 w-full max-w-[400px] text-paragraph-sm">
              <tbody>
                {weekdayNames(locale, weekStart, 'long').map((day, index) => {
                  const isAvailable = !!filterDays(index).length;
                  return (
                    <>
                      <tr
                        key={day}
                        className={`w-full ${!isAvailable ? 'text-text-disabled-300' : 'text-text-sub-600'}`}
                      >
                        <td className="py-2 text-text-strong-950 capitalize align-top">
                          {day}
                        </td>
                        {isSchedulePending ? (
                          <SkeletonText className="inline-table h-5 py-2 w-60 align-middle" />
                        ) : isAvailable ? (
                          <>
                            {filterDays(index).map((dayRange, i) => (
                              <tr key={i} className="w-full">
                                <td className="py-2 text-center w-1/3">
                                  {format(
                                    dayRange.startTime,
                                    timeFormat === 12
                                  )}
                                </td>
                                <td className="py-2 text-center mx-auto w-1/3">
                                  -
                                </td>
                                <td className="py-2 text-center w-1/3">
                                  {format(dayRange.endTime, timeFormat === 12)}
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <td className="py-2 text-start">
                            Indisponível
                            {/* {t('unavailable')} */}
                          </td>
                        )}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

EventTypeScheduleDetails.displayName = 'EventTypeScheduleDetails';

const EventTypeSchedule = ({
  eventType,
  schedulesQueryData,
  isSchedulesPending,
  ...rest
}: EventTypeScheduleProps) => {
  const {t} = useLocale();
  const {
    queries: {initialMe},
    ServicesDetailsForm: {watch, setValue, getValues, register}
  } = useServicesDetails();
  // const {
  //   shouldLockIndicator,
  //   shouldLockDisableProps,
  //   isManagedEventType,
  //   isChildrenManagedEventType
  // } = useLockedFieldsManager({eventType, translate: t, formMethods});

  const scheduleId = watch('schedule');

  // Add useTransition hook
  const [isPending, startTransition] = useTransition();

  // Use useActionState for the action
  const [schedule, action] = useActionState(
    findDetailedScheduleByIdAction,
    undefined as AvailabilityById | undefined
  );

  useEffect(() => {
    // after data is loaded.
    if (schedulesQueryData && scheduleId !== 0 && !scheduleId) {
      const newValue = false
        ? 0
        : schedulesQueryData.find((schedule) => schedule.isDefault)?.id;
      if (!newValue && newValue !== 0) return;
      setValue('schedule', newValue, {
        shouldDirty: true
      });
    }
  }, [scheduleId, schedulesQueryData]);

  const handleScheduleAction = useCallback(() => {
    if (scheduleId) {
      startTransition(() => {
        action({
          scheduleId,
          userId: initialMe?.id as string,
          timeZone: initialMe?.timeZone
        });
      });
    }
  }, [scheduleId, initialMe?.id, initialMe?.timeZone, action]);

  useEffect(() => {
    handleScheduleAction();
  }, [handleScheduleAction]);

  if (isSchedulesPending || !schedulesQueryData) {
    // return <SelectSkeletonLoader />;
    return null;
  }

  const options = schedulesQueryData.map((schedule) => ({
    value: schedule.id,
    label: schedule.name,
    isDefault: schedule.isDefault,
    isManaged: false
  }));

  // We are showing a managed event for a team admin, so adding the option to let members choose their schedule
  // if (isManagedEventType) {
  //   options.push({
  //     value: 0,
  //     label: t('members_default_schedule'),
  //     isDefault: false,
  //     isManaged: false
  //   });
  // }
  // We are showing a managed event for a member and team owner selected their own schedule, so adding
  // the managed schedule option
  if (
    // isChildrenManagedEventType &&
    scheduleId &&
    !schedulesQueryData.find((schedule) => schedule.id === scheduleId)
  ) {
    // options.push({
    //   value: scheduleId,
    //   label: eventType.scheduleName ?? t('default_schedule_name'),
    //   isDefault: false,
    //   isManaged: false
    // });
  }
  // We push the selected schedule from the event type if it's not part of the list response. This happens if the user is an admin but not the schedule owner.
  else if (
    eventType.schedule &&
    !schedulesQueryData.find((schedule) => schedule.id === eventType.schedule)
  ) {
    options.push({
      value: eventType.schedule,
      label: eventType.scheduleName ?? t('default_schedule_name'),
      isDefault: false,
      isManaged: false
    });
  }

  return (
    <div className="space-y-6 flex flex-col gap-4 max-w-2xl">
      <div className="space-y-4 ">
        <div className="text-title-h6">Geral</div>
        <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="schedule"
              className="text-sm font-medium text-text-strong-950"
            >
              Disponibilidade
              {/* {t('availability')} */}
              {/* {(isManagedEventType || isChildrenManagedEventType) &&
                shouldLockIndicator('schedule')}
              */}
            </label>
            <Select.Root
              {...register('schedule')}
              // value={scheduleId?.toString() ?? ''}
              defaultValue={scheduleId?.toString() ?? ''}
              onValueChange={(str) => {
                const id = parseInt(str, 10);
                // update RHF—and trigger re-render because `watch('schedule')` will now change
                setValue('schedule', id, {shouldDirty: true});
              }}
            >
              <Select.Trigger
                // className="flex w-[90px] sm:w-[100px]"
                id="schedule"
              >
                <Select.Value placeholder="Selecione uma disponibilidade" />
              </Select.Trigger>
              <Select.Content>
                {options.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                    {opt.isDefault && (
                      <Badge.Root color="blue" className="ml-2">
                        Padrão
                        {/* {t('default')} */}
                      </Badge.Root>
                    )}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <Divider.Root />
        {scheduleId !== 0 ? (
          <EventTypeScheduleDetails
            key={scheduleId}
            scheduleQueryData={schedule}
            isSchedulePending={isPending}
            user={rest.user}
            editAvailabilityRedirectUrl={rest.editAvailabilityRedirectUrl}
          />
        ) : (
          <></>
          // isManagedEventType && (
          //   <p className="!mt-2 ml-1 text-sm text-gray-600">
          //     {t('members_default_schedule_description')}
          //   </p>
          // )
        )}
        <Divider.Root />
        <div className="flex justify-between items-center gap-2">
          {/* <span className="text-default flex items-center justify-center text-sm sm:justify-start">
            <RiGlobeLine className="h-3.5 w-3.5 ltr:mr-2 rtl:ml-2" />
            {scheduleQueryData?.timeZone || (
              <SkeletonText className="block h-5 w-32" />
            )}
          </span> */}
          <Button.Root mode="ghost" className="w-fit">
            <Button.Icon as={RiGlobalLine} />
            {schedule?.timeZone || <SkeletonText className="block h-5 w-32" />}
          </Button.Root>
          {!!schedule?.id &&
            // !scheduleQueryData.isManaged &&
            // !scheduleQueryData.readOnly &&
            !!rest.editAvailabilityRedirectUrl && (
              //     <Button.Root mode="ghost" className="w-fit">
              //   Editar Disponibilidade
              //   <Button.Icon as={RiArrowRightUpLine} />
              // </Button.Root>
              <Button.Root
                asChild
                disabled={isPending}
                mode="ghost"
                className="w-fit"
              >
                <Link
                  href={rest.editAvailabilityRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Editar Disponibilidade
                  {/* {t('edit_availability')} */}
                </Link>
                <Button.Icon as={RiExternalLinkLine} />
              </Button.Root>
            )}
        </div>
      </div>
    </div>
  );
};

// const TeamMemberSchedule = ({
//   host,
//   index,
//   teamMembers,
//   hostScheduleQuery
// }: {
//   host: Host;
//   index: number;
//   teamMembers: TeamMember[];
//   hostScheduleQuery: HostSchedulesQueryType;
// }) => {
//   const {t} = useLocale();
//   const isPlatform = useIsPlatform();

//   const formMethods = useFormContext<FormValues>();
//   const {getValues} = formMethods;

//   const {data, isPending} = hostScheduleQuery({
//     userId: host.userId
//   });

//   const schedules = data?.schedules;
//   const options = schedules?.map((schedule) => ({
//     value: schedule.id,
//     label: schedule.name,
//     isDefault: schedule.isDefault,
//     isManaged: false
//   }));

//   //Set to defaultSchedule if Host Schedule is not previously selected
//   const scheduleId = getValues(`hosts.${index}.scheduleId`);
//   const value = options?.find((option) =>
//     scheduleId
//       ? option.value === scheduleId
//       : option.value === schedules?.find((schedule) => schedule.isDefault)?.id
//   );

//   const member = teamMembers.find((mem) => mem.id === host.userId);
//   const avatar = member?.avatar;
//   const label = member?.name;

//   return (
//     <>
//       <div className="flex w-full items-center">
//         {!isPlatform && (
//           <Avatar size="sm" imageSrc={avatar} alt={label || ''} />
//         )}
//         {isPlatform && <Icon name="user" className="h-4 w-4" />}
//         <p className="text-emphasis my-auto ms-3 text-sm">{label}</p>
//       </div>
//       <div className="flex w-full flex-col pt-2 ">
//         {isPending ? (
//           <Spinner className="mt-2 h-6 w-6" />
//         ) : (
//           <Controller
//             name={`hosts.${index}.scheduleId`}
//             render={({field}) => {
//               return (
//                 <Select
//                   placeholder={t('select')}
//                   options={options}
//                   isSearchable={false}
//                   onChange={(selected) => {
//                     field.onChange(selected?.value || null);
//                   }}
//                   className="block w-full min-w-0 flex-1 rounded-sm text-sm"
//                   value={value as AvailabilityOption}
//                   components={{Option, SingleValue}}
//                   isMulti={false}
//                   isDisabled={isPending}
//                 />
//               );
//             }}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// const TeamAvailability = ({
//   teamMembers,
//   hostSchedulesQuery
// }: EventTypeTeamScheduleProps & {teamMembers: TeamMember[]}) => {
//   const {t} = useLocale();
//   const {watch} = useFormContext<FormValues>();
//   const [animationRef] = useAutoAnimate<HTMLUListElement>();
//   const hosts = watch('hosts');
//   return (
//     <>
//       <div className="border-subtle flex flex-col rounded-md">
//         <div className="border-subtle mt-5 rounded-t-md border p-6 pb-5">
//           <Label className="mb-1 text-sm font-semibold">
//             {t('choose_hosts_schedule')}
//           </Label>
//           <p className="text-subtle max-w-full break-words text-sm leading-tight">
//             {t('hosts_schedule_description')}
//           </p>
//         </div>
//         <div className="border-subtle rounded-b-md border border-t-0 p-6">
//           {hosts && hosts.length > 0 ? (
//             <ul
//               className={classNames(
//                 'mb-4 mt-3 rounded-md',
//                 hosts.length >= 1 && 'border-subtle border'
//               )}
//               ref={animationRef}
//             >
//               {hosts?.map((host, index) => (
//                 <li
//                   key={host.userId}
//                   className={`flex flex-col px-3 py-2 ${
//                     index === hosts.length - 1 ? '' : 'border-subtle border-b'
//                   }`}
//                 >
//                   <TeamMemberSchedule
//                     host={host}
//                     index={index}
//                     teamMembers={teamMembers}
//                     hostScheduleQuery={hostSchedulesQuery}
//                   />
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-subtle max-w-full break-words text-sm leading-tight">
//               {t('no_hosts_description')}
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// const useCommonScheduleState = (initialScheduleId: number | null) => {
//   const {setValue} = useFormContext<FormValues>();
//   const [useHostSchedulesForTeamEvent, setUseHostSchedulesForTeamEvent] =
//     useState(!initialScheduleId);
//   // Reset the main schedule
//   const clearMainSchedule = () => {
//     setValue('schedule', null, {shouldDirty: Boolean(initialScheduleId)});
//   };
//   // Toggle function
//   const toggleScheduleState = (checked: boolean) => {
//     const useHostSchedulesForTeamEvent = !checked;
//     setUseHostSchedulesForTeamEvent(useHostSchedulesForTeamEvent);
//     if (useHostSchedulesForTeamEvent) clearMainSchedule();
//   };
//   return {
//     useHostSchedulesForTeamEvent,
//     toggleScheduleState
//   };
// };

// const UseCommonScheduleSettingsToggle = ({
//   eventType,
//   ...rest
// }: EventTypeScheduleProps) => {
//   const {t} = useLocale();
//   const {useHostSchedulesForTeamEvent, toggleScheduleState} =
//     useCommonScheduleState(eventType.schedule);
//   return (
//     <>
//       <SettingsToggle
//         checked={!useHostSchedulesForTeamEvent}
//         onCheckedChange={toggleScheduleState}
//         title={t('choose_common_schedule_team_event')}
//         description={t('choose_common_schedule_team_event_description')}
//       >
//         {/* handles the state for which 'schedule' ID is set, as it's unknown until the Select dropdown is loaded */}
//         <EventTypeSchedule eventType={eventType} {...rest} />
//       </SettingsToggle>
//       {useHostSchedulesForTeamEvent && (
//         <div className="lg:ml-14">
//           <TeamAvailability
//             teamMembers={rest.teamMembers}
//             hostSchedulesQuery={rest.hostSchedulesQuery}
//           />
//         </div>
//       )}
//     </>
//   );
// };

export const EventAvailabilityTab = ({
  eventType,
  isTeamEvent,
  ...rest
}: EventAvailabilityTabProps) => {
  return (
    <EventTypeSchedule eventType={eventType} {...rest} />
    // isTeamEvent && eventType.schedulingType !== SchedulingType.MANAGED ? (
    // <UseCommonScheduleSettingsToggle eventType={eventType} {...rest} />
    // ) : (
    // <EventTypeSchedule eventType={eventType} {...rest} />
    // );
  );
};

type Props = {
  slug: string;
};

type AvailabilityFormData = {
  availability: ServiceAvailabilityType[];
};

const daysOfWeek = [
  {value: 'monday', label: 'Segunda-feira'},
  {value: 'tuesday', label: 'Terça-feira'},
  {value: 'wednesday', label: 'Quarta-feira'},
  {value: 'thursday', label: 'Quinta-feira'},
  {value: 'friday', label: 'Sexta-feira'},
  {value: 'saturday', label: 'Sábado'},
  {value: 'sunday', label: 'Domingo'}
];

export default function ServiceAvailability({slug}: Props) {
  const {
    queries: {initialMe, serviceDetails, initialScheduleList},
    ServicesDetailsForm: {register, handleSubmit, watch, getValues, setValue}
  } = useServicesDetails();

  const onSubmit = (data: unknown) => {
    console.log(data);
    // TODO: Implementar atualização da disponibilidade
  };

  return (
    <>
      {/* <form
        onSubmit={() => onSubmit(getValues() as unknown)}
        className="space-y-6 flex flex-col gap-4 max-w-2xl"
      >
        <div className="space-y-4 ">
          <div className="text-title-h6">Geral</div>
          <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-strong-950">
                Disponibilidade
              </label>
              <Select.Root>
                <Select.Trigger>
                  <Select.Value placeholder="Selecione os dias" />
                </Select.Trigger>
                <Select.Content>
                  {daysOfWeek.map((day) => (
                    <Select.Item key={day.value} value={day.value}>
                      {day.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <Divider.Root />

          <div className="">
            <h3 className="text-title-h6">Horários Configurados</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-background-soft-100 rounded">
                <table className="mt-4 w-full max-w-[400px] text-paragraph-sm">
                  <tbody>
                    {[
                      {dia: 'Segunda-feira', inicio: '09:00h', fim: '17:00h'},
                      {dia: 'Terça-feira', inicio: '09:00h', fim: '17:00h'},
                      {dia: 'Quarta-feira', inicio: '09:00h', fim: '17:00h'},
                      {dia: 'Quinta-feira', inicio: '09:00h', fim: '17:00h'},
                      {dia: 'Sexta-feira', inicio: '09:00h', fim: '17:00h'},
                      {dia: 'Sábado', inicio: 'Indisponível', fim: ''},
                      {dia: 'Domingo', inicio: 'Indisponível', fim: ''}
                    ].map(({dia, inicio, fim}) => (
                      <tr
                        key={dia}
                        className={`${inicio === 'Indisponível' ? 'text-text-disabled-300' : 'text-text-sub-600'}`}
                      >
                        <td className="py-2 text-text-strong-950">{dia}</td>
                        <td className="py-2 text-center">{inicio}</td>
                        {inicio !== 'Indisponível' && (
                          <>
                            <td className="py-2 text-center">-</td>
                            <td className="py-2 text-center">{fim}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Divider.Root />

        <div className="flex justify-between items-center gap-2">
          <Button.Root mode="ghost" className="w-fit">
            <Button.Icon as={RiGlobalLine} />
            America/Sao_Paulo
          </Button.Root>
          <Button.Root mode="ghost" className="w-fit">
            Editar Disponibilidade
            <Button.Icon as={RiArrowRightUpLine} />
          </Button.Root>
        </div>
      </form> */}
      <EventAvailabilityTab
        isTeamEvent={false}
        eventType={serviceDetails}
        user={initialMe}
        schedulesQueryData={initialScheduleList}
        isSchedulesPending={initialScheduleList === undefined}
      />
    </>
  );
}
