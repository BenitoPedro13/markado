'use client';

import * as Button from '@/components/align-ui/ui/button';
import { ServiceFormFields } from '@/types/service';
import RequiredFormItem from './RequiredFormItem';
import OptionalFormItem from './OptionalFormItem';  

type Props = {
  slug: string;
};

export default function ServiceForm({ slug }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização dos campos do formulário
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="text-title-h6">Formulário da Reserva</div>
          <div className="text-paragraph-sm text-text-sub-600">
            Personalize as perguntas feitas na página de reservas
          </div>
        </div>
        <div className="rounded-lg flex flex-col border border-stroke-soft-200">
          <RequiredFormItem 
            title="Nome"
            description="Digite o seu nome"
          />
          <RequiredFormItem 
            title="E-mail"
            description="Solicitar o e-mail do cliente"
          />
          <OptionalFormItem 
            title="Telefone"
            description="Solicitar o telefone do cliente"
            defaultChecked={true}
          />
          <OptionalFormItem 
            title="Participantes Adicionais"
            description="Permitir adicionar e-mails de participantes adicionais"
            defaultChecked={false}
            showDivider={false}
          />
        </div>
      </div>
    </form>
  );
} 