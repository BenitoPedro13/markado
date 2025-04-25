'use client';

import * as Button from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as StatusBadge from '@/components/align-ui/ui/status-badge';
import { Me } from '@/app/settings/page';
import { RiBankCardLine } from '@remixicon/react';
import Image from 'next/image';
const paymentHistory = [
  {
    date: '28 Abr 2024',
    method: 'Stripe',
    email: 'marcus@mainnet.design',
    status: 'pending',
    amount: 'R$ 255,02'
  },
  {
    date: '28 Mar 2024',
    method: 'Stripe',
    email: 'marcus@mainnet.design',
    status: 'completed',
    amount: 'R$ 255,02'
  },
  {
    date: '28 Fev 2024',
    method: 'Stripe',
    email: 'marcus@mainnet.design',
    status: 'completed',
    amount: 'R$ 255,02'
  }
];

export default function Payment({me}: {me: Me}) {
  return (
    <div className="space-y-8">
      {/* Métodos de Pagamento */}
      <div className="border border-stroke-soft-200 rounded-lg">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1 w-[280px]">
              <h3 className="text-paragraph-md text-text-strong-950">
                Métodos de pagamento
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Selecione um método de pagamento padrão
              </p>
            </div>
            <Button.Root variant="neutral" mode="stroke">
              Salvar alterações
            </Button.Root>
          </div>
        </div>

        {/* Stripe */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logos/Stripe.svg" alt="Stripe" width={38} height={38} />
              <div className="space-y-1">
                <h4 className="text-paragraph-md text-text-strong-950">Stripe</h4>
                <p className="text-paragraph-sm text-text-sub-600">marcus@mainnet.design</p>
              </div>
            </div>
            <StatusBadge.Root status="completed" variant="light">
              <StatusBadge.Dot />
              Ativo
            </StatusBadge.Root>
          </div>
        </div>
      </div>

      {/* Informações de Fatura */}
      <div className="border border-stroke-soft-200 rounded-lg">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1 w-[280px]">
              <h3 className="text-paragraph-md text-text-strong-950">
                Informações de fatura
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Informações que serão incluídas ao gerar uma fatura de pagamento
              </p>
            </div>
            <div className="w-[400px]">
              <Textarea.Root placeholder="CPNJ: 44.393.405/0001-02" />
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="border border-stroke-soft-200 rounded-lg">
        <div className="p-6 border-b border-stroke-soft-200">
          <div className="space-y-1">
            <h3 className="text-paragraph-md text-text-strong-950">
              Histórico de pagamentos
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Veja o histórico de pagamentos desta conta
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-soft-50">
              <tr className="text-left text-paragraph-sm text-text-sub-600">
                <th className="py-3 px-6 font-medium">Data</th>
                <th className="py-3 px-6 font-medium">Método</th>
                <th className="py-3 px-6 font-medium">Email</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke-soft-200">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="text-paragraph-sm">
                  <td className="py-4 px-6 text-text-strong-950">{payment.date}</td>
                  <td className="py-4 px-6 text-text-strong-950">{payment.method}</td>
                  <td className="py-4 px-6 text-text-sub-600">{payment.email}</td>
                  <td className="py-4 px-6">
                    <StatusBadge.Root status={payment.status as any} variant="light">
                      <StatusBadge.Dot />
                      {payment.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </StatusBadge.Root>
                  </td>
                  <td className="py-4 px-6 text-text-strong-950 text-right">{payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 