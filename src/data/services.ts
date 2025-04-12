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
    slug: 'marcaum/figma',
    duration: 60,
    price: 150.00,
    status: 'active'
  },
  {
    title: 'Aula de Framer',
    slug: 'marcaum/framer',
    duration: 60,
    price: 150.00,
    status: 'active'
  },
  {
    title: 'Aula de Photoshop',
    slug: 'marcaum/ps',
    duration: 60,
    price: 100.00,
    status: 'active'
  },
  {
    title: 'Consultoria',
    slug: 'marcaum/consult',
    duration: 60,
    price: 200.00,
    status: 'active'
  },
  {
    title: 'Conversa de Design',
    slug: 'marcaum/talk',
    duration: 30,
    price: 50.00,
    status: 'active'
  }
]; 