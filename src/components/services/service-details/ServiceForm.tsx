'use client';

import * as Switch from '@/components/align-ui/ui/switch';
import * as Button from '@/components/align-ui/ui/button';
import { ServiceFormFields } from '@/types/service';

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
        <div className="border rounded-lg divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Nome</h3>
              <p className="text-sm text-text-sub-600">
                Solicitar o nome do cliente
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">E-mail</h3>
              <p className="text-sm text-text-sub-600">
                Solicitar o e-mail do cliente
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Telefone</h3>
              <p className="text-sm text-text-sub-600">
                Solicitar o telefone do cliente
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Participantes Adicionais</h3>
              <p className="text-sm text-text-sub-600">
                Permitir adicionar e-mails de participantes adicionais
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