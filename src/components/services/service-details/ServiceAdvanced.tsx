'use client';

import * as Switch from '@/components/align-ui/ui/switch';
import * as Button from '@/components/align-ui/ui/button';
import * as Divider from '@/components/align-ui/ui/divider';

type Props = {
  slug: string;
};

export default function ServiceAdvanced({slug}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização das configurações avançadas
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="text-title-h6">Configurações Avançadas</div>
          <div className="text-paragraph-sm text-text-sub-600">
            Personalize as configurações avançadas do serviço
          </div>
        </div>
        <div className="border border-stroke-soft-200 rounded-lg ">
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Necessita de Confirmação Manual</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                A reserva exige uma confirmação manual antes de ser enviada para integrações e para o envio de um e-mail de confirmação ao usuário.
              </p>
            </div>
            <Switch.Root />
          </div>

          <Divider.Root />
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Redirecionamento pós-reserva</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Defina uma URL específica para a qual o usuário será direcionado logo após concluir uma reserva
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>
          <Divider.Root />
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Fixar Fuso Horário na Página de Reservas</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Manter o fuso horário fixo na página de reservas, ideal para eventos que exigem a presença física.
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>
          <Divider.Root />
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Diferenciação por Cor para Tipos de Serviço</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Essa opção serve apenas para distinguir visualmente os tipos de serviço e agendamentos no sistema, sem ser exibida para quem agenda.
              </p>
            </div>
            <Switch.Root />
          </div>
        </div>
      </div>

      
    </form>
  );
}
