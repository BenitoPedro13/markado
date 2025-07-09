import type {
  DefaultEventLocationType,
  EventLocationTypeFromApp,
  LocationObject
} from '@/packages/core/location';
import {JSX} from 'react';
import {
  getEventLocationType,
  getTranslatedLocation
} from '@/packages/core/location';
// import { useIsPlatform } from "@/atoms/monorepo";
import {cn as classNames} from '@/utils/cn';
import {useLocaleI18} from '@/hooks/use-locale';
// import invertLogoOnDark from '@/lib/invertLogoOnDark';
// import { Icon } from "@/ui";
import {RiLink} from '@remixicon/react';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
const excludeNullValues = (value: unknown) => !!value;

function RenderIcon({
  eventLocationType,
  isTooltip
}: {
  eventLocationType: DefaultEventLocationType | EventLocationTypeFromApp;
  isTooltip: boolean;
}) {
  // const isPlatform = useIsPlatform();

  // if (isPlatform) {
  //   if (eventLocationType.type === "conferencing") return <Icon name="video" className="me-[10px] h-4 w-4" />;
  //   if (eventLocationType.type === "attendeeInPerson" || eventLocationType.type === "inPerson")
  //     return <Icon name="map-pin" className="me-[10px] h-4 w-4" />;
  //   if (eventLocationType.type === "phone" || eventLocationType.type === "userPhone")
  //     return <Icon name="phone" className="me-[10px] h-4 w-4" />;
  //   if (eventLocationType.type === "link") return <Icon name="link" className="me-[10px] h-4 w-4" />;
  //   return <Icon name="book-user" className="me-[10px] h-4 w-4" />;
  // }

  return (
    <img
      src={eventLocationType.iconUrl}
      className={classNames(
        // invertLogoOnDark(eventLocationType?.iconUrl, isTooltip)
        // ,
        'me-[10px] h-4 w-4'
      )}
      alt={`${eventLocationType.label} icon`}
    />
  );
}

function RenderLocationTooltip({locations}: {locations: LocationObject[]}) {
  const {t} = useLocaleI18();

  return (
    <div className="my-2 me-2 flex w-full flex-col space-y-3 break-words">
      <p>{t('select_on_next_step')}</p>
      {locations.map(
        (
          location: Pick<Partial<LocationObject>, 'link' | 'address'> &
            Omit<LocationObject, 'link' | 'address'>,
          index: number
        ) => {
          const eventLocationType = getEventLocationType(location.type);
          if (!eventLocationType) {
            return null;
          }
          const translatedLocation = getTranslatedLocation(
            location,
            eventLocationType,
            t
          );
          return (
            <div
              key={`${location.type}-${index}`}
              className="font-sm flex flex-row items-center"
            >
              <RenderIcon eventLocationType={eventLocationType} isTooltip />
              <p className="line-clamp-1">{translatedLocation}</p>
            </div>
          );
        }
      )}
    </div>
  );
}

export function AvailableEventLocations({
  locations
}: {
  locations: LocationObject[];
}) {
  const {t} = useLocaleI18();
  // const isPlatform = useIsPlatform();

  const renderLocations = locations.map(
    (
      location: Pick<Partial<LocationObject>, 'link' | 'address'> &
        Omit<LocationObject, 'link' | 'address'>,
      index: number
    ) => {
      const eventLocationType = getEventLocationType(location.type);
      if (!eventLocationType) {
        // It's possible that the location app got uninstalled
        return null;
      }
      if (eventLocationType.variable === 'hostDefault') {
        return null;
      }

      const translatedLocation = getTranslatedLocation(
        location,
        eventLocationType,
        t
      );

      return (
        <div
          key={`${location.type}-${index}`}
          className="flex flex-row items-center text-sm font-medium"
        >
          {eventLocationType.iconUrl === '/link.svg' ? (
            <RiLink
              name="link"
              className="text-default h-4 w-4 ltr:mr-[10px] rtl:ml-[10px]"
            />
          ) : (
            <RenderIcon
              eventLocationType={eventLocationType}
              isTooltip={false}
            />
          )}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p className="line-clamp-1">{translatedLocation}</p>
            </Tooltip.Trigger>
            <Tooltip.Content size="small">{translatedLocation}</Tooltip.Content>
          </Tooltip.Root>
        </div>
      );
    }
  );

  const filteredLocations = renderLocations.filter(
    excludeNullValues
  ) as JSX.Element[];

  return filteredLocations.length > 1 ? (
    <div className="flex flex-row items-center text-sm font-medium">
      {/* {isPlatform ? (
        <Icon name="map-pin" className={classNames("me-[10px] h-4 w-4 opacity-70 dark:invert")} />
      ) : ( */}
      <img
        src="/map-pin-dark.svg"
        className={classNames('me-[10px] h-4 w-4 opacity-70 dark:invert')}
        alt="map-pin"
      />
      {/* )} */}
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <p className="line-clamp-1">
            {t('location_options', {
              locationCount: filteredLocations.length
            })}
          </p>
        </Tooltip.Trigger>
        <Tooltip.Content size="small">
          <RenderLocationTooltip locations={locations} />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  ) : filteredLocations.length === 1 ? (
    <div className="text-default mr-6 flex w-full flex-col space-y-4 break-words text-sm rtl:mr-2">
      {filteredLocations}
    </div>
  ) : null;
}
