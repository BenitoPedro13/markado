'use client';

import * as Button from '@/components/align-ui/ui/button';
import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Input from '@/components/align-ui/ui/input';
import {RiArrowRightSLine} from '@remixicon/react';
import * as Textarea from '@/components/align-ui/ui/textarea';
import {useSessionStore} from '@/providers/session-store-provider';
import { Me } from '@/app/settings/page';

interface ProfileFieldProps {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}

const ProfileField = ({
  label,
  value,
  description,
  onChange
}: ProfileFieldProps) => (
  <div className="p-6 border-b border-stroke-soft-200">
    <div className="flex justify-between items-start">
      <div className="w-[300px] space-y-1">
        <h3 className="text-paragraph-md text-text-strong-950">{label}</h3>
        <p className="text-paragraph-sm text-text-sub-600">{description}</p>
      </div>
      <div className="w-fill min-w-[300px]">
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
            />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  </div>
);

export default function Profile({me}: {me: Me}) {
  const user = me
  
  return (
    <div className="space-y-8">
      <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="w-[400px] space-y-1">
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
                  src={user?.image || ''}
                  alt="Foto do perfil"
                />
              </Avatar.Root>
              <Button.Root variant="neutral" mode="ghost">
                <span className="text-paragraph-md text-text-sub-600">
                  Carregar imagem
                </span>
                <RiArrowRightSLine className="size-5" />
              </Button.Root>
            </div>
          </div>
        </div>

        <div className="">
          <ProfileField
            label="Nome do usuário"
            value={user?.name || ''}
            description="Aparece na URL. Escolha algo simples e único."
            onChange={() => {}}
          />

          <ProfileField
            label="Nome completo"
            value={user?.name || ''}
            description="Seu nome completo."
            onChange={() => {}}
          />

          <ProfileField
            label="E-mail"
            value={user?.email || ''}
            description="Seu endereço de e-mail principal."
            onChange={() => {}}
          />

          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="w-[400px] space-y-1">
                <h3 className="text-paragraph-md text-text-strong-950">
                  Biografia
                </h3>
                <p className="text-paragraph-sm text-text-sub-600">
                  Um breve resumo sobre você.
                </p>
              </div>
              <div className="w-[400px]">
                <Textarea.Root placeholder="Meu nome é Marcus Dutra, sou engenheiro de software e adoro criar soluções inovadoras.">
                  <Textarea.CharCounter current={78} max={200} />
                </Textarea.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
