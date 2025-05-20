'use client';

import * as Select from '@/components/align-ui/ui/select';
import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Label from '@/components/align-ui/ui/label';
import * as Input from '@/components/align-ui/ui/input';
import * as TextArea from '@/components/align-ui/ui/textarea';
import {Root as Button} from '@/components/align-ui/ui/button';
import {Calendar} from '@/components/ui/Calendar';
import {useScheduling} from '@/contexts/SchedulingContext';
import {cn} from '@/lib/utils';
import {
  RiCalendarCheckFill,
  RiGlobalLine,
  RiMailLine,
  RiTicketLine,
  RiTimeLine,
  RiUser6Line
} from '@remixicon/react';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {useParams, useRouter} from 'next/navigation';
import {useMemo, useState} from 'react';
import {services} from '@/data/services';
import TimezoneSelectWithStyle from '@/components/TimezoneSelectWithStyle';
import {getHostUserByUsername} from '~/trpc/server/handlers/user.handler';
import {getServiceBySlugAndUsername} from '~/trpc/server/handlers/service.handler';
import {dateToCalendarDateString, dateToTimeString} from '@/utils/time-utils';

// TODO: Jogar para uma função utilitária
const parseServiceDuration = (duration_in_minutes: number): string => {
  const hours = Math.floor(duration_in_minutes / 60);
  const minutes = duration_in_minutes % 60;
  if (hours > 0) {
    const str = `${hours}h`;
    if (minutes > 0) {
      return `${str} ${minutes}m`;
    }
    return str;
  }
  return `${minutes}m`;
};
// TODO: Jogar para uma função utilitária
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const GoogleMeetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.125 14.7246C3.125 15.2219 3.53124 15.6246 4.03176 15.6246H4.04479C3.53661 15.6246 3.125 15.2219 3.125 14.7246Z"
      fill="#FBBC05"
    />
    <path
      d="M10.9172 7.74998V10.0997L14.0851 7.54448V5.275C14.0851 4.77775 13.6789 4.375 13.1784 4.375H6.31522L6.30908 7.74998H10.9172Z"
      fill="#FBBC05"
    />
    <path
      d="M10.9171 12.4503H6.30126L6.2959 15.6251H13.1782C13.6795 15.6251 14.085 15.2223 14.085 14.7251V12.6761L10.9171 10.1006V12.4503Z"
      fill="#34A853"
    />
    <path
      d="M6.31514 4.375L3.125 7.74998H6.30977L6.31514 4.375Z"
      fill="#EA4335"
    />
    <path
      d="M3.125 12.4502V14.7249C3.125 15.2222 3.53661 15.6249 4.04479 15.6249H6.29597L6.30134 12.4502H3.125Z"
      fill="#1967D2"
    />
    <path
      d="M6.30977 7.75H3.125V12.4502H6.30134L6.30977 7.75Z"
      fill="#4285F4"
    />
    <path
      d="M16.8706 13.925V6.20006C16.692 5.17481 15.5676 6.35005 15.5676 6.35005L14.0859 7.5448V12.6755L16.2068 14.3998C16.9725 14.5003 16.8706 13.925 16.8706 13.925Z"
      fill="#34A853"
    />
    <path
      d="M10.917 10.0994L14.0857 12.6756V7.54492L10.917 10.0994Z"
      fill="#188038"
    />
  </svg>
);

// TODO: Time slots do backend?
// Lidar com horários disponíveis baseado nos dados preenchidos no onboarding
const timeSlots = [
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45'
];

const CalendarRoot = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="overflow-hidden h-full gap-5 md:gap-0 md:max-h-[548px] flex flex-col md:grid md:grid-cols-8 p-6 w-full max-w-[1024px] md:border md:border-bg-soft-200 md:rounded-[24px]"
      {...props}
    >
      {children}
    </div>
  );
};
CalendarRoot.displayName = 'CalendarRoot';

const CalendarSection = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('w-full flex flex-1 flex-col gap-2', props.className)}
      {...props}
    >
      {children}
    </div>
  );
};
CalendarSection.displayName = 'CalendarSection';

const CalendarSectionItem = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'text-label-sm flex gap-[5px] text-text-sub-600 items-center ',
        props.className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
CalendarSectionItem.displayName = 'CalendarSectionItem';

interface ServiceCalendarFormProps {
  host: Awaited<ReturnType<typeof getHostUserByUsername>>;
  service: Awaited<ReturnType<typeof getServiceBySlugAndUsername>>;
}

