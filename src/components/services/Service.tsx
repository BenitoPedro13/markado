'use client';

import React, {useState, useEffect} from 'react';
import * as Badge from '@/components/align-ui/ui/badge';
import {
  RiCodeLine,
  RiFileCopyFill,
  RiFlashlightFill,
  RiShare2Line,
  RiTimeLine,
  RiDeleteBinLine,
  RiMore2Fill,
  RiPencilLine
} from '@remixicon/react';

import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import {useServices} from '@/contexts/ServicesContext';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import { ServicesProps } from '@/data/services';

type ServiceProps = Pick<ServicesProps, 'title' | 'slug' | 'duration' | 'price' | 'status' | 'badgeColor'>;

function Service({title, slug, duration, price, status, badgeColor}: ServiceProps) {
  const {updateServiceStatus, deleteService} = useServices();
  const [isEnabled, setIsEnabled] = useState(status === 'active');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsEnabled(status === 'active');
  }, [status]);

  const handleSwitchChange = () => {
    const newStatus = !isEnabled ? 'active' : 'disabled';
    setIsEnabled(!isEnabled);
    updateServiceStatus(slug, newStatus);
  };

  const handleDeleteService = () => {
    deleteService(slug);
    setIsDeleteModalOpen(false);
  };

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

  return (
    <>
      <div className="p-4 flex hover:bg-bg-weak-50 transition-colors duration-200">
        {/* Leading */}
        <Link
          href={`services/${slug}`}
          className="w-full"
        >
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2  items-center">
              <span className="text-paragraph-lg text-text-strong-950">
                {title}
              </span>
              <span className="text-paragraph-sm text-text-sub-600">{slug}</span>
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
        <div className="flex gap-2 items-center">
          <Switch.Root
            checked={isEnabled}
            onCheckedChange={handleSwitchChange}
          />
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
              onClick={handleDeleteService}
            >
              Apagar
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default Service;
