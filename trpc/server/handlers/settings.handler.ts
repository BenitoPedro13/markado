'use server';

import {auth} from '@/auth';
import {ZUpdateSettingsGeneralSchema} from '~/trpc/server/schemas/settings.schema';
import {TRPCError} from '@trpc/server';
import {FormActionState} from '@/types/formTypes';
import {revalidatePath} from 'next/cache';
import {prisma} from '@/lib/prisma';

export async function updateGeneralSettingsHandler(
  input: typeof ZUpdateSettingsGeneralSchema._type
) {
  const session = await auth();

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    });
  }

  // Update user
  return prisma.user.update({
    where: {id: session.user.id},
    data: {
      locale: input.locale,
      timeZone: input.timeZone,
      timeFormat: input.timeFormat,
      weekStart: input.weekStart
    }
  });
}

export async function updateGeneralAction(
  previousState: FormActionState,
  generalFormData: FormData
) {
  'use server';
  const validatedForm = ZUpdateSettingsGeneralSchema.safeParse({
    locale: generalFormData.get('locale'),
    timeZone: generalFormData.get('timeZone'),
    timeFormat: Number(generalFormData.get('timeFormat')),
    weekStart: generalFormData.get('weekStart')
  });

  if (!validatedForm.success) {
    console.error('Validation failed:', validatedForm.error);
    return {
      errors: validatedForm.error.flatten().fieldErrors,
      success: false
    };
  }

  console.log('Validated form data:', validatedForm.data);

  try {
    const result = await updateGeneralSettingsHandler(validatedForm.data);
    console.log('General settings updated successfully:', result);
    revalidatePath('/settings/general');
    return {success: true};
  } catch (error) {
    console.error('Error updating general settings:', error);
    return {
      errors: {form: ['Erro ao atualizar dados gerais']},
      success: false
    };
  }
}
