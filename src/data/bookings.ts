export type Booking = {
  uid: string;
  id: string;
  title: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  organizer: string;
  type: 'online' | 'presential';
  participants: string[];
  status: 'confirmed' | 'canceled';
  location?: string;
};

export const bookings: Booking[] = [
  {
    uid: 'uid-1',
    id: '1',
    title: 'Reunião de 30 min',
    duration: 30,
    startTime: new Date('2024-03-18T09:50:00'),
    endTime: new Date('2024-03-18T10:20:00'),
    organizer: 'João',
    type: 'online',
    participants: ['Você', 'João'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    uid: 'uid-2',
    id: '2',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-18T09:30:00'),
    endTime: new Date('2024-03-18T09:45:00'),
    organizer: 'Marcus Dutra',
    type: 'online',
    participants: ['com Marcus Dutra'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    uid: 'uid-3',
    id: '3',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-14T09:30:00'),
    endTime: new Date('2024-03-14T09:45:00'),
    organizer: 'Lucas',
    type: 'online',
    participants: ['Você', 'Lucas'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    uid: 'uid-4',
    id: '4',
    title: 'Reunião de 15 min',
    duration: 15,
    startTime: new Date('2024-03-14T09:50:00'),
    endTime: new Date('2024-03-14T10:05:00'),
    organizer: 'Mário',
    type: 'online',
    participants: ['Você', 'Mário'],
    status: 'confirmed',
    location: 'Google Meet'
  },
  {
    uid: 'uid-5',
    id: '5',
    title: 'Consulta Odontológica',
    duration: 60,
    startTime: new Date('2024-03-15T14:00:00'),
    endTime: new Date('2024-03-15T15:00:00'),
    organizer: 'Dr. Silva',
    type: 'presential',
    participants: ['Dr. Silva'],
    status: 'confirmed',
    location: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ, 20040-007'
  },
  {
    uid: 'uid-6',
    id: '6',
    title: 'Sessão de Fisioterapia',
    duration: 45,
    startTime: new Date('2024-03-18T16:00:00'),
    endTime: new Date('2024-03-18T16:45:00'),
    organizer: 'Dra. Ana',
    type: 'presential',
    participants: ['Dra. Ana'],
    status: 'canceled',
    location: 'Rua do Ouvidor, 60 - Centro, Rio de Janeiro - RJ, 20040-030'
  },
  {
    uid: 'uid-7',
    id: '7',
    title: 'Avaliação Nutricional',
    duration: 30,
    startTime: new Date('2024-03-19T10:00:00'),
    endTime: new Date('2024-03-19T10:30:00'),
    organizer: 'Nutricionista Paula',
    type: 'presential',
    participants: ['Nutricionista Paula'],
    status: 'confirmed',
    location: 'Rua da Quitanda, 86 - Centro, Rio de Janeiro - RJ, 20011-030'
  }
];
