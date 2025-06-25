import { useState } from "react";

import { useAppContextWithSchema } from "@/packages/app-store/EventTypeAppContext";
import { eventTypeAppCardZod } from "@/packages/app-store/eventTypeAppCardZod";

import type { EventTypeAppCardApp } from "../types";

function useIsAppEnabled(app: EventTypeAppCardApp) {
  const { getAppData, setAppData } = useAppContextWithSchema<typeof eventTypeAppCardZod>();
  const [enabled, setEnabled] = useState(() => {
    const isAppEnabled = getAppData("enabled");

    if (!app.credentialOwner) {
      return isAppEnabled ?? false; // Default to false if undefined
    }

    const credentialId = getAppData("credentialId");
    const isAppEnabledForCredential =
      isAppEnabled &&
      (app.userCredentialIds.some((id) => id === credentialId) ||
        app.credentialOwner.credentialId === credentialId);
    return isAppEnabledForCredential ?? false; // Default to false if undefined
  });

  const updateEnabled = (newValue: boolean) => {
    if (!newValue) {
      setAppData("credentialId", undefined);
    }

    if (newValue && (app.userCredentialIds?.length || app.credentialOwner?.credentialId)) {
      setAppData("credentialId", app.credentialOwner?.credentialId || app.userCredentialIds[0]);
    }
    setEnabled(newValue);
  };

  return { enabled, updateEnabled };
}

export default useIsAppEnabled;
