'use client';

import * as Avatar from '@/components/align-ui/ui/avatar';
import {Root as Button} from '@/components/align-ui/ui/button';
import * as Textarea from '@/components/align-ui/ui/textarea';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {useSignUp} from '@/contexts/SignUpContext';
import {useTRPC} from '@/utils/trpc';
import {RiAccountPinCircleFill, RiUserSmileFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {FormEvent, useEffect, useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useNotification} from '@/hooks/use-notification';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {setStepComplete, clearEditMode} from '@/utils/cookie-utils';
import Image from 'next/image';

interface ProfileFormProps {
  user: Awaited<ReturnType<typeof getMeByUserId>>;
}

const ProfileForm = ({user}: ProfileFormProps) => {
  const trpc = useTRPC();
  const {forms, goToStep} = useSignUp();
  const t = useTranslations('SignUpPage.ProfileForm');
  const {notification} = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>(user?.image || '');
  const [bioLength, setBioLength] = useState(0);

  const updateProfileMutation = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: () => {
        // Set the profile step completion cookie
        setStepComplete('profile');

        // Clear the edit_mode cookie if it exists
        clearEditMode();

        // Continue to the next step
        goToStep('/sign-up/ending');
      },
      onError: (error) => {
        notification({
          title: t('error'),
          description: t('error_updating_profile'),
          variant: 'stroke'
        });
      }
    })
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      notification({
        title: t('error'),
        description: t('invalid_file_type'),
        variant: 'stroke'
      });
      return;
    }

    // Create an image object to check dimensions
    const imgElement = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);

    imgElement.onload = () => {
      if (imgElement.width < 400 || imgElement.height < 400) {
        notification({
          title: t('error'),
          description: t('image_too_small'),
          variant: 'stroke'
        });
        URL.revokeObjectURL(objectUrl);
        return;
      }

      // Valid image, set preview and form value
      setPreviewImage(objectUrl);
      forms.profile.setValue('image', objectUrl);
    };

    imgElement.src = objectUrl;
  };

  const handleSkip = () => {
    goToStep('/sign-up/ending');
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = forms.profile.getValues();

    try {
      await updateProfileMutation.mutateAsync({
        biography: formData.biography,
        image: formData.image
      });
    } catch (error) {
      console.error('[ProfileForm] Error updating profile:', error);
    }
  };

  // Subscribe to biography field changes
  useEffect(() => {
    const subscription = forms.profile.watch((value, { name, type }) => {
      if (name === 'biography') {
        console.log('[ProfileForm] Bio changed:', value.biography);
        setBioLength(value.biography?.length || 0);
      }
    });
    
    // Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, [forms.profile]);

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiAccountPinCircleFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('quase_terminando')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('envie_uma_foto_bonita')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        {/* Image Upload Section */}
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center justify-start gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-bg-soft-200 flex items-center justify-start gap-5">
              <Avatar.Root size="64" fallbackText={user?.name || 'User Name'}>
                <Avatar.Image
                  src={previewImage || user?.image || ''}
                  alt={user?.name || 'User Name'}
                  useNextImage={true}
                />
              </Avatar.Root>
            </div>
            <div className="flex flex-col gap-3 items-start">
              <div className="flex flex-col items-start gap-1">
                <p className="text-label-md text-text-strong-950">
                  Carregar Imagem
                </p>
                <span className="text-paragraph-sm text-text-sub-600">
                  Min 400x400px, PNG ou JPEG
                </span>
              </div>

              <Button
                type="button"
                variant="neutral"
                mode="stroke"
                size="xsmall"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-label-sm">{t('enviar_imagem')}</span>
              </Button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Biography Section */}
        <div className="flex flex-col items-start gap-1 self-stretch min-h-[120px]">
          <div className="flex items-center self-stretch">
            <p className="text-label-sm text-text-strong-950">Biografia</p>
          </div>
          <Textarea.Root
            placeholder={t('descreva_voce')}
            containerClassName="min-h-[88px] w-full rounded-xl shadow-regular-xs bg-bg-white-0 border-bg-soft-200"
            maxLength={200}
            {...forms.profile.register('biography')}
          >
            <Textarea.CharCounter current={bioLength} max={200} />
          </Textarea.Root>
          <span className="text-paragraph-xs text-text-sub-600">
            {t('sera_exibido_no_perfil')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button
          className="w-full"
          variant="neutral"
          mode="filled"
          type="submit"
          disabled={updateProfileMutation.isPending}
        >
          <span className="text-label-sm">{t('continuar')}</span>
        </Button>
        <Button
          className="w-full"
          variant="neutral"
          mode="ghost"
          type="button"
          onClick={handleSkip}
        >
          <span className="text-label-sm">{t('pular_etapa')}</span>
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
