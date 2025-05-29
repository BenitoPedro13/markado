'use client';

import * as Button from '@/components/align-ui/ui/button';
import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Hint from '@/components/align-ui/ui/hint';
import {RiArrowRightSLine, RiErrorWarningFill} from '@remixicon/react';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {useActionState, useRef, useState} from 'react';
import {FormActionState} from '@/types/formTypes';
import { updateProfileAction } from '~/trpc/server/handlers/profile.handler';

interface ProfileFieldProps {
  name: string;
  label: string;
  defaultValue: string;
  description: string;
  error?: string[];
}

const ProfileField = ({
  name,
  label,
  defaultValue,
  description,
  error
}: ProfileFieldProps) => (
  <div className="p-6 border-b border-stroke-soft-200">
    <div className="flex justify-between items-start">
      <div className="space-y-1 w-[280px]">
        <h3 className="text-paragraph-md text-text-strong-950">{label}</h3>
        <p className="text-paragraph-sm text-text-sub-600">{description}</p>
      </div>
      <div className="w-[400px]">
        <Input.Root hasError={!!error}>
          <Input.Wrapper>
            <Input.Input defaultValue={defaultValue} name={name} />
          </Input.Wrapper>
        </Input.Root>
        {error && (
          <Hint.Root className="text-label-sm" hasError>
            <Hint.Icon as={RiErrorWarningFill} />
            {error.join(', ')}
          </Hint.Root>
        )}
      </div>
    </div>
  </div>
);

interface ProfileFormProps {
  me: NonNullable<Awaited<ReturnType<typeof getMeByUserId>>>;
}

const initialState: FormActionState = {
  success: false,
  errors: undefined
};

export default function ProfileForm({me}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  const [bio, setBio] = useState(me?.biography || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      imageInputRef.current!.value = '';

      return;
    }

    // Validate file type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      console.error('Invalid file type. Please upload a PNG or JPEG image.');
      imageInputRef.current!.value = '';
      return;
    }

    // Check dimensions
    const imgElement = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);
    imgElement.onload = () => {
      if (imgElement.width < 400 || imgElement.height < 400) {
        console.error('Image dimensions are too small. Minimum is 400x400px.');
        imageInputRef.current!.value = '';
        return;
      }

      // Base 64 encode the image
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        imageInputRef.current!.value = base64Image;
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    };
    imgElement.src = objectUrl;
  };

  return (
    <form
      className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200"
      action={formAction}
      id="form_profile"
    >
      <div className="flex justify-between items-center p-6">
        <div className="space-y-1 w-[280px]">
          <h3 className="text-paragraph-md text-text-strong-950">
            Foto do perfil
          </h3>
          <p className="text-paragraph-sm text-text-sub-600">
            Mínimo 400x400px, formatos PNG ou JPEG.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar.Root size="48">
            <Avatar.Image
              src={imagePreview || me?.image || ''}
              alt={`Foto de perfil de ${me?.name || 'Usuário'}`}
            />
          </Avatar.Root>
          <Button.Root
            variant="neutral"
            mode="stroke"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-paragraph-md text-text-sub-600">
              Carregar imagem
            </span>
            <RiArrowRightSLine className="size-5" />
          </Button.Root>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          name="image_file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          name="image"
          ref={imageInputRef}
          className="hidden"
        />
      </div>

      <ProfileField
        label="Nome do usuário"
        defaultValue={me?.username || ''}
        description="Aparece na URL. Escolha algo simples e único."
        name="username"
      />

      <ProfileField
        label="Nome completo"
        defaultValue={me?.name || ''}
        description="Seu nome completo."
        name="name"
      />

      <ProfileField
        label="E-mail"
        defaultValue={me?.email || ''}
        description="Seu endereço de e-mail principal."
        name="email"
      />

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-[280px]">
            <h3 className="text-paragraph-md text-text-strong-950">
              Biografia
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Um breve resumo sobre você.
            </p>
          </div>
          <div className="w-[400px] flex flex-col gap-2">
            <Textarea.Root
              placeholder={`Meu nome é ${me.name || 'Fulano de Tal'}, eu sou...`}
              name="biography"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              hasError={state.errors && state.errors.biography ? true : false}
            >
              <Textarea.CharCounter current={bio.length} max={200} />
            </Textarea.Root>
            {state.errors?.biography && (
              <Hint.Root className="text-label-sm" hasError>
                <Hint.Icon as={RiErrorWarningFill} />
                {state.errors.biography.join(', ')}
              </Hint.Root>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
