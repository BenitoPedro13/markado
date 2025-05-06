'use client';

import React from 'react';
import * as Badge from '@/components/align-ui/ui/badge';
import {
  RiTimeLine,
  RiMore2Fill,
  RiDeleteBinLine,
  RiPencilLine,
  RiGlobalLine
} from '@remixicon/react';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import Link from 'next/link';

type AvailabilityProps = {
  title: string;
  schedule: string;
  timezone: string | null;
  isDefault?: boolean;
};

export default function Availability({
  title,
  schedule,
  timezone,
  isDefault = false
}: AvailabilityProps) {
  return (
    <Link href={`availability/${title.toLowerCase()}`} className="w-full">
      <div className="p-4 flex hover:bg-bg-weak-50 transition-colors duration-200">
        {/* Leading */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-paragraph-lg text-text-strong-950">
              {title}
            </span>
            {isDefault && (
              <Badge.Root variant="light" color="green" size="small">
                Padrão
              </Badge.Root>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <Badge.Root variant="light" color="blue" size="medium">
              <Badge.Icon as={RiTimeLine} />
              {schedule}
            </Badge.Root>
            {timezone && (
              <Badge.Root variant="light" color="gray" size="medium">
                <Badge.Icon as={RiGlobalLine} />
                {timezone}
              </Badge.Root>
            )}
          </div>
        </div>

        {/* Trailing */}
        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
          <ButtonGroup.Root>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <ButtonGroup.Item>
                  <ButtonGroup.Icon as={RiMore2Fill} />
                </ButtonGroup.Item>
              </Dropdown.Trigger>
              <Dropdown.Content align="end" className="w-fit">
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiDeleteBinLine} />
                  Excluir disponibilidade
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiPencilLine} />
                  Editar disponibilidade
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </ButtonGroup.Root>
        </div>
      </div>
    </Link>
  );
} 