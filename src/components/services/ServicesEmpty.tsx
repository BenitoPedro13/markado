import { useServices } from '@/contexts/services/ServicesContext';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import { RiAddLine, RiLinksLine } from '@remixicon/react';

export default function ServicesEmpty() {
  const {
    state: { setIsCreateServiceModalOpen },
  } = useServices();

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div
        className="
          p-6 
          bg-bg-white-0 
          rounded-full 
          shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
          outline outline-1 outline-offset-[-1px] outline-stroke-soft-200
          flex justify-center items-center overflow-hidden
        "
      >
        <RiLinksLine className="w-12 h-12 text-bg-strong-950" />
      </div>
      <p className="text-center text-text-sub-600 text-sm">
        Nenhum serviço encontrado.
        <br />
        Crie seu primeiro serviço para começar a gerenciar seus projetos facilmente!
      </p>
      <FancyButton.Root 
        onClick={() => setIsCreateServiceModalOpen(true)}
        variant="neutral"
      >
        <FancyButton.Icon as={RiAddLine} />
        Adicionar Meu Primeiro Serviço
      </FancyButton.Root>
    </div>
  );
}
