export type ServicesProps = {
  title: string;
  slug: string;
  duration: number;
  price: number;
  status: 'active' | 'disabled';
};

export const services: ServicesProps[] = [
  {
    title: 'Aula de Figma',
    slug: 'figma',
    duration: 60,
    price: 150.00,
    status: 'active'
  },
  {
    title: 'Aula de Framer',
    slug: 'framer',
    duration: 60,
    price: 150.00,
    status: 'active'
  },
  {
    title: 'Aula de Photoshop',
    slug: 'ps',
    duration: 60,
    price: 100.00,
    status: 'active'
  },
  {
    title: 'Consultoria',
    slug: 'consult',
    duration: 60,
    price: 200.00,
    status: 'active'
  },
  {
    title: 'Conversa de Design',
    slug: 'talk',
    duration: 30,
    price: 50.00,
    status: 'active'
  }
]; 