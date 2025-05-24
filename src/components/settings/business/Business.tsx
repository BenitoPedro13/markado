import {Me} from '@/app/settings/page';
import * as Input from '@/components/align-ui/ui/input';
import {
  RiStoreLine,
  RiArrowRightSLine,
  RiGlobalLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiInstagramLine,
  RiFacebookLine,
  RiMoreLine
} from '@remixicon/react';
import * as Label from '@/components/align-ui/ui/label';
import * as Avatar from '@/components/align-ui/ui/avatar';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import {ServiceBadgeColor} from '@/types/service';
import * as Divider from '@/components/align-ui/ui/divider';
import ServicesSchedulingForm from '@/modules/scheduling/services/ServicesSchedulingForm';
import {BookingProvider} from '@/contexts/bookings/BookingContext';
import * as Textarea from '@/components/align-ui/ui/textarea';
import {useState, createContext, useContext} from 'react';

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

// Contexto para compartilhar o estado do negócio
export const BusinessContext = createContext<{
  businessName: string;
  setBusinessName: (name: string) => void;
  businessColor: ServiceBadgeColor;
  setBusinessColor: (color: ServiceBadgeColor) => void;
  businessDescription: string;
  setBusinessDescription: (description: string) => void;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  setSocialLink: (
    platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'website',
    value: string
  ) => void;
}>({
  businessName: '',
  setBusinessName: () => {},
  businessColor: 'faded',
  setBusinessColor: () => {},
  businessDescription: '',
  setBusinessDescription: () => {},
  socialLinks: {},
  setSocialLink: () => {}
});

// Hook para usar o contexto
export const useBusiness = () => useContext(BusinessContext);

type Props = {
  me: Me;
};

export default function Business({me}: Props) {
  const [businessName, setBusinessName] = useState(me.name || '');
  const [businessColor, setBusinessColor] =
    useState<ServiceBadgeColor>('faded');
  const [businessDescription, setBusinessDescription] = useState(
    me.biography || ''
  );
  const [socialLinks, setSocialLinks] = useState<{
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  }>({});

  const setSocialLink = (
    platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'website',
    value: string
  ) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value || undefined
    }));
  };

  return (
    <BusinessContext.Provider
      value={{
        businessName,
        setBusinessName,
        businessColor,
        setBusinessColor,
        businessDescription,
        setBusinessDescription,
        socialLinks,
        setSocialLink
      }}
    >
      <div className="flex gap-8">
        {/* Dados do negócio */}

        <div className="min-w-[400px] flex flex-col gap-4">
          <div className="flex rounded-lg border border-stroke-soft-200 p-4 flex-col gap-4">
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
                <Input.Input
                  placeholder="Markado"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Input.Root>
            </div>
            <div className="flex flex-col gap-2">
              <Label.Root htmlFor="name">Foto de perfil</Label.Root>
              <div className="flex items-center gap-2">
                <Avatar.Root size="48">
                  <Avatar.Image src={me.image || ''} alt="Foto do perfil" />
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
              <Select.Root
                value={businessColor}
                onValueChange={(value) =>
                  setBusinessColor(value as ServiceBadgeColor)
                }
              >
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
              <Label.Root htmlFor="description">
                Descrição do negócio
              </Label.Root>
              <Textarea.Root
                placeholder="Descrição do negócio"
                containerClassName="min-h-[88px] w-full rounded-xl shadow-regular-xs bg-bg-white-0 border-bg-soft-200"
                maxLength={200}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              >
                <Textarea.CharCounter
                  current={businessDescription.length}
                  max={200}
                />
              </Textarea.Root>
            </div>
          </div>
          {/** Redes sociais */}
          <div className="flex rounded-lg border border-stroke-soft-200 p-4 flex-col gap-4">
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
                    <Input.Input
                      placeholder="https://instagram.com/username"
                      value={socialLinks.instagram || ''}
                      onChange={(e) =>
                        setSocialLink('instagram', e.target.value)
                      }
                    />
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
                    <Input.Input
                      placeholder="https://twitter.com/username"
                      value={socialLinks.twitter || ''}
                      onChange={(e) => setSocialLink('twitter', e.target.value)}
                    />
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
                    <Input.Input
                      placeholder="https://linkedin.com/username"
                      value={socialLinks.linkedin || ''}
                      onChange={(e) =>
                        setSocialLink('linkedin', e.target.value)
                      }
                    />
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
                    <Input.Input
                      placeholder="https://facebook.com/username"
                      value={socialLinks.facebook || ''}
                      onChange={(e) =>
                        setSocialLink('facebook', e.target.value)
                      }
                    />
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
                    <Input.Input
                      placeholder="https://meuwebsite.com/"
                      value={socialLinks.website || ''}
                      onChange={(e) => setSocialLink('website', e.target.value)}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>
          </div>
        </div>

        {/* Preview da página do negócio */}
        <div className="w-full max-h-[400px] sticky top-[32px]">
          <div className=" bg-bg-weak-50 rounded-lg border border-stroke-soft-200 overflow-hidden">
            <div className="border-b border-stroke-soft-200 w-full justify-between flex items-center p-4 bg-bg-white-0">
              <div className="flex items-center gap-2">
                <div className="w-[12px] h-[12px] bg-error-base rounded-full" />
                <div className="w-[12px] h-[12px] bg-warning-base rounded-full" />
                <div className="w-[12px] h-[12px] bg-success-base rounded-full" />
              </div>
              <div className="flex items-center gap-1">
                <RiMoreLine className="text-bg-sub-300" />
              </div>
            </div>
            <BookingProvider username={me.username || ''}>
              <ServicesSchedulingForm fullHeight={false} />
            </BookingProvider>
          </div>
        </div>
      </div>
    </BusinessContext.Provider>
  );
}
