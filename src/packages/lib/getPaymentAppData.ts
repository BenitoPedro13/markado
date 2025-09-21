import type { z } from "zod";

import { getEventTypeAppData } from "@/packages/app-store/_utils/getEventTypeAppData";
import type { appDataSchemas } from "@/packages/app-store/apps.schemas.generated";
import type { appDataSchema, paymentOptionEnum } from "@/packages/app-store/stripepayment/zod";
import type { EventTypeAppsList } from "@/packages/app-store/utils";
import type { BookerEvent } from "@/packages/features/bookings/types";

export default function getPaymentAppData(
  eventType: Pick<BookerEvent, "price" | "currency" | "metadata">,
  forcedGet?: boolean
) {
  const metadataApps = eventType?.metadata?.apps as unknown as EventTypeAppsList;
  if (!metadataApps) {
    return {
      enabled: false,
      price: 0,
      currency: "usd",
      appId: null,
      paymentOption: "ON_BOOKING" as z.infer<typeof paymentOptionEnum>,
      credentialId: undefined,
    };
  }
  type appId = keyof typeof metadataApps;
  // @TODO: a lot of unknowns types here can be improved later
  const paymentAppIds = (Object.keys(metadataApps) as Array<keyof typeof appDataSchemas>).filter(
    (app) =>
      (metadataApps[app as appId] as unknown as z.infer<typeof appDataSchema>)?.price &&
      (metadataApps[app as appId] as unknown as z.infer<typeof appDataSchema>)?.enabled
  );

  // Event type should only have one payment app data
  let paymentAppData: {
    enabled: boolean | undefined;
    price: number;
    currency: string;
    appId: EventTypeAppsList | null;
    paymentOption: z.infer<typeof paymentOptionEnum>;
    credentialId?: number;
  } | null = null;
  for (const appId of paymentAppIds) {
    const appData = getEventTypeAppData(eventType, appId, forcedGet);
    if (appData && paymentAppData === null) {
      paymentAppData = {
        ...appData,
        enabled: "enabled" in appData ? appData.enabled ?? false : false,
        price: "price" in appData ? appData.price ?? 0 : 0,
        currency: "currency" in appData ? appData.currency ?? "usd" : "usd",
        paymentOption: "paymentOption" in appData ? 
          appData.paymentOption ?? ("ON_BOOKING" as z.infer<typeof paymentOptionEnum>) : 
          "ON_BOOKING" as z.infer<typeof paymentOptionEnum>,
        credentialId: "credentialId" in appData ? appData.credentialId : undefined,
        appId,
      };
    }
  }
  // This is the current expectation of system to have price and currency set always(using DB Level defaults).
  // Newly added apps code should assume that their app data might not be set.
  return (
    paymentAppData || {
      enabled: false,
      price: 0,
      currency: "usd",
      appId: null,
      paymentOption: "ON_BOOKING" as z.infer<typeof paymentOptionEnum>,
      credentialId: undefined,
    }
  );
}

export type PaymentAppData = ReturnType<typeof getPaymentAppData>;
