'use client';

import React, {useState} from 'react';
import * as Badge from '@/components/align-ui/ui/badge';
import {
  RiTimeLine,
  RiMore2Fill,
  RiDeleteBinLine,
  RiPencilLine,
  RiGlobalLine,
  RiFileCopyLine
} from '@remixicon/react';
import * as ButtonGroup from '@/components/align-ui/ui/button-group';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import Link from 'next/link';
import {submitDeleteSchedule} from '~/trpc/server/handlers/schedule.handler';
import {useRouter} from 'next/navigation';
import {useNotification} from '@/hooks/use-notification';
import { useLocale } from '@/hooks/use-locale';

type AvailabilityProps = {
  id: number;
  title: string;
  schedule?: string;
  timezone?: string | null;
  isDefault?: boolean;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function Availability({
  id,
  title,
  schedule,
  timezone,
  isDefault = false,
  onDuplicate,
  onDelete
}: AvailabilityProps) {
  const {notification} = useNotification();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  const {t} = useLocale('Availability');

  const handleDelete = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Link href={`availability/${id}`} className="w-full">
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
              {schedule && (
                <Badge.Root variant="light" color="blue" size="medium">
                  <Badge.Icon as={RiTimeLine} />
                  {schedule}
                </Badge.Root>
              )}
              {timezone && (
                <Badge.Root variant="light" color="gray" size="medium">
                  <Badge.Icon as={RiGlobalLine} />
                  {timezone}
                </Badge.Root>
              )}
            </div>
          </div>

          {/* Trailing */}
          <div
            className="flex gap-2 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ButtonGroup.Root>
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <ButtonGroup.Item>
                    <ButtonGroup.Icon as={RiMore2Fill} />
                  </ButtonGroup.Item>
                </Dropdown.Trigger>
                <Dropdown.Content align="end" className="w-fit">
                  <Dropdown.Item onClick={() => setIsDeleteModalOpen(true)}>
                    <Dropdown.ItemIcon as={RiDeleteBinLine} />
                    Excluir disponibilidade
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown.ItemIcon as={RiPencilLine} />
                    Editar disponibilidade
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onDuplicate(id)}>
                    <Dropdown.ItemIcon as={RiFileCopyLine} />
                    Duplicar disponibilidade
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </ButtonGroup.Root>
          </div>
        </div>
      </Link>

      <Modal.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Content className="max-w-[440px]">
          <form
            action={async (formData) => {
              try {
                // console.log('availability.id', id);
                await submitDeleteSchedule(id);

                notification({
                  title: 'Alterações salvas!',
                  description: 'Seus updates foram salvos com sucesso.',
                  variant: 'stroke',
                  status: 'success'
                });

                // router.push(`/availability`);
              } catch (error: any) {
                console.error('Error submitting availability form:', error);
                notification({
                  title: t('schedule_updated_error'),
                  description: error.message,
                  variant: 'stroke',
                  id: 'schedule_updated_error',
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
                  Apagar "{title}"
                </div>
                <div className="text-paragraph-sm text-text-sub-600">
                  Você não poderá recuperar a disponibilidade após apagá-la.
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
                // onClick={handleDelete}
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
