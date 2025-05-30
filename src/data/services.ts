import {ServicesProps} from '@/components/services/Service';

export const services: ServicesProps[] = [
  {
    id: 1,
    title: 'Aula de Figma',
    slug: 'figma',
    duration: 60,
    price: 150.0,
    hidden: true,
    description: 'Aprenda a usar o Figma do zero ao avançado',
    location: 'Online via Google Meet',
    badgeColor: 'feature',
    // username: 'rafael'
  },
  {
    id: 2,
    title: 'Aula de Framer',
    slug: 'framer',
    duration: 60,
    price: 150.0,
    hidden: true,
    description: 'Aprenda a criar protótipos interativos com Framer',
    location: 'Online via Google Meet',
    badgeColor: 'information',
    // username: 'rafael'
  },
  {
    id: 3,
    title: 'Aula de Photoshop',
    slug: 'ps',
    duration: 60,
    price: 100.0,
    hidden: true,
    description: 'Domine o Photoshop para design e edição de imagens',
    location: 'Online via Google Meet',
    badgeColor: 'success',
    // username: 'rafael'
  },
  {
    id: 4,
    title: 'Consultoria',
    slug: 'consult',
    duration: 60,
    price: 200.0,
    hidden: true,
    description: 'Consultoria personalizada para seu projeto de design',
    location: 'Online via Google Meet',
    badgeColor: 'verified',
    // username: 'rafael'
  },
  {
    id: 5,
    title: 'Conversa de Design',
    slug: 'talk',
    duration: 30,
    price: 50.0,
    hidden: true,
    description: 'Bate-papo sobre design, carreira e mercado',
    location: 'Online via Google Meet',
    badgeColor: 'highlighted',
    // username: 'rafael'
  }
];
