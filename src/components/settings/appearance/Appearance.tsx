import * as Button from '@/components/align-ui/ui/button';
import * as Radio from '@/components/align-ui/ui/radio';
import * as Label from '@/components/align-ui/ui/label';
import { Me } from '@/app/settings/page';

export default function Appearance({me}: {me: Me}) {
  return (
    <div className="space-y-8">
      {/* Tema */}
      <div className="border border-stroke-soft-200 rounded-lg">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1 w-[280px]">
              <h3 className="text-paragraph-md text-text-strong-950">
                Tema
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Escolha como o Markado deve aparecer no seu dispositivo
              </p>
            </div>
            <Button.Root variant="neutral" mode="stroke">
              Salvar alterações
            </Button.Root>
          </div>
        </div>

        <div className="p-6">
          <Radio.Group defaultValue="system">
            <div className="space-y-4">
              <Radio.Item value="light">
                <Label.Root>Claro</Label.Root>
              </Radio.Item>

              <Radio.Item value="dark">
                <Label.Root>Escuro</Label.Root>
              </Radio.Item>

              <Radio.Item value="system">
                <Label.Root>Sistema</Label.Root>
              </Radio.Item>
            </div>
          </Radio.Group>
        </div>
      </div>

      {/* Densidade */}
      <div className="border border-stroke-soft-200 rounded-lg">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1 w-[280px]">
              <h3 className="text-paragraph-md text-text-strong-950">
                Densidade
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Ajuste o espaçamento entre os elementos da interface
              </p>
            </div>
            <Button.Root variant="neutral" mode="stroke">
              Salvar alterações
            </Button.Root>
          </div>
        </div>

        <div className="p-6">
          <Radio.Group defaultValue="comfortable">
            <div className="space-y-4">
              <Radio.Item value="comfortable">
                <Label.Root>Confortável</Label.Root>
              </Radio.Item>

              <Radio.Item value="compact">
                <Label.Root>Compacto</Label.Root>
              </Radio.Item>
            </div>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
} 