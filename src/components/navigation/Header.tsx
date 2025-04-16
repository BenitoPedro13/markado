'use client';

import {
  RiLinksLine,
  RiAddLine,
  RiCalendarLine,
  RiTimeLine,
  RiDashboard3Line,
  RiArrowLeftSLine,
  RiDeleteBinLine,
  RiShare2Line,
  RiCopyleftFill,
  RiFileCopyFill,
  RiCodeLine,
  RiSaveLine,
  RiSaveFill,
  RiSettings4Line
} from '@remixicon/react';
import React, {useState} from 'react';
import * as Button from '@/components/align-ui/ui/button';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Modal from '@/components/align-ui/ui/modal';
import {useNotification} from '@/hooks/use-notification';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import { useRouter } from 'next/navigation';
import { DatepickerRangeDemo } from '@/components/align-ui/daterange';
type HeaderVariant = 'scheduling' | 'availability' | 'services' | 'reports' | 'settings';
type HeaderMode = 'default' | 'inside';

type HeaderProps = {
  variant?: HeaderVariant;
  mode?: HeaderMode;
  title?: string; // Título personalizado para modo inside
  subtitle?: string; // Subtítulo opcional para modo inside (ex: "seg. - sex., 9:00 até 17:00")
  icon?: React.ReactNode; // Ícone personalizado para a variante settings
};

type SingleDatepickerProps = {
    defaultValue?: Date;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
  };
   



function Header({
  variant = 'scheduling',
  mode = 'default',
  title,
  subtitle,
  icon
}: HeaderProps) {
  const {notification} = useNotification();
  const [open, setOpen] = useState(false);
  const router = useRouter();
    

  if (mode === 'inside') {
    return (
      <div className="w-full h-[88px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <Button.Root variant="neutral" mode="stroke" size="small" onClick={() => router.back()}>
            <Button.Icon as={RiArrowLeftSLine} />
          </Button.Root>
          <div className="flex flex-col">
            <div className="text-text-strong-950 text-lg font-medium font-sans leading-normal">
              {title || 'Configuração do Serviço'}
            </div>
            {subtitle && (
              <div className="text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-sub-600 text-paragraph-xs font-normal font-sans leading-tight w-fit">
            {variant === 'availability' && 'Definir padrão'}
            <Switch.Root />
          </div>
          <div className="flex items-center gap-2">
            {variant === 'availability' && <></>}
            {variant === 'services' && (
              <>
                <ButtonGroup.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <ButtonGroup.Item>
                        <ButtonGroup.Icon as={RiShare2Line} />
                      </ButtonGroup.Item>
                    </Tooltip.Trigger>
                    <Tooltip.Content size="small">
                      Compartilhar serviço
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <ButtonGroup.Item>
                        <ButtonGroup.Icon as={RiFileCopyFill} />
                      </ButtonGroup.Item>
                    </Tooltip.Trigger>
                    <Tooltip.Content size="small">
                      Copiar link do serviço
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <ButtonGroup.Item>
                        <ButtonGroup.Icon as={RiCodeLine} />
                      </ButtonGroup.Item>
                    </Tooltip.Trigger>
                    <Tooltip.Content size="small">
                      Criar embed
                    </Tooltip.Content>
                  </Tooltip.Root>

                  
                  
                </ButtonGroup.Root>
              </>
            )}
            <Modal.Root open={open} onOpenChange={setOpen}>
              <Modal.Trigger asChild>
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  onClick={() => setOpen(true)}
                >
                  <Button.Icon as={RiDeleteBinLine} />
                  Apagar
                </Button.Root>
              </Modal.Trigger>
              <Modal.Content className="max-w-[440px]">
                <Modal.Body className="flex items-start gap-4">
                  <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                    <RiDeleteBinLine className="text-error-base size-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-md text-text-strong-950">
                      Apagar {title}
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600">
                      Você não poderá recuperar a disponibilidade após apagá-lo.
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button.Root
                      variant="neutral"
                      mode="stroke"
                      size="small"
                      className="w-full"
                    >
                      Cancelar
                    </Button.Root>
                  </Modal.Close>
                  <Button.Root variant="error" size="small" className="w-full">
                    Apagar
                  </Button.Root>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </div>
          <FancyButton.Root
            variant="neutral"
            size='small'
            onClick={() =>
              notification({
                title: 'Alterações salvas!',
                description: 'Seus updates foram salvos com sucesso.',
                variant: 'stroke',
                status: 'success'
              })
            }
          >
            <FancyButton.Icon as={RiSaveFill} />
            Salvar
          </FancyButton.Root>
        </div>
      </div>
    );
  }

  const getHeaderContent = () => {
    switch (variant) {
      case 'settings':
        return {
          icon: icon || <RiSettings4Line className="text-bg-strong-950" />,
          title: 'Configurações',
          description: 'Gerencie as configurações do seu projeto.',
          buttons: (
            <div className="settings">
              
            </div>
          )
        };
      case 'scheduling':
        return {
          icon: <RiCalendarLine className="text-bg-strong-950" />,
          title: 'Agendamentos',
          description:
            'Visualize e gerencie todos os agendamentos do seu calendário.',
          buttons: (
            <div className="scheduling">
              {/* <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiCalendarLine} />
                Calendário
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Novo Agendamento
              </FancyButton.Root> */}
            </div>
          )
        };
      case 'availability':
        return {
          icon: <RiTimeLine className="text-bg-strong-950" />,
          title: 'Disponibilidade',
          description: 'Configure seus horários disponíveis para agendamentos.',
          buttons: (
            <div className="flex justify-start items-center gap-3 availability">
              {/* <SegmentedControl.Root defaultValue='system'>
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='light'>
            
            Todos
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='dark'>
            
            Meu
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='system'>
            
            Equipe
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root> */}
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Criar Disponibilidade
              </FancyButton.Root>
            </div>
          )
        };
      case 'services':
        return {
          icon: <RiLinksLine className="text-bg-strong-950" />,
          title: 'Serviços',
          description:
            'Crie serviços para os clientes agendarem',
          buttons: (
            <div className="services flex gap-2">
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiLinksLine} />
                Páginas de Serviços
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Criar Serviço
              </FancyButton.Root>
            </div>
          )
        };
      case 'reports':
        return {
          icon: <RiDashboard3Line className="text-bg-strong-950" />,
          title: 'Relatórios',
          description:
            'Visualize estatísticas e relatórios sobre seus agendamentos.',
          buttons: (
            <div className="reports">
              <DatepickerRangeDemo />
            </div>
          )
        };
      default:
        return {
          icon: <RiCalendarLine className="text-bg-strong-950" />,
          title: 'Agendamentos',
          description:
            'Visualize e gerencie todos os agendamentos do seu calendário.',
          buttons: (
            <div className="scheduling">
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiCalendarLine} />
                Calendário
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Novo Agendamento
              </FancyButton.Root>
            </div>
          )
        };
    }
  };

  const {icon: headerIcon, title: variantTitle, description, buttons} = getHeaderContent();

  return (
    <div className="w-full px-8 py-5 relative inline-flex justify-start items-center gap-3 overflow-hidden">
      <div className="flex-1 flex justify-center items-start gap-3.5">
        <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
          {headerIcon}
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-start text-text-strong-950 text-lg font-medium font-sans leading-normal">
            {variantTitle}
          </div>
          <div className="self-stretch justify-start text-text-sub-600 text-sm font-normal font-sans leading-tight">
            {description}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-3">{buttons}</div>
    </div>
  );
}

export default Header;
