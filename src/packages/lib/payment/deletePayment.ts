import type { Payment, Prisma } from "~/prisma/app/generated/prisma/client";

import appStore from "@/packages/app-store";
import type { AppCategories } from "~/prisma/enums";
import type { IAbstractPaymentService, PaymentApp } from "@/packages/types/PaymentService";

const deletePayment = async (
  paymentId: Payment["id"],
  paymentAppCredentials: {
    key: Prisma.JsonValue;
    appId: string | null;
    app: {
      dirName: string;
      categories: AppCategories[];
    } | null;
  }
): Promise<boolean> => {
  const paymentApp = (await appStore[
    paymentAppCredentials?.app?.dirName as keyof typeof appStore
  ]?.()) as PaymentApp;
  if (!paymentApp?.lib?.PaymentService) {
    console.warn(`payment App service of type ${paymentApp} is not implemented`);
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PaymentService = paymentApp.lib.PaymentService as any;
  const paymentInstance = new PaymentService(paymentAppCredentials) as IAbstractPaymentService;
  const deleted = await paymentInstance.deletePayment(paymentId);
  return deleted;
};

export { deletePayment };
