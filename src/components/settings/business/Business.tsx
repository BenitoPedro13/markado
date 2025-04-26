import {Me} from '@/app/settings/page';
import * as Input from '@/components/align-ui/ui/input';
import {RiStoreLine, RiArrowRightSLine, RiGlobalLine, RiLinkedinLine, RiTwitterXLine, RiInstagramLine, RiFacebookLine} from '@remixicon/react';
import * as Label from '@/components/align-ui/ui/label';
import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import {ServiceBadgeColor} from '@/types/service';
import * as Divider from '@/components/align-ui/ui/divider';
import ServicesSchedulingForm from '@/modules/scheduling/services/ServicesSchedulingForm';
import { SchedulingProvider } from '@/contexts/SchedulingContext';
import * as Textarea from '@/components/align-ui/ui/textarea';
// Array com as opções de cores e seus emojis
const colorOptions: {value: ServiceBadgeColor; label: string}[] = [
  {value: 'faded', label: 'Cinza ⚫️'},
  {value: 'information', label: 'Azul 🔵'},
  {value: 'warning', label: 'Amarelo 🟡'},
  {value: 'error', label: 'Vermelho 🔴'},
  {value: 'success', label: 'Verde 🟢'},
  {value: 'away', label: 'Laranja 🟧'},
  {value: 'feature', label: 'Roxo 🟣'},
  {value: 'verified', label: 'Azul Céu 🔷'},
  {value: 'highlighted', label: 'Rosa 🎀'},
  {value: 'stable', label: 'Verde Água 🌊'}
];

type Props = {
  me: Me;
};

export default function Business({me}: Props) {
  return (
    <div className="flex gap-8">
      {/* Dados do negócio */}

      <div className="min-w-[400px] flex rounded-lg border border-stroke-soft-200 p-4 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-label-lg text-text-strong-950">
            Infomações gerais
          </p>
          <p className="text-paragraph-sm text-text-sub-600">
            Coloque o link das suas redes
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="name">Nome do negócio</Label.Root>
          <Input.Root>
            <Input.Input placeholder="Markado" />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="name">Foto de perfil</Label.Root>
          <div className="flex items-center gap-2">
            <Avatar.Root size="48">
              <Avatar.Image
                src={'/images/logo.png'}
                alt="Foto do perfil"
              />
            </Avatar.Root>
            <Button.Root variant="neutral" mode="stroke">
              <span className="text-paragraph-md text-text-sub-600">
                Carregar imagem
              </span>
              <RiArrowRightSLine className="size-5" />
            </Button.Root>
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="color">Cor do negócio</Label.Root>
          <Select.Root>
            <Select.Trigger className="w-full">
              <Select.Value placeholder="Selecione uma cor" />
            </Select.Trigger>
            <Select.Content>
              {colorOptions.map((color) => (
                <Select.Item key={color.value} value={color.value}>
                  {color.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <span className="text-paragraph-xs text-text-sub-600">
            Esta cor será usada para identificar visualmente seu negócio
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="description">Descrição do negócio</Label.Root>
          <Textarea.Root
            placeholder="Descrição do negócio"
            containerClassName="min-h-[88px] w-full rounded-xl shadow-regular-xs bg-bg-white-0 border-bg-soft-200"
            maxLength={200}
          >
            <Textarea.CharCounter current={200} max={200} />
          </Textarea.Root>
        </div>
        <Divider.Root />

        <div className="flex flex-col gap-2">
          <p className="text-label-lg text-text-strong-950">
            Redes sociais
          </p>
          <p className="text-paragraph-sm text-text-sub-600">
            Coloque o link das suas redes
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label.Root htmlFor="instagram">Instagram</Label.Root>
            <Input.Root>
            <Input.Wrapper>
              <Input.Icon>
                <RiInstagramLine />
              </Input.Icon>
              <Input.Input placeholder="https://instagram.com/username" />
            </Input.Wrapper>
          </Input.Root>
        </div>
          <div className="flex flex-col gap-2">
            <Label.Root htmlFor="twitter">Twitter</Label.Root>
            <Input.Root>
            <Input.Wrapper>
              <Input.Icon>
                <RiTwitterXLine />
              </Input.Icon>
              <Input.Input placeholder="https://twitter.com/username" />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="linkedin">LinkedIn</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon>
                <RiLinkedinLine />
              </Input.Icon>
              <Input.Input placeholder="https://linkedin.com/username" />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="facebook">Facebook</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon>
                <RiFacebookLine />
              </Input.Icon>
              <Input.Input placeholder="https://facebook.com/username" />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="website">Website</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon>
                <RiGlobalLine />
              </Input.Icon>
              <Input.Input placeholder="https://meuwebsite.com/" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      </div>

      {/* Preview da página do negócio */}
      <div className="w-full">
        

        <div className="bg-bg-weak-50 h-fit rounded-lg border border-stroke-soft-200 overflow-hidden">
          <div className="bg-bg-white-0"></div>
          <SchedulingProvider username={me.username || ''}>
            <ServicesSchedulingForm />
          </SchedulingProvider>
        </div>
      </div>
    </div>
  );
}
