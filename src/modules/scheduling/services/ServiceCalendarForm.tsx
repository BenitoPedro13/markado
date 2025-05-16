'use client';

import * as Avatar from '@/components/align-ui/ui/avatar';
import {Root as Button} from '@/components/align-ui/ui/button';
import {Calendar} from '@/components/ui/Calendar';
import {useScheduling} from '@/contexts/SchedulingContext';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

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
      className="overflow-hidden h-full gap-5 md:gap-0 md:max-h-[548px] flex flex-col md:grid md:grid-cols-4 p-6 w-full max-w-[1024px] md:border md:border-bg-soft-200 md:rounded-[24px]"
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

const ServiceCalendarForm = () => {
  const [date, setDate] = useState<Date>();

  const {
    profileUser,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    service
  } = useScheduling();

  const router = useRouter();

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (selected) {
      setSelectedDate(new Date(selected.setHours(0, 0, 0, 0)));
    } else {
      setSelectedDate(null);
    }
  };

  const selectTime = (time: string) => {
    if (!date) return;
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    setSelectedDate(newDate);

    // Redireciona para a rota de finalização
    router.push(`/${profileUser?.username}/${service}/finalization`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="flex-1 flex justify-center items-center md:p-8 ">
      <CalendarRoot>
        {/** User info */}
        <CalendarSection className="pr-5">
          <div className="md:px-5 flex items-center gap-1">
            <Avatar.Root size={'48'} fallbackText={profileUser?.name || ''}>
              <Avatar.Image
                src={profileUser?.image || ''}
                alt={profileUser?.name || 'User'}
              />
            </Avatar.Root>
            <h1 className="font-medium text-lg">{profileUser?.name}</h1>
          </div>
        </CalendarSection>

        {/* Calendar */}
        <CalendarSection className="md:col-span-2 md:border-x md:border-x-bg-soft-200">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
          />
        </CalendarSection>

        {/* Time slots */}
        <CalendarSection className="h-full md:pl-5">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">
                {date
                  ? format(date, "EEEE, d 'de' MMMM", {locale: ptBR})
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
                      selectedDate &&
                      (() => {
                        const [h, m] = time.split(':').map(Number);
                        return (
                          selectedDate.getHours() === h &&
                          selectedDate.getMinutes() === m
                        );
                      })()
                        ? 'lighter'
                        : 'stroke'
                    }
                    className="w-full"
                    onClick={() => selectTime(time)}
                    disabled={!date}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CalendarSection>
      </CalendarRoot>
    </div>
  );
};

export default ServiceCalendarForm;
