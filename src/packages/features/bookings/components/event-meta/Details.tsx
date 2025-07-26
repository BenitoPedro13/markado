import React, {Fragment} from 'react';

import {useBookerStore} from '@/packages/features/bookings/Booker/store';
import {PriceIcon} from '@/packages/features/bookings/components/event-meta/PriceIcon';
import type {BookerEvent} from '@/packages/features/bookings/types';
import {cn as classNames} from '@/utils/cn';
import getPaymentAppData from '@/packages/lib/getPaymentAppData';
import {useLocale} from '@/hooks/use-locale';
// import {
// Icon,
// type IconName} from '@/ui';

import {EventDetailBlocks} from '../../types';
import {AvailableEventLocations} from './AvailableEventLocations';
import {EventDuration} from './Duration';
import {EventOccurences} from './Occurences';
import {Price} from './Price';
import {RiTimeLine, RiCheckboxLine, RiRefreshLine, RiLink} from '@remixicon/react';

// Google Meet icon component
const GoogleMeetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.125 14.7246C3.125 15.2219 3.53124 15.6246 4.03176 15.6246H4.04479C3.53661 15.6246 3.125 15.2219 3.125 14.7246Z"
      fill="#FBBC05"
    />
    <path
      d="M10.9172 7.74998V10.0997L14.0851 7.54448V5.275C14.0851 4.77775 13.6789 4.375 13.1784 4.375H6.31522L6.30908 7.74998H10.9172Z"
      fill="#FBBC05"
    />
    <path
      d="M10.9171 12.4503H6.30126L6.2959 15.6251H13.1782C13.6795 15.6251 14.085 15.2223 14.085 14.7251V12.6761L10.9171 10.1006V12.4503Z"
      fill="#34A853"
    />
    <path
      d="M6.31514 4.375L3.125 7.74998H6.30977L6.31514 4.375Z"
      fill="#EA4335"
    />
    <path
      d="M3.125 12.4502V14.7249C3.125 15.2222 3.53661 15.6249 4.04479 15.6249H6.29597L6.30134 12.4502H3.125Z"
      fill="#1967D2"
    />
    <path
      d="M6.30977 7.75H3.125V12.4502H6.30134L6.30977 7.75Z"
      fill="#4285F4"
    />
    <path
      d="M16.8706 13.925V6.20006C16.692 5.17481 15.5676 6.35005 15.5676 6.35005L14.0859 7.5448V12.6755L16.2068 14.3998C16.9725 14.5003 16.8706 13.925 16.8706 13.925Z"
      fill="#34A853"
    />
    <path
      d="M10.917 10.0994L14.0857 12.6756V7.54492L10.917 10.0994Z"
      fill="#188038"
    />
  </svg>
);

type EventDetailsPropsBase = {
  event: Pick<
    BookerEvent,
    | 'currency'
    | 'price'
    | 'locations'
    | 'requiresConfirmation'
    | 'recurringEvent'
    | 'length'
    | 'metadata'
    | 'isDynamic'
  >;
  className?: string;
};

type EventDetailsProps = EventDetailsPropsBase & {
  blocks?: (EventDetailBlocks | React.FC<{event: EventDetailsPropsBase['event']}>)[];
};

interface EventMetaProps {
  customIcon?: React.ReactNode;
  icon?: string;
  iconUrl?: string;
  children: React.ReactNode;
  // Emphasises the text in the block. For now only
  // applying in dark mode.
  highlight?: boolean;
  contentClassName?: string;
  className?: string;
  isDark?: boolean;
}

/**
 * Default order in which the event details will be rendered.
 */
const defaultEventDetailsBlocks = [
  EventDetailBlocks.LOCATION,
  EventDetailBlocks.REQUIRES_CONFIRMATION,
  EventDetailBlocks.DURATION,
  EventDetailBlocks.PRICE,
  EventDetailBlocks.OCCURENCES,
];

/**
 * Helper component that ensures the meta data of an event is
 * rendered in a consistent way — adds an icon and children (text usually).
 */
export const EventMetaBlock = ({
  customIcon,
  icon,
  iconUrl,
  children,
  highlight,
  contentClassName,
  className,
  isDark
}: EventMetaProps) => {
  if (!React.Children.count(children)) return null;

  return (
    <div
      className={classNames(
        'flex items-start gap-[5px] justify-start text-label-sm text-text-sub-600 overflow-hidden',
        // highlight ? 'text-emphasis' : 'text-sub-600',
        className
      )}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          // @TODO: Use SVG's instead of images, so we can get rid of the filter.
          className={classNames(
            'mr-2 mt-[2px] h-4 w-4 flex-shrink-0',
            isDark === undefined && '[filter:invert(0.5)_brightness(0.5)]',
            (isDark === undefined || isDark) &&
              'dark:[filter:invert(0.65)_brightness(0.9)]'
          )}
        />
      ) : (
        <>
          {
            customIcon && (
              <div className="flex-shrink-0">
                {customIcon}
              </div>
            )
            //    ||
            //     (!!icon && (
            //       <Icon
            //         name={icon}
            //         className="text-sub-600 relative z-20 mr-2 mt-[2px] h-4 w-4 flex-shrink-0 rtl:ml-2"
            //       />
            //     ))
          }
        </>
      )}
      {children && <div
        className={classNames(
          'relative z-10 max-w-full break-words truncate min-w-0',
          contentClassName
        )}
      >
        {children}
      </div>}
    </div>
  );
};

