'use client';

import {useForm} from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Button from '@/components/align-ui/ui/button';
import * as Select from '@/components/align-ui/ui/select';
import {ServiceAvailability as ServiceAvailabilityType} from '@/types/service';
import {RowDivider} from '@/components/align-ui/ui/table';
import * as Divider from '@/components/align-ui/ui/divider';
import {
  RiArrowLeftUpLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiGlobalLine
} from '@remixicon/react';
type Props = {
  slug: string;
};

type AvailabilityFormData = {
  availability: ServiceAvailabilityType[];
};

const daysOfWeek = [
  {value: 'monday', label: 'Segunda-feira'},
  {value: 'tuesday', label: 'Terça-feira'},
  {value: 'wednesday', label: 'Quarta-feira'},
  {value: 'thursday', label: 'Quinta-feira'},
  {value: 'friday', label: 'Sexta-feira'},
  {value: 'saturday', label: 'Sábado'},
  {value: 'sunday', label: 'Domingo'}
];

export default function ServiceAvailability({slug}: Props) {
  const {register, handleSubmit} = useForm<AvailabilityFormData>();

  const onSubmit = (data: AvailabilityFormData) => {
    console.log(data);
    // TODO: Implementar atualização da disponibilidade
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col gap-4 max-w-2xl">
      <div className="space-y-4 ">
        <div className="text-title-h6">Geral</div>
        <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-end">
          <div className="flex flex-col gap-2">
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
        </div>

        <Divider.Root />

        <div className="">
          <h3 className="text-title-h6">Horários Configurados</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-background-soft-100 rounded">
              <table className="mt-4 w-full max-w-[400px] text-paragraph-sm">
                <tbody>
                  {[
                    {dia: 'Segunda-feira', inicio: '09:00h', fim: '17:00h'},
                    {dia: 'Terça-feira', inicio: '09:00h', fim: '17:00h'},
                    {dia: 'Quarta-feira', inicio: '09:00h', fim: '17:00h'},
                    {dia: 'Quinta-feira', inicio: '09:00h', fim: '17:00h'},
                    {dia: 'Sexta-feira', inicio: '09:00h', fim: '17:00h'},
                    {dia: 'Sábado', inicio: 'Indisponível', fim: ''},
                    {dia: 'Domingo', inicio: 'Indisponível', fim: ''}
                  ].map(({dia, inicio, fim}) => (
                    <tr
                      key={dia}
                      className={`${inicio === 'Indisponível' ? 'text-text-disabled-300' : 'text-text-sub-600'}`}
                    >
                      <td className="py-2 text-text-strong-950">{dia}</td>
                      <td className="py-2 text-center">{inicio}</td>
                      {inicio !== 'Indisponível' && (
                        <>
                          <td className="py-2 text-center">-</td>
                          <td className="py-2 text-center">{fim}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Divider.Root />

      <div className="flex justify-between items-center gap-2">
        <Button.Root mode="ghost" className="w-fit">
          <Button.Icon as={RiGlobalLine} />
          America/Sao_Paulo
        </Button.Root>
        <Button.Root mode="ghost" className="w-fit">
          Editar Disponibilidade
          <Button.Icon as={RiArrowRightUpLine} />
        </Button.Root>
      </div>
    </form>
  );
}
