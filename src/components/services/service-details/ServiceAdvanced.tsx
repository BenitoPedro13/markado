'use client';

import * as Switch from '@/components/align-ui/ui/switch';
import * as Button from '@/components/align-ui/ui/button';
import { ServiceAdvancedSettings } from '@/types/service';

type Props = {
  slug: string;
};

export default function ServiceAdvanced({ slug }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização das configurações avançadas
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="border rounded-lg divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Confirmação Manual</h3>
              <p className="text-sm text-text-sub-600">
                Exigir sua confirmação antes de confirmar o agendamento
              </p>
            </div>
            <Switch.Root />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Permitir Reagendamento</h3>
              <p className="text-sm text-text-sub-600">
                Permitir que clientes reagendem seus horários
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enviar Lembretes</h3>
              <p className="text-sm text-text-sub-600">
                Enviar lembretes automáticos por e-mail
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Pagamento Antecipado</h3>
              <p className="text-sm text-text-sub-600">
                Exigir pagamento no momento do agendamento
              </p>
            </div>
            <Switch.Root />
          </div>
        </div>
      </div>

      <Button.Root type="submit">
        Salvar Alterações
      </Button.Root>
    </form>
  );
} 