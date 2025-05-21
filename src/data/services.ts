import {ServicesProps} from '@/components/services/Service';

export const services: ServicesProps[] = [
  {
    id: 1,
    title: 'Aula de Figma',
    slug: 'figma',
    duration: 60,
    price: 150.0,
    status: 'active',
    description: 'Aprenda a usar o Figma do zero ao avançado',
    location: 'Online via Google Meet',
    badgeColor: 'feature'
  },
  {
    id: 2,
    title: 'Aula de Framer',
    slug: 'framer',
    duration: 60,
    price: 150.0,
    status: 'active',
    description: 'Aprenda a criar protótipos interativos com Framer',
    location: 'Online via Google Meet',
    badgeColor: 'information'
  },
  {
    id: 3,
    title: 'Aula de Photoshop',
    slug: 'ps',
    duration: 60,
    price: 100.0,
    status: 'active',
    description: 'Domine o Photoshop para design e edição de imagens',
    location: 'Online via Google Meet',
    badgeColor: 'success'
  },
  {
    id: 4,
    title: 'Consultoria',
    slug: 'consult',
    duration: 60,
    price: 200.0,
    status: 'active',
    description: 'Consultoria personalizada para seu projeto de design',
    location: 'Online via Google Meet',
    badgeColor: 'verified'
  },
  {
    id: 5,
    title: 'Conversa de Design',
    slug: 'talk',
    duration: 30,
    price: 50.0,
    status: 'active',
    description: 'Bate-papo sobre design, carreira e mercado',
    location: 'Online via Google Meet',
    badgeColor: 'highlighted'
  }
];
