"use client"

import { RiLinksLine, RiAddLine, RiCalendarLine, RiTimeLine, RiDashboard3Line } from '@remixicon/react'
import React from 'react'
import * as Button from '@/components/align-ui/ui/button'
import * as FancyButton from '@/components/align-ui/ui/fancy-button'

type HeaderVariant = 'scheduling' | 'availability' | 'services' | 'reports';

type HeaderProps = {
  variant?: HeaderVariant;
};

function Header({ variant = 'scheduling' }: HeaderProps) {
  const getHeaderContent = () => {
    switch (variant) {
      case 'scheduling':
        return {
          icon: <RiCalendarLine className="text-bg-strong-950" />,
          title: 'Agendamentos',
          description: 'Visualize e gerencie todos os agendamentos do seu calendário.',
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
      case 'availability':
        return {
          icon: <RiTimeLine className="text-bg-strong-950" />,
          title: 'Disponibilidade',
          description: 'Configure seus horários disponíveis para agendamentos.',
          buttons: (
            <div className="availability">
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiTimeLine} />
                Horários
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                Definir Disponibilidade
              </FancyButton.Root>
            </div>
          )
        };
      case 'services':
        return {
          icon: <RiLinksLine className="text-bg-strong-950" />,
          title: 'Serviços',
          description: 'Crie serviços para que as pessoas possam fazer agendamentos em seu calendário.',
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
          description: 'Visualize estatísticas e relatórios sobre seus agendamentos.',
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
          description: 'Visualize e gerencie todos os agendamentos do seu calendário.',
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

  const { icon, title, description, buttons } = getHeaderContent();

  return (
    <div className="w-[1168px] px-8 py-5 relative bg-bg-white-0 inline-flex justify-start items-center gap-3 overflow-hidden">
      <div className="flex-1 flex justify-center items-start gap-3.5">
        <div className="p-3 bg-bg-white-0 rounded-[999px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-stroke-soft-200 flex justify-center items-center overflow-hidden">
          {icon}
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-start text-text-strong-950 text-lg font-medium font-sans leading-normal">{title}</div>
          <div className="self-stretch justify-start text-text-sub-600 text-sm font-normal font-sans leading-tight">{description}</div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-3">
        {buttons}
      </div>
      <div className="w-[1104px] h-0 left-[32px] top-[88px] absolute outline outline-1 outline-offset-[-0.50px] outline-stroke-soft-200"></div>
    </div>
  )
}

export default Header