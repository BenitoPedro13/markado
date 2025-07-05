import { useEffect, useState, useTransition } from "react";
// import { shallow } from "zustand/shallow";

import dayjs from "@/lib/dayjs";
import { useBookerStore } from "@/packages/features/bookings/Booker/store";
import { useSlotReservationId } from "@/packages/features/bookings/Booker/useSlotReservationId";
import type { BookerEvent } from "@/packages/features/bookings/types";
import { MINUTES_TO_BOOK } from "@/constants";
// import { trpc } from "~/trpc/client"; // Removido temporariamente
import { reserveSlotAction, removeSelectedSlotAction } from "~/trpc/server/handlers/public/reserveSlot.handler";

export type UseSlotsReturnType = ReturnType<typeof useSlots>;

export const useSlots = (event: { data?: Pick<BookerEvent, "id" | "length"> | null }) => {
  const selectedDuration = useBookerStore((state) => state.selectedDuration);
  const [selectedTimeslot, setSelectedTimeslot] = useBookerStore(
    (state) => [state.selectedTimeslot, state.setSelectedTimeslot],
    // shallow
  );
  const [slotReservationId, setSlotReservationId] = useSlotReservationId();
  const [isPending, startTransition] = useTransition();
  const [isReserving, setIsReserving] = useState(false);
  
  // TODO: Implementar removeSelectedSlot como server action
  // const removeSelectedSlot = trpc.viewer.public.slots.removeSelectedSlotMark.useMutation({
  //   trpc: { context: { skipBatch: true } },
  // });

  const handleRemoveSlot = () => {
    if (event?.data && slotReservationId) {
      startTransition(async () => {
        try {
          await removeSelectedSlotAction({ uid: slotReservationId });
        } catch (error) {
          console.error('Erro ao remover slot:', error);
        }
      });
    }
  };
  const handleReserveSlot = () => {
    if (event?.data?.id && selectedTimeslot && (selectedDuration || event?.data?.length)) {
      const eventData = event.data;
      startTransition(async () => {
        try {
          setIsReserving(true);
          const result = await reserveSlotAction({
            slotUtcStartDate: dayjs(selectedTimeslot).utc().format(),
            eventTypeId: eventData.id,
            slotUtcEndDate: dayjs(selectedTimeslot)
              .utc()
              .add(selectedDuration || eventData.length, "minutes")
              .format(),
            bookingUid: "" // Adicione o bookingUid se necessário
          });
          setSlotReservationId(result.uid);
        } catch (error) {
          console.error('Erro ao reservar slot:', error);
        } finally {
          setIsReserving(false);
        }
      });
    }
  };

  const timeslot = useBookerStore((state) => state.selectedTimeslot);

  useEffect(() => {
    handleReserveSlot();

    const interval = setInterval(() => {
      handleReserveSlot();
    }, parseInt(MINUTES_TO_BOOK) * 60 * 1000 - 2000);

    return () => {
      handleRemoveSlot();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.data?.id, timeslot]);

  return {
    selectedTimeslot,
    setSelectedTimeslot,
    setSlotReservationId,
    slotReservationId,
    handleReserveSlot,
    handleRemoveSlot,
    isReserving,
    isPending,
  };
};
