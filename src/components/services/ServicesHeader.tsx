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
import {useRouter} from 'next/navigation';
import {DatepickerRangeDemo} from '@/components/align-ui/daterange';
import * as Input from '@/components/align-ui/ui/input';
import CreateServiceModal from '@/components/services/CreateServiceModal';
import {useServices} from '@/contexts/services/ServicesContext';
import {useSessionStore} from '@/providers/session-store-provider';
import {MARKADO_URL} from '@/constants';
import Link from 'next/link';

type HeaderVariant = 'services';
type TSelectedMenuItem = {
  value: string;
  label: string;
  iconLine: React.ElementType;
  iconFill: React.ElementType;
};

type HeaderProps = {
  variant?: HeaderVariant;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selectedMenuItem?: TSelectedMenuItem;
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

const getHeaderContent = (selectedMenuItem?: TSelectedMenuItem) => {
  const {notification} = useNotification();
  const username = useSessionStore((store) => store.user?.username);

  const {
    state: {setIsCreateServiceModalOpen}
  } = useServices();

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

  const getServiceListSchedulingLink = () => {
    if (!username || username.length < 1) {
      return '';
    }

    return `${MARKADO_URL}/${username}`;
  };

  return {
    icon: <RiLinksLine className="text-bg-strong-950" />,
    title: 'Serviços',
    description: 'Crie serviços para os clientes agendarem',
    buttons: (
      <div className="services flex md:gap-2 w-full md:w-fit justify-between md:justify-normal">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Link href={getServiceListSchedulingLink()} target="_blank">
              <Button.Root
                variant="neutral"
                mode="stroke"
                // onClick={async () => {
                //   const schedulingLink = getServiceListSchedulingLink();

                //   await navigator.clipboard.writeText(schedulingLink);

                //   notification({
                //     title: 'Link da pagina de serviços copiado!',
                //     description:
                //       'Seu link da pagina de serviços foi copiado com sucesso.',
                //     variant: 'stroke',
                //     status: 'success'
                //   });
                // }}
              >
                <Button.Icon as={RiLinksLine} />
                Páginas de Serviços
              </Button.Root>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content size="small">
            Ir para página de serviços
          </Tooltip.Content>
        </Tooltip.Root>

        <FancyButton.Root
          variant="neutral"
          onClick={() => setIsCreateServiceModalOpen(true)}
        >
          <FancyButton.Icon as={RiAddLine} />
          Criar Serviço
        </FancyButton.Root>
      </div>
    )
  };
};

function ServicesHeader({title, selectedMenuItem}: HeaderProps) {
  const {notification} = useNotification();

  const {
    icon: headerIcon,
    title: variantTitle,
    description,
    buttons
  } = getHeaderContent(selectedMenuItem);

  return (
    <>
      <div className="w-full md:px-8 px-4 md:py-5 pt-5 relative inline-flex justify-start items-center gap-3 overflow-hidden">
        <div className="flex-1 md:flex hidden justify-center items-start gap-3.5">
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
        <div className="flex md:justify-end justify-between items-center gap-3 w-full md:w-fit">{buttons}</div>
      </div>
      <CreateServiceModal />
    </>
  );
}

export default ServicesHeader;