const ServiceCalendarForm = ({
  host,
  service
}: Readonly<ServiceCalendarFormProps>) => {
  const [day, setDay] = useState<Date>();
  const [time, setTime] = useState<string>();

  const [timezone, setTimezone] = useState<string | undefined>();

  const router = useRouter();

  const handleDateSelect = (selected: Date | undefined) => {
    setDay(selected);
  };

  const selectTime = (time: string) => {
    if (!day) {
      setTime(undefined);
      return;
    }

    setTime(time);

    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(day);
    newDate.setHours(hours, minutes, 0, 0);

    console.log('newDate', newDate);
    // TODO: Converter a data marcada pra string no formato correto
    const dateString = dateToCalendarDateString(newDate);
    // Redireciona para a rota de finalização
  };

  const scheduleDate: Date | undefined = useMemo(() => {
    if (!day || !time) return undefined;

    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(day);
    newDate.setHours(hours, minutes, 0, 0);

    return newDate;
  }, [day, time]);

  const clearScheduledDate = () => {
    setDay(undefined);
    setTime(undefined);
    setTimezone(undefined);
  };

  const dateSelectionElement = (
    <>
      {/* Calendar */}
      <CalendarSection className="md:col-span-4 md:border-x md:border-x-bg-soft-200">
        <Calendar
          mode="single"
          selected={day}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
        />
      </CalendarSection>

      {/* Time slots */}
      <CalendarSection className="h-full md:pl-5 md:col-span-2">
        <div className="space-y-4 h-full">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">
              {day
                ? format(day, "EEEE, d 'de' MMMM", {locale: ptBR})
                : 'Selecione uma data'}
            </h3>
          </div>

          <div className="h-full md:h-[458px] md:overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={'neutral'}
                  mode={
                    day &&
                    (() => {
                      const [h, m] = time.split(':').map(Number);
                      return day.getHours() === h && day.getMinutes() === m;
                    })()
                      ? 'lighter'
                      : 'stroke'
                  }
                  className="w-full"
                  onClick={() => selectTime(time)}
                  disabled={!day}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CalendarSection>
    </>
  );

  const formElement = (
    <form
      action=""
      className="col-span-5 flex flex-col flex-1 w-full md:border-l md:border-x-bg-soft-200 pl-6 gap-4"
    >
      <div>
        <Label.Root
          htmlFor="name"
          className="text-label-sm text-text-strong-950 pb-1"
        >
          Seu nome
          <Label.Asterisk />
        </Label.Root>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiUser6Line} />
            <Input.Input
              id="name"
              type="text"
              placeholder="Digite seu nome..."
              className="w-full"
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      <div>
        <Label.Root
          htmlFor="email"
          className="text-label-sm text-text-strong-950 pb-1"
        >
          Endereço de e-mail
          <Label.Asterisk />
        </Label.Root>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiMailLine} />
            <Input.Input
              id="email"
              type="text"
              placeholder="Digite seu email..."
              className="w-full"
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      <div>
        <Label.Root
          htmlFor="observations"
          className="text-label-sm text-text-strong-950 pb-1"
        >
          Observações
          <Label.Sub>(Opcional)</Label.Sub>
        </Label.Root>
        <TextArea.Root
          id="observations"
          placeholder="Deixe aqui suas observações para esse evento..."
          maxLength={200}
        >
          <TextArea.CharCounter
            current={0}
            max={200}
            className="text-text-sub-600"
          />
        </TextArea.Root>
      </div>
      <div className="flex gap-x-2 justify-end mt-auto">
        <Button
          variant="neutral"
          mode="stroke"
          className=""
          onClick={clearScheduledDate}
        >
          Voltar
        </Button>
        <Button
          variant="neutral"
          mode="filled"
          className=""
          onClick={() => {
            router.push(`/${host.username}/${service.slug}/finalization`);
          }}
        >
          Finalizar
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex-1 flex justify-center items-center md:p-8 ">
      <CalendarRoot>
        {/** User info */}
        <CalendarSection
          className={`pr-5 ${!scheduleDate ? 'col-span-2' : 'col-span-3'}`}
        >
          <div className="md:px-5 flex items-center gap-[5px]">
            <Avatar.Root size={'40'} fallbackText={host.name || ''}>
              <Avatar.Image src={host.image || ''} alt={host.name || 'User'} />
            </Avatar.Root>
            <h2 className="font-medium text-lg">{host.name}</h2>
          </div>
          <div className="mt-5 md:px-5 flex flex-col gap-[10px]">
            <h1 className="text-label-xl text-stroke-strong-950">
              {service.title || 'Serviço'}
            </h1>
            {scheduleDate && (
              <CalendarSectionItem>
                <RiCalendarCheckFill
                  size={20}
                  color="var(--text-sub-600)"
                  className="flex-none"
                />
                <p
                  className="whitespace-nowrap overflow-hidden text-ellipsis"
                  title={capitalizeFirstLetter(
                    format(scheduleDate, 'PPPP', {
                      locale: ptBR
                    })
                  )}
                >
                  {capitalizeFirstLetter(
                    format(scheduleDate, 'PPPP', {
                      locale: ptBR
                    })
                  )}
                </p>
              </CalendarSectionItem>
            )}
            <CalendarSectionItem>
              <GoogleMeetIcon />
              Google meet
            </CalendarSectionItem>
            <CalendarSectionItem>
              <RiTimeLine size={20} color="var(--text-sub-600)" />
              {parseServiceDuration(service.duration)}
              {scheduleDate &&
                `, ${dateToTimeString(scheduleDate)}h até ${dateToTimeString(
                  new Date(
                    scheduleDate.getTime() + service.duration * 60 * 1000
                  )
                )}h`}
            </CalendarSectionItem>
            <CalendarSectionItem>
              <RiTicketLine size={20} color="var(--text-sub-600)" />
              R$150
            </CalendarSectionItem>
            <CalendarSectionItem>
              <TimezoneSelectWithStyle
                variant="inline"
                hint={false}
                value={timezone}
                onChange={setTimezone}
              />
            </CalendarSectionItem>
          </div>
        </CalendarSection>
        {!scheduleDate ? dateSelectionElement : formElement}
      </CalendarRoot>
    </div>
  );
};

export default ServiceCalendarForm;
