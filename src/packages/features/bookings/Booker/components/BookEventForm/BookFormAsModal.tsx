import type {ReactNode} from 'react';
import React from 'react';

// import { useEventTypeById, useIsPlatform } from "@/atoms/monorepo";
import {useLocaleI18} from '@/hooks/use-locale';
// import { Badge, Dialog, DialogContent } from "@/components/align-ui/ui/alert";
import {RiCalendarLine, RiTimeLine} from '@remixicon/react';
import {Root as Badge} from '@/components/align-ui/ui/badge';
import * as Dialog from '@/components/align-ui/ui/modal';
import * as Button from '@/components/align-ui/ui/button';
import {getDurationFormatted} from '../../../components/event-meta/Duration';
import {useTimePreferences} from '../../../lib';
import {useBookerStore} from '../../store';
import {FromTime} from '../../utils/dates';
import {useEvent} from '../../utils/event';

const BookEventFormWrapper = ({
  children,
  onCancel
}: {
  onCancel: () => void;
  children: ReactNode;
}) => {
  const {data} = useEvent();

  return (
    <BookEventFormWrapperComponent
      child={children}
      eventLength={data?.length}
      onCancel={onCancel}
    />
  );
};

// const PlatformBookEventFormWrapper = ({
//   children,
//   onCancel,
// }: {
//   onCancel: () => void;
//   children: ReactNode;
// }) => {
//   const eventId = useBookerStore((state) => state.eventId);
//   const { data } = useEventTypeById(eventId);

//   return (
//     <BookEventFormWrapperComponent child={children} eventLength={data?.lengthInMinutes} onCancel={onCancel} />
//   );
// };

export const BookEventFormWrapperComponent = ({
  child,
  eventLength
}: {
  onCancel: () => void;
  child: ReactNode;
  eventLength?: number;
}) => {
  const {i18n, t} = useLocaleI18();
  const selectedTimeslot = useBookerStore((state) => state.selectedTimeslot);
  const selectedDuration = useBookerStore((state) => state.selectedDuration);
  const {timeFormat, timezone} = useTimePreferences();
  if (!selectedTimeslot) {
    return null;
  }
  return (
    <>
      <h1 className="font-cal text-emphasis text-xl leading-5">
        {t('confirm_your_details')}{' '}
      </h1>
      <div className="my-4 flex flex-wrap gap-2 rounded-md leading-none">
        <Badge variant="filled" color="gray" size="medium">
          <RiCalendarLine className="h-4 w-4 mr-1" />
          <FromTime
            date={selectedTimeslot}
            timeFormat={timeFormat}
            timeZone={timezone}
            language={i18n.language}
          />
        </Badge>
        {(selectedDuration || eventLength) && (
          <Badge
            variant="filled"
            color="gray"
            // startIcon="clock"
            size="medium"
          >
            <RiTimeLine className="h-4 w-4 mr-1" />
            <span>
              {getDurationFormatted(selectedDuration || eventLength, t)}
            </span>
          </Badge>
        )}
      </div>
      {child}
    </>
  );
};

export const BookFormAsModal = ({
  visible,
  onCancel,
  children
}: {
  visible: boolean;
  onCancel: () => void;
  children: ReactNode;
}) => {
  // const isPlatform = useIsPlatform();

  // const isPlatform = false;

  return (
    <Dialog.Root open={visible} onOpenChange={onCancel}>
      {' '}
      {/* Modal de cancelamento */}
      <Dialog.Content>
        <Dialog.Body>
          <BookEventFormWrapper onCancel={onCancel}>
            {children}
          </BookEventFormWrapper>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
