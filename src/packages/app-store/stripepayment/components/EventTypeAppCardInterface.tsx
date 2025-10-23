import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAppContextWithSchema } from "@/packages/app-store/EventTypeAppContext";
import AppCard from "@/packages/app-store/_components/AppCard";
import type { EventTypeAppCardComponent } from "@/packages/app-store/types";
import { WEBAPP_URL } from "@/constants";
import { useLocale } from "@/hooks/use-locale";

import checkForMultiplePaymentApps from "../../_utils/payments/checkForMultiplePaymentApps";
import useIsAppEnabled from "../../_utils/useIsAppEnabled";
import type { appDataSchema } from "../zod";
import EventTypeAppSettingsInterface from "./EventTypeAppSettingsInterface";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
  eventTypeFormMetadata,
}) {
  const {t} = useLocale();
  const pathname = usePathname();
  const { getAppData, setAppData, disabled } = useAppContextWithSchema<typeof appDataSchema>();
  const { enabled, updateEnabled } = useIsAppEnabled(app);
  const otherPaymentAppEnabled = checkForMultiplePaymentApps(eventTypeFormMetadata);
  const [requirePayment, setRequirePayment] = useState(getAppData("enabled"));
  const shouldDisableSwitch = !requirePayment && otherPaymentAppEnabled;

  return (
    <AppCard
      returnTo={`${WEBAPP_URL}${pathname}?tabName=apps`}
      app={{...app, isInstalled: !!app.isInstalled}}
      switchChecked={enabled}
      switchOnClick={(e) => {
        updateEnabled(e);
      }}
      teamId={eventType.team?.id || undefined}
      disableSwitch={shouldDisableSwitch}
      switchTooltip={shouldDisableSwitch ? t("other_payment_app_enabled") : undefined}>
      <EventTypeAppSettingsInterface
        eventType={eventType}
        slug={app.slug}
        disabled={disabled}
        getAppData={getAppData}
        setAppData={setAppData}
      />
    </AppCard>
  );
};

export default EventTypeAppCard;
