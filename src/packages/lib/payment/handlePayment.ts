import type { AppCategories, Prisma } from "~/prisma/app/generated/prisma/client";
import { PaymentOption } from "~/prisma/app/generated/prisma/client";

import appStore from "@/packages/app-store";
import type {EventTypeAppsList} from '@/packages//app-store/utils';
import type { CompleteEventType } from "~/prisma/zod";
import type { CalendarEvent } from "@/types/Calendar";
import type { IAbstractPaymentService, PaymentApp } from "@/packages/types/PaymentService";

const handlePayment = async (
  evt: CalendarEvent,
  selectedEventType: Pick<CompleteEventType, "metadata" | "title">,
  paymentAppCredentials: {
    key: Prisma.JsonValue;
    appId: EventTypeAppsList;
    app: {
      dirName: string;
      categories: AppCategories[];
    } | null;
  },
  booking: {
    user: { email: string | null; name: string | null; timeZone: string; username: string | null } | null;
    id: number;
    userId: string | null;
    startTime: { toISOString: () => string };
    uid: string;
  },
  bookerName: string,
  bookerEmail: string,
  bookerPhoneNumber?: string | null
) => {
  const paymentApp = (await appStore[
    paymentAppCredentials?.app?.dirName as keyof typeof appStore
  ]?.()) as PaymentApp;
  if (!paymentApp?.lib?.PaymentService) {
    console.warn(`payment App service of type ${paymentApp} is not implemented`);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PaymentService = paymentApp.lib.PaymentService as any;

  const paymentInstance = new PaymentService(paymentAppCredentials) as IAbstractPaymentService;

  // Safely access app metadata for payment apps
  const appMetadata = selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId];
  
  const paymentOption: PaymentOption = 
    (appMetadata && "paymentOption" in appMetadata && appMetadata.paymentOption ? appMetadata.paymentOption as PaymentOption : null) || PaymentOption.ON_BOOKING;

  // Safely extract price and currency with proper type checking
  const price = appMetadata && "price" in appMetadata ? appMetadata.price : 0;
  const currency = appMetadata && "currency" in appMetadata ? appMetadata.currency : "usd";

  let paymentData;
  if (paymentOption === PaymentOption.HOLD) {
    paymentData = await paymentInstance.collectCard(
      {
        amount: price,
        currency: currency,
      },
      booking.id,
      paymentOption,
      bookerEmail,
      bookerPhoneNumber
    );
  } else {
    paymentData = await paymentInstance.create(
      {
        amount: price,
        currency: currency,
      },
      booking.id,
      booking.userId,
      booking.user?.username ?? null,
      bookerName,
      paymentOption,
      bookerEmail,
      bookerPhoneNumber,
      selectedEventType.title,
      evt.title
    );
  }

  if (!paymentData) {
    console.error("Payment data is null");
    throw new Error("Payment data is null");
  }
  try {
    await paymentInstance.afterPayment(evt, booking, paymentData, selectedEventType?.metadata);
  } catch (e) {
    console.error(e);
  }
  return paymentData;
};

export { handlePayment };
