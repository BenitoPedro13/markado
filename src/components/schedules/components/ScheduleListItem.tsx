import Link from "next/link";
import { Fragment } from "react";

import { availabilityAsString } from "@/lib/availability";
import { useLocale } from "@/hooks/use-locale";
import { sortAvailabilityStrings } from "@/lib/weekstart";
// import type { RouterOutputs } from "@/trpc/react";
// import { trpc } from "@/trpc/react";
import { Root as Badge } from "@/components/align-ui/ui/badge";
import { Root as Button, Icon as ButtonIcon } from "@/components/align-ui/ui/button";
import { 
  Root as Dropdown, 
  Trigger as DropdownMenuTrigger, 
  Content as DropdownMenuContent, 
  Item as DropdownMenuItem,
  ItemIcon as DropdownItemIcon
} from "@/components/align-ui/ui/dropdown";
import { useNotification } from "@/hooks/use-notification";
import { useTRPC } from "@/utils/trpc";
import { RiStarLine, RiFileCopyLine, RiDeleteBinLine, RiGlobalLine, RiMoreLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/trpc/server";

export function ScheduleListItem({
  schedule,
  deleteFunction,
  displayOptions,
  updateDefault,
  isDeletable,
  duplicateFunction,
}: {
  schedule: inferRouterOutputs<AppRouter>['availability']['getAll'][number]['schedule'];
  deleteFunction: ({ scheduleId }: { scheduleId: number }) => void;
  displayOptions?: {
    timeZone?: string;
    hour12?: boolean;
    weekStart?: string;
  };
  isDeletable: boolean;
  updateDefault: ({ scheduleId, isDefault }: { scheduleId: number; isDefault: boolean }) => void;
  duplicateFunction: ({ scheduleId }: { scheduleId: number }) => void;
}) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.me.queryOptions());
  const {t, locale, isLocaleReady} = useLocale('Schedules');
  const { notification } = useNotification();

  if (!schedule || !user) {
    return null;
  }

  const { data, isPending } = useQuery(trpc.schedule.getById.queryOptions({ id: schedule.id }));

  if (!data) {
    return null;
  }

  return (
    <li key={schedule.id}>
      <div className="hover:bg-muted flex items-center justify-between py-5 transition ltr:pl-4 rtl:pr-4 sm:ltr:pl-0 sm:rtl:pr-0">
        <div className="group flex w-full items-center justify-between sm:px-6">
          <Link
            href={`/availability/${schedule.id}`}
            className="flex-grow truncate text-sm"
            title={schedule.name}>
            <div className="space-x-2 rtl:space-x-reverse">
              <span className="text-emphasis truncate font-medium">{schedule.name}</span>
              {schedule.id === user.defaultScheduleId && (
                <Badge variant="filled" color="green" className="text-xs">
                  {t("default")}
                </Badge>
              )}
            </div>
            <p className="text-subtle mt-1">
              {schedule.availability
                .filter((availability) => !!availability.days.length)
                .map((availability) =>
                  availabilityAsString(availability, {
                    locale: isLocaleReady ? locale : 'pt',
                    hour12: displayOptions?.hour12,
                  })
                )
                // sort the availability strings as per user's weekstart (settings)
                .sort(sortAvailabilityStrings(isLocaleReady ? locale : 'pt', displayOptions?.weekStart))
                .map((availabilityString, index) => (
                  <Fragment key={index}>
                    {availabilityString}
                    <br />
                  </Fragment>
                ))}
              {(schedule.timeZone || displayOptions?.timeZone) && (
                <p className="my-1 flex items-center first-letter:text-xs">
                  <RiGlobalLine className="h-3.5 w-3.5" />
                  &nbsp;{schedule.timeZone ?? displayOptions?.timeZone}
                </p>
              )}
            </p>
          </Link>
        </div>
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="schedule-more"
              className="mx-5"
              type="button"
              variant="neutral"
              mode="ghost"
            >
              <ButtonIcon as={RiMoreLine} />
            </Button>
          </DropdownMenuTrigger>
          {!isPending && data && (
            <DropdownMenuContent>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                {schedule.id !== user.defaultScheduleId && (
                  <DropdownMenuItem
                    onClick={() => {
                      updateDefault({
                        scheduleId: schedule.id,
                        isDefault: true,
                      });
                    }}>
                    <DropdownItemIcon as={RiStarLine} />
                    {t("set_as_default")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownMenuItem
                  data-testid={`schedule-duplicate${schedule.id}`}
                  onClick={() => {
                    duplicateFunction({
                      scheduleId: schedule.id,
                    });
                  }}>
                  <DropdownItemIcon as={RiFileCopyLine} />
                  {t("duplicate")}
                </DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                <DropdownMenuItem
                  data-testid="delete-schedule"
                  onClick={() => {
                    if (!isDeletable) {
                      notification({
                        title: t("requires_at_least_one_schedule"),
                        variant: "filled",
                        color: "red"
                      });
                    } else {
                      deleteFunction({
                        scheduleId: schedule.id,
                      });
                    }
                  }}>
                  <DropdownItemIcon as={RiDeleteBinLine} />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </Dropdown>
      </div>
    </li>
  );
}
