import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import {ZUpdateProfileInputSchema} from '~/trpc/server/schemas/profile.schema';
import {updateProfileSettingsHandler} from '~/trpc/server/handlers/profile.handler';
import ProfileForm from '@/components/settings/profile/ProfileForm';
import {revalidatePath} from 'next/cache';
import {FormActionState} from '@/types/formTypes';
import Business from '@/components/settings/business/Business';
import Privacy from '@/components/settings/privacy/Privacy';

export default async function SettingsBusinessPage() {
  const session = await auth();
  const user = await getMeByUserId(session!.user.id);

  if (!user) {
    redirect('/login');
  }

  async function updateProfile(
    previousState: FormActionState,
    profileFormData: FormData
  ) {
    'use server';
    const validatedForm = ZUpdateProfileInputSchema.safeParse({
      name: profileFormData.get('name')?.toString(),
      username: profileFormData.get('username')?.toString(),
      email: profileFormData.get('email')?.toString(),
      image: profileFormData.get('image')?.toString(),
      biography: profileFormData.get('biography')?.toString()
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
      const result = await updateProfileSettingsHandler(validatedForm.data);
      console.log('Profile updated successfully:', result);
      revalidatePath('/settings/profile');
      return {success: true};
    } catch (error) {
      console.error('Error updating profile:', error);
      return {errors: {form: ['Erro ao atualizar perfil']}, success: false};
    }
  }

  return <Privacy />;
}
