'use client';
import * as Button from '@/components/align-ui/ui/button';
import {RiLockPasswordLine, RiMailLine, RiDeleteBinLine} from '@remixicon/react';

export default function Privacy() {
  return (
    <div className="space-y-8">
      <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
        <div className="p-6">
          <div className="flex justify-between items-center divide-y divide-stroke-soft-200">
            <div className="w-[400px] space-y-1">
              <h3 className="text-paragraph-md text-text-strong-950">
              Alterar senha
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Altere sua senha atual para uma nova.
              </p>
            </div>
            
            <Button.Root variant="neutral" mode="stroke">
              Alterar senha<RiLockPasswordLine />
            </Button.Root>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center divide-y divide-stroke-soft-200">
            <div className="w-[400px] space-y-1">
              <h3 className="text-paragraph-md text-text-strong-950">
              Criar conta com email
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
              Para alterar seu e-mail, senha, ativar a autenticação de dois fatores e muito mais, visite as configurações da sua conta do Google.
              </p>
            </div>
            
            <Button.Root variant="neutral" mode="stroke">
              Alterar e-mail  <RiMailLine />
            </Button.Root>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center divide-y divide-stroke-soft-200">
            <div className="w-[400px] space-y-1">
              <h3 className="text-paragraph-md text-text-strong-950">
              Apagar conta
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
              Essa ação é irreversível. Todos os dados serão excluídos.
              </p>
            </div>
            
            <Button.Root variant="error" mode="filled">
              Apagar conta  <RiDeleteBinLine />
            </Button.Root>
          </div>
        </div>

        
      </div>
    </div>
  );
} 