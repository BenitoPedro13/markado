import type { LocationObject } from "@/packages/core/location";
import {locationKeyToString} from '@/packages/core/location';
import {getEventLocationType} from '@/packages/core/location';
import {getTranslatedLocation} from '@/packages/core/location';
import type { useLocale } from "@/hooks/use-locale";
import notEmpty from "@/packages/lib/notEmpty";

export default function getLocationsOptionsForSelect(
  locations: LocationObject[],
  t: any
) {
  return locations
    .map((location) => {
      const eventLocation = getEventLocationType(location.type);
      const locationString = locationKeyToString(location);

      if (typeof locationString !== 'string' || !eventLocation) {
        // It's possible that location app got uninstalled
        return null;
      }
      const type = eventLocation.type;
      const translatedLocation = getTranslatedLocation(
        location,
        eventLocation,
        t
      );

      return {
        // XYZ: is considered a namespace in i18next https://www.i18next.com/principles/namespaces and thus it get's cleaned up.
        label: translatedLocation || locationString,
        value: type,
        inputPlaceholder: t(eventLocation?.attendeeInputPlaceholder || '')
      };
    })
    .filter(notEmpty);
}