/**
 * Component that renders event meta data in a structured way, with icons and labels.
 * The component can be configured to show only specific blocks by overriding the
 * `blocks` prop. The blocks prop takes in an array of block names, defined
 * in the `EventDetailBlocks` enum. See the `defaultEventDetailsBlocks` const
 * for the default order in which the blocks will be rendered.
 *
 * As part of the blocks array you can also decide to render a custom React Component,
 * which will then also be rendered.
 *
 * Example:
 * const MyCustomBlock = () => <div>Something nice</div>;
 * <EventDetails event={event} blocks={[EventDetailBlocks.LOCATION, MyCustomBlock]} />
 */
export const EventDetails = ({
  event,
  blocks = defaultEventDetailsBlocks
}: EventDetailsProps) => {
  const {t} = useLocale();
  const rescheduleUid = useBookerStore((state) => state.rescheduleUid);
  const isInstantMeeting = useBookerStore((store) => store.isInstantMeeting);

  // Helper function to get conference link info
  const getConferenceInfo = () => {
    console.log('Event locations:', event.locations);
    
    if (!event.locations || event.locations.length === 0) {
      // Fallback: se não há locations, vamos mostrar Google Meet como padrão
      return {
        icon: <GoogleMeetIcon />,
        name: 'Google Meet'
      };
    }
    
    const conferenceLocation = event.locations.find(location => 
      location.type === 'integrations:google_meet' || 
      location.type === 'integrations:zoom' ||
      location.type === 'integrations:teams' ||
      location.link
    );
    
    if (!conferenceLocation) {
      // Fallback: se não encontrou uma localização de conferência específica
      return {
        icon: <GoogleMeetIcon />,
        name: 'Google Meet'
      };
    }
    
    const isGoogleMeet = conferenceLocation.type === 'integrations:google_meet';
    const isZoom = conferenceLocation.type === 'integrations:zoom';
    const isTeams = conferenceLocation.type === 'integrations:teams';
    
    let icon, name;
    
    if (isGoogleMeet) {
      icon = <GoogleMeetIcon />;
      name = 'Google Meet';
    } else if (isZoom) {
      icon = <RiLink size={20} color="var(--text-sub-600)" />;
      name = 'Zoom';
    } else if (isTeams) {
      icon = <RiLink size={20} color="var(--text-sub-600)" />;
      name = 'Microsoft Teams';
    } else {
      icon = <RiLink size={20} color="var(--text-sub-600)" />;
      name = conferenceLocation.type || 'Link';
    }
    
    return { icon, name };
  };

  const conferenceInfo = getConferenceInfo();

  return (
    <>
      {blocks.map((block) => {
        // if (typeof block === 'function') {
        //   return <Fragment key={block.name}>{block(event)}</Fragment>;
        // }

        if (typeof block === 'function') {
          const Block = block as React.FC<{
            event: EventDetailsPropsBase['event'];
          }>;
          return <Block key={Block.name} event={event} />;
        }

        switch (block) {
          case EventDetailBlocks.LOCATION:
            return (
              <EventMetaBlock key={block}>
                <AvailableEventLocations
                  locations={event.locations ?? ['Google Meet']}
                />
              </EventMetaBlock>
            );

          case EventDetailBlocks.DURATION:
            return (
              <EventMetaBlock
                key={block}
                customIcon={
                  <RiTimeLine size={20} color="var(--text-sub-600)" />
                }
                className="items-center"
              >
                {typeof event.length === 'number' ? (
                  <EventDuration event={event} />
                ) : (
                  <span>Tempo não informado</span>
                )}
              </EventMetaBlock>
            );

          case EventDetailBlocks.REQUIRES_CONFIRMATION:
            if (!event.requiresConfirmation) return null;

            return (
              <EventMetaBlock
                key={block}
                customIcon={
                  <RiCheckboxLine size={20} color="var(--text-sub-600)" />
                }
                //   icon="square-check"
              >
                {t('requires_confirmation')}
              </EventMetaBlock>
            );

          case EventDetailBlocks.OCCURENCES:
            if (!event.recurringEvent || rescheduleUid) return null;

            return (
              <EventMetaBlock
                key={block}
                customIcon={
                  <RiRefreshLine size={20} color="var(--text-sub-600)" />
                }
                // icon="refresh-ccw"
              >
                <EventOccurences event={event} />
              </EventMetaBlock>
            );

          case EventDetailBlocks.PRICE:
            return (
              <EventMetaBlock
                key={block}
                customIcon={<PriceIcon currency={event.currency} />}
              >
                {typeof event.price === 'number' ? (
                  event.price > 0 ? (
                    <Price price={event.price} currency={event.currency} />
                  ) : (
                    <span>Grátis</span>
                  )
                ) : (
                  <span>Valor não informado</span>
                )}
              </EventMetaBlock>
            );
        }
      })}
      
      {/* Conference/Link block */}
      <EventMetaBlock
        customIcon={conferenceInfo.icon}
        className="items-center"
      >
        {conferenceInfo.name}
      </EventMetaBlock>
    </>
  );
};
