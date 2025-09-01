"use client";

import * as React from "react";

import type { EventLocationType } from "@/core/locations";
// import { useIsPlatform } from "@/atoms/monorepo";
import { cn as classNames } from "@/utils/cn";
import { RiPhoneLine, RiMapPinLine, RiLink, RiVideoChatLine, RiMap2Line } from "@remixicon/react";

import * as Select from "@/components/align-ui/ui/select";
import { GoogleMeetIcon } from "@/modules/scheduling/services/ServiceCalendarForm";

export type LocationOption = {
  label: string;
  value: EventLocationType["type"];
  icon?: string;
  disabled?: boolean;
  address?: string;
  credentialId?: number;
  teamName?: string;
};

export type SingleValueLocationOption = LocationOption | null;

export type GroupOptionType = { label: string; options: LocationOption[] };

type LegacyReactSelectProps = {
  isSearchable?: boolean;
  menuPlacement?: string;
  components?: unknown;
  formatOptionLabel?: unknown;
  formatGroupLabel?: unknown;
};

type LocationSelectProps = LegacyReactSelectProps & {
  options: Array<GroupOptionType> | Array<LocationOption>;
  value?: SingleValueLocationOption;
  defaultValue?: SingleValueLocationOption;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
  "data-testid"?: string;
  defaultMenuIsOpen?: boolean;
  onChange?: (value: SingleValueLocationOption) => void;
};

const OptionWithIcon = ({ icon, label, value }: { icon?: string; label: string; value: string }) => {
  // const isPlatform = useIsPlatform();
  const isPlatform = false;

  // console.log('OptionWithIcon render', { icon, label, value });

  const getIconFromValue = (value: string) => {
    switch (value) {
      case "phone":
        return <RiPhoneLine name="phone" className="h-5 w-5" />;
      case "userPhone":
        return <RiPhoneLine name="phone" className="h-5 w-5" />;
      case "inPerson":
        return <RiMapPinLine name="map-pin" className="h-5 w-5" />;
      case "attendeeInPerson":
        return <RiMapPinLine name="map-pin" className="h-5 w-5" />;
      case "link":
        return <RiLink name="link" className="h-5 w-5" />;
      case "somewhereElse":
        return <RiMap2Line name="map" className="h-5 w-5" />;
      default:
        return <GoogleMeetIcon />;
    }
  };

  if (isPlatform) {
    return (
      <div className="flex items-center gap-3">
        {getIconFromValue(value)}
        <span className={classNames("")}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {icon && getIconFromValue(value)}
      <span className={classNames("")}>{label}</span>
    </div>
  );
};


export default function LocationSelect(props: LocationSelectProps) {
  // const isPlatform = useIsPlatform();
  const isPlatform = false;

  const {
    options,
    value,
    defaultValue,
    isDisabled,
    placeholder = "Select",
    className,
    name = "location",
    id = "location-select",
    "data-testid": dataTestId = "location-select",
    defaultMenuIsOpen,
    onChange,
  } = props;

  const groupedOptions = React.useMemo(() => {
    const groups: GroupOptionType[] = Array.isArray(options) && options.length > 0 && "options" in (options as any)[0]
      ? (options as GroupOptionType[])
      : [{ label: "", options: options as LocationOption[] }];
    return groups;
  }, [options]);

  const flatOptions = React.useMemo(() => groupedOptions.flatMap((g) => g.options), [groupedOptions]);
  const valueString = value?.value;
  const defaultValueString = defaultValue?.value;

  const selectedOption = React.useMemo(
    () => (valueString ? flatOptions.find((o) => o.value === valueString) || null : null),
    [flatOptions, valueString]
  );

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      const selected = flatOptions.find((o) => o.value === newValue) || null;
      onChange?.(selected);
    },
    [flatOptions, onChange]
  );
  // console.log('selectedOption.label:', selectedOption?.label)

  return (
    <Select.Root
      name={name}
      value={valueString}
      defaultValue={defaultValueString}
      onValueChange={handleValueChange}
      disabled={isDisabled}
      defaultOpen={!!defaultMenuIsOpen}
    >
      <Select.Trigger id={id}>
        {selectedOption ? (
          <div className="flex items-center gap-3 truncate">
            {/* If an external icon url is available, show it */}

            <OptionWithIcon icon={selectedOption.icon} label={selectedOption.label} value={selectedOption.value} />


            {/* <span className="truncate text-sm font-medium">{selectedOption.label}</span> */}
          </div>
        ) : (
          <span className="text-text-sub-600 text-sm truncate">{placeholder}</span>
        )}
      </Select.Trigger>

      <Select.Content>
        {groupedOptions.map((group, gi) => (
          <React.Fragment key={`g-${gi}-${group.label}`}>
            {group.label ? (
              <Select.Group>
                {/* <Select.GroupLabel className="text-default text-xs font-medium px-2 pt-2 pb-1">
                  {group.label}
                </Select.GroupLabel> */}
                {group.options.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-3" data-testid={`location-select-item-${opt.value}`}>

                      <OptionWithIcon icon={opt.icon} label={opt.label} value={opt.value} />

                      {/* <span className="text-sm font-medium">{opt.label}</span> */}
                    </div>
                  </Select.Item>
                ))}
              </Select.Group>
            ) : (
              group.options.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-3" data-testid={`location-select-item-${opt.value}`}>

                    <OptionWithIcon icon={opt.icon} label={opt.label} value={opt.value} />

                    {/* <span className="text-sm font-medium">{opt.label}</span> */}
                  </div>
                </Select.Item>
              ))
            )}
          </React.Fragment>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
