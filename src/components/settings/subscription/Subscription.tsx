'use client';

import * as Button from '@/components/align-ui/ui/button';
import {RiArrowRightUpLine} from '@remixicon/react';

export default function Subscription() {
  return (
    <div className="space-y-8">
    <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
      <div className="p-6">
        <div className="flex justify-between items-center divide-y divide-stroke-soft-200">
          <div className="w-[400px] space-y-1">
            <h3 className="text-paragraph-md text-text-strong-950">
            Minha Assinatura
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Gerencie sua assinatura e pagamentos pelo Stripe.
            </p>
          </div>
          
          <Button.Root variant="neutral" mode="stroke">
            Abrir Portal de Cobrança <RiArrowRightUpLine />
          </Button.Root>
        </div>
      </div>
      
      
    </div>
  </div>
  );
} 