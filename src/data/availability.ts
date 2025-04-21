export type DaySchedule = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export type AvailabilityProps = {
  id: string;
  title: string;
  schedule: string;
  timezone: string;
  isDefault?: boolean;
  schedules: Record<string, DaySchedule>;
  status: 'active' | 'disabled';
  slug: string;
};

export const availabilities: AvailabilityProps[] = [
  {
    id: '1',
    title: 'Horas de Trabalho',
    schedule: 'seg. - sex., 9:00 até 17:00',
    timezone: 'America/São_Paulo',
    isDefault: true,
    status: 'active',
    slug: 'horas-de-trabalho',
    schedules: {
      'Segunda-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
      'Terça-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
      'Quarta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
      'Quinta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
      'Sexta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
      'Sábado': { enabled: false, startTime: '09:00', endTime: '17:00' },
      'Domingo': { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: '2',
    title: 'Final de Semana',
    schedule: 'sab. - dom., 9:00 até 14:00',
    timezone: 'America/São_Paulo',
    status: 'active',
    slug: 'final-de-semana',
    schedules: {
      'Segunda-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Terça-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quarta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quinta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sexta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sábado': { enabled: true, startTime: '09:00', endTime: '14:00' },
      'Domingo': { enabled: true, startTime: '09:00', endTime: '14:00' }
    }
  },
  {
    id: '3',
    title: 'Designer',
    schedule: 'sab. - dom., 9:00 até 14:00',
    timezone: 'America/São_Paulo',
    status: 'active',
    slug: 'designer',
    schedules: {
      'Segunda-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Terça-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quarta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quinta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sexta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sábado': { enabled: true, startTime: '09:00', endTime: '14:00' },
      'Domingo': { enabled: true, startTime: '09:00', endTime: '14:00' }
    }
  },
  {
    id: '4',
    title: 'Dev',
    schedule: 'sab. - dom., 9:00 até 14:00',
    timezone: 'America/São_Paulo',
    status: 'active',
    slug: 'dev',
    schedules: {
      'Segunda-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Terça-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quarta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Quinta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sexta-feira': { enabled: false, startTime: '09:00', endTime: '14:00' },
      'Sábado': { enabled: true, startTime: '09:00', endTime: '14:00' },
      'Domingo': { enabled: true, startTime: '09:00', endTime: '14:00' }
    }
  }
]; 