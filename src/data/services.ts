import { ServiceBadgeColor } from '~/prisma/enums';
import { ServicesProps } from '@/components/services/Service';

export const services: ServicesProps[] = [
  {
    id: 1,
    title: 'Aula de Figma',
    slug: 'figma',
    length: 60,
    price: 150.0,
    hidden: true,
    description: 'Aprenda a usar o Figma do zero ao avançado',
    location: 'Online via Google Meet',
    badgeColor: 'feature',

  },
  {
    id: 2,
    title: 'Aula de Framer',
    slug: 'framer',
    length: 60,
    price: 150.0,
    hidden: true,
    description: 'Aprenda a criar protótipos interativos com Framer',
    location: 'Online via Google Meet',
    badgeColor: 'information',

  },
  {
    id: 3,
    title: 'Aula de Photoshop',
    slug: 'ps',
    length: 60,
    price: 100.0,
    hidden: true,
    description: 'Domine o Photoshop para design e edição de imagens',
    location: 'Online via Google Meet',
    badgeColor: 'success',

  },
  {
    id: 4,
    title: 'Consultoria',
    slug: 'consult',
    length: 60,
    price: 200.0,
    hidden: true,
    description: 'Consultoria personalizada para seu projeto de design',
    location: 'Online via Google Meet',
    badgeColor: 'verified',

  },
  {
    id: 5,
    title: 'Conversa de Design',
    slug: 'talk',
    length: 30,
    price: 50.0,
    hidden: true,
    description: 'Bate-papo sobre design, carreira e mercado',
    location: 'Online via Google Meet',
    badgeColor: 'highlighted',

  }
];

export const baseServices = [
  {
    id: 1,
    title: 'Reunião de 30min',
    slug: 'reuniao-de-30min',
    length: 30,
    price: 150,
    hidden: false,
    locations: ['Online via Google Meet'],
    description: 'Reunião de 30min',
    badgeColor: ServiceBadgeColor.feature,
  },
  {
    id: 2,
    title: 'Reuniao de 1 hora',
    slug: 'reuniao-de-1-hora',
    length: 60,
    price: 150,
    hidden: false,
    locations: ['Online via Google Meet'],
    description: 'Reuniao de 1 hora',
    badgeColor: ServiceBadgeColor.information,
  },
  {
    id: 3,
    title: 'Aula Teste',
    slug: 'aula-teste',
    length: 60,
    price: 100,
    hidden: false,
    locations: ['Online via Google Meet'],
    description: 'Aula Teste',
    badgeColor: ServiceBadgeColor.success,
  }
  // ,
  // {
  //   id: 4,
  //   title: 'Consultoria',
  //   slug: 'consult',
  //   length: 60,
  //   price: 200,
  //   hidden: true,
  //   locations: ['Online via Google Meet'],
  //   description: 'Consultoria personalizada para seu projeto de design',
  //   badgeColor: ServiceBadgeColor.verified,
  // },
  // {
  //   id: 5,
  //   title: 'Conversa de Design',
  //   slug: 'talk',
  //   length: 30,
  //   price: 50,
  //   hidden: true,
  //   locations: ['Online via Google Meet'],
  //   description: 'Bate-papo sobre design, carreira e mercado',
  //   badgeColor: ServiceBadgeColor.highlighted,
  // },
];
