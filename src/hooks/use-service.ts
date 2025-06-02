import {useState, useEffect} from 'react';
// import {Service} from '@/types/service';
import {services} from '@/data/services';
import { ServicesProps } from '@/components/services/Service';

export function useService(slug: string) {
  const [service, setService] = useState<ServicesProps | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const foundService = services.find(service => service.slug === slug);
        if (foundService) {
          setService(foundService);
        } else {
          throw new Error('Serviço não encontrado');
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  return {service, loading, error};
} 