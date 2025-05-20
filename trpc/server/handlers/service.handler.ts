'use server';

import {services} from '@/data/services';

export async function getServiceBySlugAndUsername(
  slug: string,
  hostUsername: string
) {
  const service = services.find((service) => {
    // Compare with hostUsername
    return service.slug === slug;
  });

  if (!service) {
    throw new Error('Service not found');
  }

  return service;
}
