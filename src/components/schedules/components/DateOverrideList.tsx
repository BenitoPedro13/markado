import { useLocale } from "@/hooks/use-locale";
import type { TimeRange, WorkingHours } from "@/types/scheadule";
import * as Button from "@/components/align-ui/ui/button";
import * as Modal from "@/components/align-ui/ui/modal";
import * as Tooltip from "@/components/align-ui/ui/tooltip";
import { RiPencilLine, RiDeleteBin2Line } from "@remixicon/react";

import DateOverrideInputDialog from "./DateOverrideInputDialog";

const sortByDate = (a: { ranges: TimeRange[]; id: string }, b: { ranges: TimeRange[]; id: string }) => {
  return a.ranges[0].start > b.ranges[0].start ? 1 : -1;
};

// I would like this to be decoupled, but RHF really doesn't support this.
const DateOverrideList = ({
  workingHours,
  excludedDates = [],
  userTimeFormat,
  hour12,
  replace,
  fields,
  weekStart = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replace: any;
  fields: { ranges: TimeRange[]; id: string }[];
  workingHours: WorkingHours[];
  excludedDates?: string[];
  userTimeFormat: number | null;
  hour12: boolean;
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const { t, locale } = useLocale();

  const unsortedFieldArrayMap = fields.reduce(
    (map: { [id: string]: number }, { id }, index) => ({ ...map, [id]: index }),
    {}
  );

  if (!fields.length) {
    return <></>;
  }

  const timeSpan = ({ start, end }: TimeRange) => {
    return `${new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric", hour12 }).format(
      new Date(start.toISOString().slice(0, -1))
    )} - ${new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric", hour12 }).format(
      new Date(end.toISOString().slice(0, -1))
    )}`;
  };

  return (
    <ul className="border-subtle rounded border" data-testid="date-overrides-list">
      {fields.sort(sortByDate).map((item) => (
        <li key={item.id} className="border-subtle flex justify-between border-b px-5 py-4 last:border-b-0">
          <div>
            <h3 className="text-emphasis text-sm">
              {new Intl.DateTimeFormat(locale, {
                weekday: "long",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }).format(item.ranges[0].start)}
            </h3>
            {item.ranges[0].start.valueOf() - item.ranges[0].end.valueOf() === 0 ? (
              <p className="text-subtle text-xs">{t("unavailable")}</p>
            ) : (
              item.ranges.map((range, i) => (
                <p key={i} className="text-subtle text-xs">
                  {timeSpan(range)}
                </p>
              ))
            )}
          </div>
          <div className="flex flex-row-reverse gap-5 space-x-2 rtl:space-x-reverse">
            <DateOverrideInputDialog
              userTimeFormat={userTimeFormat}
              excludedDates={excludedDates}
              workingHours={workingHours}
              value={item.ranges}
              weekStart={weekStart}
              onChange={(ranges) => {
                // update has very weird side-effects with sorting.
                replace([...fields.filter((currentItem) => currentItem.id !== item.id), { ranges }]);
                delete unsortedFieldArrayMap[item.id];
              }}
              Trigger={
                <Modal.Trigger asChild>
                  <Button.Root
                    className="text-default"
                    variant="neutral"
                    mode="ghost"
                    size="small"
                  >
                    <Button.Icon as={RiPencilLine} />
                  </Button.Root>
                </Modal.Trigger>
              }
            />
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button.Root
                  className="text-default"
                  data-testid="delete-button"
                  title={t("date_overrides_delete_on_date", {
                    date: new Intl.DateTimeFormat(locale, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    }).format(item.ranges[0].start),
                  })}
                  variant="error"
                  mode="ghost"
                  size="small"
                  onClick={() => {
                    replace([...fields.filter((currentItem) => currentItem.id !== item.id)]);
                  }}
                >
                  <Button.Icon as={RiDeleteBin2Line} />
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>Delete</Tooltip.Content>
            </Tooltip.Root>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DateOverrideList;
