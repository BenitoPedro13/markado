'use client';

import * as Input from '@/components/align-ui/ui/input';

interface GeneralFieldProps {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}

const GeneralField = ({ label, value, description, onChange }: GeneralFieldProps) => (
  <div className="py-6 border-b border-stroke-soft-200">
    <div className="flex justify-between items-start">
      <div className="space-y-1 w-[280px]">
        <h3 className="text-paragraph-md text-text-strong-950">{label}</h3>
        <p className="text-paragraph-sm text-text-sub-600">{description}</p>
      </div>
      <div className="w-[400px]">
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  </div>
);

export default function General() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-sm text-text-strong-950">Configurações gerais</h2>
        <p className="text-paragraph-md text-text-sub-600">Configure preferências gerais do sistema.</p>
      </div>

      <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
        <GeneralField
          label="Idioma"
          value="Português (Brasil)"
          description="O idioma exibido na interface."
          onChange={() => {}}
        />

        <GeneralField
          label="Fuso Horário"
          value="America/São Paulo"
          description="Alinhe com sua localização atual."
          onChange={() => {}}
        />

        <GeneralField
          label="Formato de hora"
          value="24h"
          description="Escolha entre 24h ou 12h (AM/PM)."
          onChange={() => {}}
        />

        <GeneralField
          label="Início da semana"
          value="Segunda-feira"
          description="Dia inicial, geralmente domingo ou segunda-feira."
          onChange={() => {}}
        />
      </div>
    </div>
  );
} 