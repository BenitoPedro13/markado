'use client';

import { useForm } from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import { ServiceAvailability as ServiceAvailabilityType } from '@/types/service';

type Props = {
  slug: string;
};

type AvailabilityFormData = {
  availability: ServiceAvailabilityType[];
};

const daysOfWeek = [
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

export default function ServiceAvailability({ slug }: Props) {
  const { register, handleSubmit } = useForm<AvailabilityFormData>();

  const onSubmit = (data: AvailabilityFormData) => {
    console.log(data);
    // TODO: Implementar atualização da disponibilidade
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
      <div className="text-title-h6">Disponibilidade</div>
        <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-end">
          
          <div>
            <label className="text-sm font-medium text-text-strong-950">
              Disponibilidade
            </label>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Selecione os dias" />
              </Select.Trigger>
              <Select.Content>
                {daysOfWeek.map((day) => (
                  <Select.Item key={day.value} value={day.value}>
                    {day.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div>
            <label className="text-sm font-medium text-text-strong-950">
              Horário Inicial
            </label>
            <Input.Root>
              <Input.Input 
                type="time" 
                defaultValue="09:00"
              />
            </Input.Root>
          </div>

          <div>
            <label className="text-sm font-medium text-text-strong-950">
              Horário Final
            </label>
            <Input.Root>
              <Input.Input 
                type="time" 
                defaultValue="17:00"
              />
            </Input.Root>
          </div>
        </div>

        <Button.Root type="button" variant="neutral">
          Adicionar Horário
        </Button.Root>

        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-medium">Horários Configurados</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-background-soft-100 rounded">
              <span>Segunda à Sexta - 09:00 às 17:00</span>
              <Button.Root type="button" variant="neutral" className="text-red-500">
                Remover
              </Button.Root>
            </div>
          </div>
        </div>
      </div>

      <Button.Root type="submit">
        Salvar Alterações
      </Button.Root>
    </form>
  );
} 