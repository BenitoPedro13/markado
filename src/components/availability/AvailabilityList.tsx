'use client';

import React, { useState } from 'react';
import Availability from './Availability';
import { availabilities as initialAvailabilities } from '@/data/availability';
import * as Divider from '@/components/align-ui/ui/divider';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { useRouter } from 'next/navigation';

export default function AvailabilityList() {
  const [availabilities, setAvailabilities] = useState(initialAvailabilities);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const router = useRouter();

  const handleDuplicate = (id: string) => {
    const availabilityToDuplicate = availabilities.find(a => a.id === id);
    if (!availabilityToDuplicate) return;

    const newAvailability = {
      ...availabilityToDuplicate,
      id: String(availabilities.length + 1),
      title: `${availabilityToDuplicate.title} (Cópia)`,
      isDefault: false
    };

    setAvailabilities([...availabilities, newAvailability]);
  };

  const handleDelete = (id: string) => {
    setAvailabilities(availabilities.filter(a => a.id !== id));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/ /g, '-');
    const newAvailability = {
      id: String(availabilities.length + 1),
      title: newName.trim(),
      schedule: 'seg. - sex., 9:00 até 17:00', // valor padrão
      timezone: 'America/São_Paulo', // valor padrão
      isDefault: false,
      status: 'active' as const,
      slug,
      schedules: {
        'Segunda-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
        'Terça-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
        'Quarta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
        'Quinta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
        'Sexta-feira': { enabled: true, startTime: '09:00', endTime: '17:00' },
        'Sábado': { enabled: false, startTime: '09:00', endTime: '17:00' },
        'Domingo': { enabled: false, startTime: '09:00', endTime: '17:00' }
      }
    };
    setAvailabilities([...availabilities, newAvailability]);
    setIsCreateModalOpen(false);
    setNewName('');
    router.push(`/availability/${slug}`);
  };

  return (
    <>
      
      <div className="rounded-lg w-full border border-stroke-soft-200">
        {availabilities.map((availability) => (
          <div key={availability.id}>
            <Availability
              key={availability.id}
              id={availability.id}
              title={availability.title}
              schedule={availability.schedule}
              timezone={availability.timezone}
              isDefault={availability.isDefault}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
            {availability.id !== availabilities[availabilities.length - 1].id && (
              <Divider.Root />
            )} 
          </div>
        ))}
      </div>
      <Modal.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Modal.Content className="max-w-[440px]">
          <Modal.Body>
            <div className="text-xl font-semibold mb-4">Adicionar nova disponibilidade</div>
            <div className="mb-2 text-label-md">Nome</div>
            <Input.Root>
              <Input.Input
                placeholder="Horas de Trabalho"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
              />
            </Input.Root>
          </Modal.Body>
          <Modal.Footer className="flex gap-2 justify-end">
            <Modal.Close asChild>
              <Button.Root variant="neutral" mode="stroke" size="small">
                Fechar
              </Button.Root>
            </Modal.Close>
            <Button.Root
              variant="neutral"
              size="small"
              className="font-semibold"
              disabled={!newName.trim()}
              onClick={handleCreate}
            >
              Criar
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
} 