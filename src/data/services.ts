export type ServicesProps = {
  title: string;
  slug: string;
  duration: number;
  price: number;
  status: 'active' | 'disabled';
  description?: string;
  location?: string;
  badgeColor: 'faded' | 'information' | 'warning' | 'error' | 'success' | 'away' | 'feature' | 'verified' | 'highlighted' | 'stable';
};

export const services: ServicesProps[] = [
  {
    title: 'Aula de Figma',
    slug: 'figma',
    duration: 60,
    price: 150.00,
    status: 'active',
    description: 'Aprenda a usar o Figma do zero ao avançado',
    location: 'Online via Google Meet',
    badgeColor: 'feature'
  },
  {
    title: 'Aula de Framer',
    slug: 'framer',
    duration: 60,
    price: 150.00,
    status: 'active',
    description: 'Aprenda a criar protótipos interativos com Framer',
    location: 'Online via Google Meet',
    badgeColor: 'information'
  },
  {
    title: 'Aula de Photoshop',
    slug: 'ps',
    duration: 60,
    price: 100.00,
    status: 'active',
    description: 'Domine o Photoshop para design e edição de imagens',
    location: 'Online via Google Meet',
    badgeColor: 'success'
  },
  {
    title: 'Consultoria',
    slug: 'consult',
    duration: 60,
    price: 200.00,
    status: 'active',
    description: 'Consultoria personalizada para seu projeto de design',
    location: 'Online via Google Meet',
    badgeColor: 'verified'
  },
  {
    title: 'Conversa de Design',
    slug: 'talk',
    duration: 30,
    price: 50.00,
    status: 'active',
    description: 'Bate-papo sobre design, carreira e mercado',
    location: 'Online via Google Meet',
    badgeColor: 'highlighted'
  }
]; 