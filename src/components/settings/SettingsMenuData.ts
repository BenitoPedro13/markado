import {
  RiArrowRightSLine,
  RiUser3Line,
  RiUser3Fill,
  RiGlobalLine,
  RiGlobalFill,
  RiCalendarLine,
  RiCalendarFill,
  RiVideoLine,
  RiVideoFill,
  RiLockLine,
  RiLockFill,
  RiVipCrownLine,
  RiVipCrownFill,
  RiWalletLine,
  RiWalletFill,
  RiStoreLine,
  RiStoreFill
} from '@remixicon/react';

export const settingsMenuItems = [
  {
    value: 'profile',
    label: 'Perfil',
    iconLine: RiUser3Line,
    iconFill: RiUser3Fill,
    route: '/settings/profile',
    description: 'Gerencie suas informações pessoais e preferências.'
  },
  {
    value: 'business',
    label: 'Página do Negócio',
    iconLine: RiStoreLine,
    iconFill: RiStoreFill,
    route: '/settings/business',
    description: 'Configure as informações da sua página de negócio.'
  },
  {
    value: 'general',
    label: 'Geral',
    iconLine: RiGlobalLine,
    iconFill: RiGlobalFill,
    route: '/settings/general',
    description: 'Ajuste as configurações gerais do seu projeto.'
  },
  {
    value: 'calendars',
    label: 'Calendários',
    iconLine: RiCalendarLine,
    iconFill: RiCalendarFill,
    route: '/settings/calendars',
    description: 'Gerencie seus calendários e integrações.'
  },
  {
    value: 'conference',
    label: 'Conferência',
    iconLine: RiVideoLine,
    iconFill: RiVideoFill,
    route: '/settings/conference',
    description: 'Configure suas opções de videoconferência.'
  },
  {
    value: 'privacy',
    label: 'Privacidade e segurança',
    iconLine: RiLockLine,
    iconFill: RiLockFill,
    route: '/settings/privacy',
    description: 'Gerencie suas configurações de privacidade e segurança.'
  },
  {
    value: 'subscription',
    label: 'Minha Assinatura',
    iconLine: RiVipCrownLine,
    iconFill: RiVipCrownFill,
    route: '/settings/subscription',
    description: 'Visualize e gerencie sua assinatura.'
  },
  {
    value: 'payment',
    label: 'Pagamento',
    iconLine: RiWalletLine,
    iconFill: RiWalletFill,
    route: '/settings/payment',
    description: 'Configure seus métodos de pagamento.'
  }
];
