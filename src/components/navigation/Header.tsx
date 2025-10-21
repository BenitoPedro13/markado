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
import { useTranslations } from 'next-intl';
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
import { useAvailability } from '@/contexts/availability/AvailabilityContext';
import { useSessionStore } from '@/providers/session-store-provider';
import Link from 'next/link';
// import CreateServiceModal from '@/components/services/CreateServiceModal';

type HeaderVariant =
  | 'scheduling'
  | 'availability'
  | 'services'
  | 'reports'
  | 'settings';
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
  const t = useTranslations('Header');
  const {notification} = useNotification();
  const { isCreateModalOpen, setIsCreateModalOpen } = usePageContext();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // const {queries: {availability}, availabilityDetailsForm} = useAvailability();
  const [editedTitle, setEditedTitle] = useState(title  || '');
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const router = useRouter();
  const username = useSessionStore((store) => store.user?.username);

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
          title: t('settings'),
          description: t('settings_description'),
          buttons: (
            <div className="settings">
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiSaveFill} />
                {t('save')}
              </FancyButton.Root>
            </div>
          )
        };
      case 'scheduling':
        return {
          icon: <RiCalendarLine className="text-bg-strong-950" />,
          title: t('scheduling'),
          description: t('scheduling_description'),
          buttons: (
             <div className="scheduling">
               <Link href={`/${username || ''}`} target="_blank">
                 <FancyButton.Root variant="neutral">
                   <FancyButton.Icon as={RiAddLine} />
                   {t('new_booking')}
                 </FancyButton.Root>
               </Link>
             </div>
           )
        };
      case 'availability':
        return {
          icon: <RiTimeLine className="text-bg-strong-950" />,
          title: t('availability'),
          description: t('availability_description'),
          buttons: (
            <div className="flex justify-start items-center gap-3 availability">
              <FancyButton.Root variant="neutral" onClick={() => setIsCreateModalOpen(true)}  >
                <FancyButton.Icon as={RiAddLine} />
                {t('create_availability')}
              </FancyButton.Root>
            </div>
          )
        };
      case 'services':
        return {
          icon: <RiLinksLine className="text-bg-strong-950" />,
          title: t('services'),
          description: t('services_description'),
          buttons: (
            <div className="services flex gap-2">
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiLinksLine} />
                {t('service_pages')}
              </Button.Root>
              <FancyButton.Root variant="neutral">
                <FancyButton.Icon as={RiAddLine} />
                {t('create_service')}
              </FancyButton.Root>
            </div>
          )
        };
      case 'reports':
        return {
          icon: <RiDashboard3Line className="text-bg-strong-950" />,
          title: t('reports'),
          description: t('reports_description'),
          buttons: (
            <div className="reports">
              <DatepickerRangeDemo />
            </div>
          )
        };
      default:
        return {
          icon: <RiCalendarLine className="text-bg-strong-950" />,
          title: t('scheduling'),
          description: t('scheduling_description'),
          buttons: (
            <div className="scheduling">
              <Button.Root variant="neutral" mode="stroke">
                <Button.Icon as={RiCalendarLine} />
                {t('calendar')}
              </Button.Root>
              <Link href={`/${username || ''}`} target="_blank">
                  <FancyButton.Root variant="neutral">
                    <FancyButton.Icon as={RiAddLine} />
                    {t('new_booking')}
                  </FancyButton.Root>
              </Link>
            </div>
          )
        };
    }
  };

  const getDescriptionForMenuItem = (value: string) => {
    switch (value) {
      case 'profile':
        return t('profile');
      case 'business':
        return t('business');
      case 'general':
        return t('general');
      case 'calendars':
        return t('calendars');
      case 'conference':
        return t('conference');
      case 'privacy':
        return t('privacy');
      case 'subscription':
        return t('subscription');
      case 'payment':
        return t('payment');
      default:
        return t('default_settings');
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
              {t('save')}
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
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="small"
            onClick={() => router.back()}
          >
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
                            title: t('title_updated'),
                            description: t('title_updated_description'),
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
                              title: t('title_updated'),
                              description: t('title_updated_description'),
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
              </div> : t('service_configuration')}
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
            {variant === 'availability' && t('set_as_default')}
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
                      {t('share_service')}
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <ButtonGroup.Item>
                        <ButtonGroup.Icon as={RiFileCopyFill} />
                      </ButtonGroup.Item>
                    </Tooltip.Trigger>
                    <Tooltip.Content size="small">
                      {t('copy_service_link')}
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <ButtonGroup.Item>
                        <ButtonGroup.Icon as={RiCodeLine} />
                      </ButtonGroup.Item>
                    </Tooltip.Trigger>
                    <Tooltip.Content size="small">{t('create_embed')}</Tooltip.Content>
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
                  {t('delete')}
                </Button.Root>
              </Modal.Trigger>
              <Modal.Content className="max-w-[440px]">
                <Modal.Body className="flex items-start gap-4">
                  <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                    <RiDeleteBinLine className="text-error-base size-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-md text-text-strong-950">
                      {t('delete_title', { title: title || '' })}
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600">
                      {t('delete_description')}
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
                      {t('cancel')}
                    </Button.Root>
                  </Modal.Close>
                  <Button.Root variant="error" size="small" className="w-full">
                    {t('delete')}
                  </Button.Root>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </div>
          <FancyButton.Root
            variant="neutral"
            size="small"
            onClick={() => {
              if ((window as any).submitServiceForm) {
                (window as any).submitServiceForm();
              }
              notification({
                title: t('changes_saved'),
                description: t('changes_saved_description'),
                variant: 'stroke',
                status: 'success'
              });
            }}
          >
            <FancyButton.Icon as={RiSaveFill} />
            {t('save')}
          </FancyButton.Root>
        </div>
      </div>
    );
  }

  const {icon: headerIcon, title: variantTitle, description, buttons} = getHeaderContent();

  return (
    <>
      <div className="w-full md:px-8 px-4 md:py-5 pt-5 pb-0 relative inline-flex justify-start items-center gap-3 overflow-hidden">
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
        <div className="w-full md:w-fit flex md:justify-start justify-end items-center gap-3">{buttons}</div>
      </div>
      {/* <CreateServiceModal 
        open={isCreateServiceModalOpen} 
        onOpenChange={setIsCreateServiceModalOpen} 
      /> */}
    </>
  );
}

export default Header;
