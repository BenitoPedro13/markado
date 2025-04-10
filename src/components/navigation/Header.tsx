'use client';

import {
  RiLinksLine,
  RiAddLine,
  RiCalendarLine,
  RiTimeLine,
  RiDashboard3Line,
  RiArrowLeftSLine,
  RiDeleteBinLine,
  RiPencilFill,
  RiBnbFill
} from '@remixicon/react';
import React, {useState} from 'react';
import * as Button from '@/components/align-ui/ui/button';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import * as Switch from '@/components/align-ui/ui/switch';
import {RiSunLine, RiMoonLine, RiEqualizer3Fill, RiCheckboxCircleFill} from '@remixicon/react';
import * as CompactButton from '@/components/align-ui/ui/compact-button';
import * as Modal from '@/components/align-ui/ui/modal';
type HeaderVariant = 'scheduling' | 'availability' | 'services' | 'reports';
type HeaderMode = 'default' | 'inside';

type HeaderProps = {
  variant?: HeaderVariant;
  mode?: HeaderMode;
  title?: string; // Título personalizado para modo inside
  subtitle?: string; // Subtítulo opcional para modo inside (ex: "seg. - sex., 9:00 até 17:00")
};

function Header({
  variant = 'scheduling',
  mode = 'default',
  title,
  subtitle
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  if (mode === 'inside') {
    return (
      <div className="w-full h-[88px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <Button.Root variant="neutral" mode="stroke" size="small">
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
            Definir padrão
            <Switch.Root />
          </div>
          <div className="flex gap-2">
            {variant === 'availability' && <></>}
            {variant === 'services' && (
              <>
                <Button.Root variant="neutral" mode="stroke" size="small">
                  <Button.Icon as={RiEqualizer3Fill} />
                </Button.Root>
              </>
            )}
            <Modal.Root open={open} onOpenChange={setOpen}>
              <Modal.Trigger asChild>
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  onClick={() => setOpen(true)}
                >
                  <RiDeleteBinLine />
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
                  <Button.Root variant='error'  size="small" className="w-full">
                    Apagar
                  </Button.Root>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </div>
          <FancyButton.Root variant="primary">Salvar</FancyButton.Root>
        </div>
      </div>
    );
  }

  const getHeaderContent = () => {
    switch (variant) {
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
            'Crie serviços para que as pessoas possam fazer agendamentos em seu calendário.',
          buttons: (
            <div className="services">
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
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiDashboard3Line} />
                Relatórios
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Gerar Relatório
              </FancyButton.Root>
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

  const {icon, title: variantTitle, description, buttons} = getHeaderContent();

  return (
    <div className="w-full px-8 py-5 relative bg-bg-white-0 inline-flex justify-start items-center gap-3 overflow-hidden">
      <div className="flex-1 flex justify-center items-start gap-3.5">
        <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
          {icon}
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
