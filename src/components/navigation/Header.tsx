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
  RiFileCopyFill,
  RiCodeLine, 
  RiSaveFill,
  RiPencilLine,
  RiSettings4Line,

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
import * as Input from '@/components/align-ui/ui/input';
import { usePageContext } from '@/contexts/PageContext';
import { useAvailability } from '@/contexts/AvailabilityContext';
import CreateServiceModal from '@/components/services/CreateServiceModal';

type HeaderVariant = 'scheduling' | 'availability' | 'services' | 'reports' | 'settings';
type HeaderMode = 'default' | 'inside';

type HeaderProps = {
  variant?: HeaderVariant;
  mode?: HeaderMode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selectedMenuItem?: {
    value: string;
    label: string;
    iconLine: React.ElementType;
    iconFill: React.ElementType;
  };
};

function Header({
  variant = 'scheduling',
  mode = 'default',
  title,
  subtitle,
  icon,
  selectedMenuItem
}: HeaderProps) {
  const {notification} = useNotification();
  const { isCreateModalOpen, setIsCreateModalOpen } = usePageContext();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // const {queries: {availability}, availabilityDetailsForm} = useAvailability();
  const [editedTitle, setEditedTitle] = useState(title  || '');
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const router = useRouter();

  const getHeaderContent = () => {
    if (selectedMenuItem) {
      const IconLine = selectedMenuItem.iconLine;
      const IconFill = selectedMenuItem.iconFill;
      return {
        icon: <IconFill className="text-bg-strong-950" />,
        title: selectedMenuItem.label,
        description: getDescriptionForMenuItem(selectedMenuItem.value),
        buttons: getButtonsForMenuItem(selectedMenuItem.value)
      };
    }

    switch (variant) {
      case 'settings':
        return {
          icon: icon || <RiSettings4Line className="text-bg-strong-950" />,
          title: 'Configurações',
          description: 'Gerencie as configurações do seu projeto.',
          buttons: (
            <div className="settings">
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiSaveFill} />
                Salvar
              </FancyButton.Root>
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
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Novo Agendamento
              </FancyButton.Root>
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
              <FancyButton.Root variant="neutral" onClick={() => setIsCreateModalOpen(true)}  >
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

  const getDescriptionForMenuItem = (value: string) => {
    switch (value) {
      case 'profile':
        return 'Gerencie suas informações pessoais e preferências.';
      case 'business':
        return 'Configure as informações da sua página de negócio.';
      case 'general':
        return 'Ajuste as configurações gerais do seu projeto.';
      case 'calendars':
        return 'Gerencie seus calendários e integrações.';
      case 'conference':
        return 'Configure suas opções de videoconferência.';
      case 'privacy':
        return 'Gerencie suas configurações de privacidade e segurança.';
      case 'subscription':
        return 'Visualize e gerencie sua assinatura.';
      case 'payment':
        return 'Configure seus métodos de pagamento.';
      default:
        return 'Gerencie suas configurações.';
    }
  };

  const getButtonsForMenuItem = (value: string) => {
    switch (value) {
      case 'profile':
      case 'business':
      case 'general':
      case 'calendars':
      case 'conference':
      case 'privacy':
      case 'subscription':
      case 'payment':
        return (
          <div className="settings">
            <FancyButton.Root variant="neutral">
              <FancyButton.Icon as={RiSaveFill} />
              Salvar
            </FancyButton.Root>
          </div>
        );
      default:
        return null;
    }
  };

  if (mode === 'inside') {
    return (
      <div className="w-full h-[88px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <Button.Root variant="neutral" mode="stroke" size="small" onClick={() => router.back()}>
            <Button.Icon as={RiArrowLeftSLine} />
          </Button.Root>
          <div className="flex flex-col">
            <div className="text-text-strong-950 text-lg font-medium font-sans leading-normal">
              {title ? <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input.Root>
                    <Input.Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => {
                        setIsEditing(false);
                        if (editedTitle.trim() && editedTitle !== title) {
                          notification({
                            title: 'Título atualizado!',
                            description: 'O título foi atualizado com sucesso.',
                            variant: 'stroke',
                            status: 'success'
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditing(false);
                          if (editedTitle.trim() && editedTitle !== title) {
                            notification({
                              title: 'Título atualizado!',
                              description: 'O título foi atualizado com sucesso.',
                              variant: 'stroke',
                              status: 'success'
                            });
                          }
                        }
                      }}
                      autoFocus
                    />
                  </Input.Root>
                ) : (
                  <>
                    <span>{editedTitle}</span>
                    <Button.Root 
                      variant="neutral" 
                      mode="ghost" 
                      size="small"
                      onClick={() => setIsEditing(true)}
                    >
                      <Button.Icon as={RiPencilLine} />
                    </Button.Root>
                  </>
                )}
              </div> : 'Configuração do Serviço'}
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
            onClick={() => {
              if ((window as any).submitServiceForm) {
                (window as any).submitServiceForm();
              }
              notification({
                title: 'Alterações salvas!',
                description: 'Seus updates foram salvos com sucesso.',
                variant: 'stroke',
                status: 'success'
              });
            }}
          >
            <FancyButton.Icon as={RiSaveFill} />
            Salvar
          </FancyButton.Root>
        </div>
      </div>
    );
  }

  const {icon: headerIcon, title: variantTitle, description, buttons} = getHeaderContent();

  return (
    <>
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
      <CreateServiceModal 
        open={isCreateServiceModalOpen} 
        onOpenChange={setIsCreateServiceModalOpen} 
      />
    </>
  );
}

export default Header;
