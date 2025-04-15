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
import {useServices} from '@/contexts/ServicesContext';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

type ServiceProps = {
  title: string;
  slug: string;
  duration: number;
  price: number;
  status: 'active' | 'disabled';
};

function Service({title, slug, duration, price, status}: ServiceProps) {
  const {updateServiceStatus} = useServices();
  const [isEnabled, setIsEnabled] = useState(status === 'active');
  const router = useRouter();
  useEffect(() => {
    setIsEnabled(status === 'active');
  }, [status]);

  const handleSwitchChange = () => {
    const newStatus = !isEnabled ? 'active' : 'disabled';
    setIsEnabled(!isEnabled);
    updateServiceStatus(slug, newStatus);
  };
  return (
    <Link
      href={`services/${slug}`}
      className="w-full "
    >
      <div className="p-4 flex hover:bg-bg-weak-50 transition-colors duration-200">
        {/* Leading */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2  items-center">
            <span className="text-paragraph-lg text-text-strong-950">
              {title}
            </span>
            <span className="text-paragraph-sm text-text-sub-600">{slug}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Badge.Root variant="light" color="blue" size="medium">
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
                <Dropdown.Item>
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
    </Link>
  );
}

export default Service;
