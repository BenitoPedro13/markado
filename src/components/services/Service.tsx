'use client';

import React, {useState, useEffect} from 'react';
import * as Badge from '@/components/align-ui/ui/badge';
import {
  RiTimeLine,
  RiDeleteBinLine,
  RiMore2Fill,
  RiPencilLine,
  RiFileCopyLine,
  RiLinksLine
} from '@remixicon/react';

import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import {useServices} from '@/contexts/services/ServicesContext';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useNotification} from '@/hooks/use-notification';
import {useLocale} from '@/hooks/use-locale';
import {
  duplicateHandler,
  submitDeleteService
} from '~/trpc/server/handlers/services.handler';

import {ServiceBadgeColor} from '~/prisma/enums';
import {TInitialServices} from '@/app/services/page';
import {MARKADO_URL} from '@/constants';
import {UserProfile} from '@/types/UserProfile';

export type ServicesProps = {
  id: number;
  title: string;
  slug: string;
  duration: number;
  price: number;
  status: 'active' | 'disabled';
  description?: string;
  location?: string;
  badgeColor: ServiceBadgeColor;
  // username: string;
};

function Service({
  id,
  title,
  slug,
  duration,
  price,
  status,
  badgeColor
  // username
}: ServicesProps) {
  const {notification} = useNotification();
  // const {updateServiceStatus} = useServices();
  const [isEnabled, setIsEnabled] = useState(status === 'active');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const {
    state: {initialMe}
  } = useServices();

  const {t} = useLocale('Services');

  useEffect(() => {
    setIsEnabled(status === 'active');
  }, [status]);

  // const handleSwitchChange = () => {
  //   const newStatus = !isEnabled ? 'active' : 'disabled';
  //   setIsEnabled(!isEnabled);
  //   updateServiceStatus(slug, newStatus);
  // };

  // const handleDeleteService = () => {
  //   // Implementar a lógica de exclusão aqui
  //   console.log('Deletando serviço:', slug);
  //   setIsDeleteModalOpen(false);
  // };

  // Mapeia as cores do tema para as cores aceitas pelo Badge
  const getBadgeColor = () => {
    const colorMap = {
      faded: 'gray',
      information: 'blue',
      warning: 'yellow',
      error: 'red',
      success: 'green',
      away: 'orange',
      feature: 'purple',
      verified: 'sky',
      highlighted: 'pink',
      stable: 'teal'
    } as const;

    return colorMap[badgeColor];
  };

  const getHostServiceSchedulingLink = () => {
    if (!initialMe) {
      return '';
    }

    return `${MARKADO_URL}/${initialMe.username}/${slug}`;
  };

  return (
    <>
      <div className="p-4 flex hover:bg-bg-weak-50 transition-colors duration-200">
        {/* Leading */}
        <Link href={`services/${slug}`} className="w-full cursor-pointer">
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2  items-center">
              <span className="text-paragraph-lg text-text-strong-950">
                {title}
              </span>
              <span className="text-paragraph-sm text-text-sub-600">
                /{slug}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Badge.Root variant="light" color={getBadgeColor()} size="medium">
                <Badge.Icon as={RiTimeLine} />
                {duration > 60
                  ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                  : `${duration}m`}
              </Badge.Root>
              <span className="text-paragraph-md text-text-strong-950">
                R$ {price}
              </span>
            </div>
          </div>
        </Link>

        {/* Trailing */}
        <div
          className="flex gap-2 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch.Root
            checked={isEnabled}
            // onCheckedChange={handleSwitchChange}
          />
          <ButtonGroup.Root>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <ButtonGroup.Item
                  onClick={async () => {
                    const schedulingLink = getHostServiceSchedulingLink();

                    await navigator.clipboard.writeText(schedulingLink);

                    notification({
                      title: 'Link do serviço copiado!',
                      description:
                        'Seu link de agendamento do serviço foi copiado com sucesso.',
                      variant: 'stroke',
                      status: 'success'
                    });
                  }}
                >
                  <ButtonGroup.Icon as={RiLinksLine} />
                </ButtonGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content size="small">
                Copiar link do serviço
              </Tooltip.Content>
            </Tooltip.Root>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <ButtonGroup.Item>
                  <ButtonGroup.Icon as={RiMore2Fill} />
                </ButtonGroup.Item>
              </Dropdown.Trigger>
              <Dropdown.Content align="end" className="w-fit">
                <Dropdown.Item onClick={() => setIsDeleteModalOpen(true)}>
                  <Dropdown.ItemIcon as={RiDeleteBinLine} />
                  Excluir serviço
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    duplicateHandler({
                      id,
                      title: `${title} (Copy)`,
                      slug: `${slug}-copy`,
                      description: '',
                      length: duration
                    })
                  }
                >
                  <Dropdown.ItemIcon as={RiFileCopyLine} />
                  Duplicar serviço
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiPencilLine} />
                  Editar serviço
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </ButtonGroup.Root>
        </div>
      </div>

      <Modal.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Content className="max-w-[440px]">
          <form
            action={async (formData) => {
              try {
                await submitDeleteService(id);

                notification({
                  title: 'Alterações salvas!',
                  description: 'Seus updates foram salvos com sucesso.',
                  variant: 'stroke',
                  status: 'success'
                });

                setIsDeleteModalOpen(false);

                // router.push(`/availability`);
              } catch (error: any) {
                console.error('Error submitting service delete form:', error);
                notification({
                  title: t('service_deleted_error'),
                  description: error.message,
                  variant: 'stroke',
                  id: 'service_deleted_error',
                  status: 'error'
                });
              }
            }}
          >
            <Modal.Body className="flex items-start gap-4">
              <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                <RiDeleteBinLine className="text-error-base size-6" />
              </div>
              <div className="space-y-1">
                <div className="text-label-md text-text-strong-950">
                  Apagar {title}
                </div>
                <div className="text-paragraph-sm text-text-sub-600">
                  Você não poderá recuperar o serviço após apagá-lo.
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
              <Button.Root
                variant="error"
                size="small"
                className="w-full"
                // onClick={handleDeleteService}
              >
                Apagar
              </Button.Root>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default Service;
