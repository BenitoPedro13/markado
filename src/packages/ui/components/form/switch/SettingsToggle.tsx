import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ReactNode } from "react";

import { cn as classNames } from "@/utils/cn";

import * as Label from '@/components/align-ui/ui/label';
import * as Switch from "@/components/align-ui/ui/switch";

type Props = {
  children?: ReactNode;
  title: string;
  description?: string | React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  LockedIcon?: React.ReactNode;
  Badge?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  "data-testid"?: string;
  tooltip?: string;
  toggleSwitchAtTheEnd?: boolean;
  childrenClassName?: string;
  switchContainerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

function SettingsToggle({
  checked,
  onCheckedChange,
  description,
  LockedIcon,
  Badge,
  title,
  children,
  disabled,
  tooltip,
  toggleSwitchAtTheEnd = false,
  childrenClassName,
  switchContainerClassName,
  labelClassName,
  descriptionClassName,
  ...rest
}: Props) {
  const [animateRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <>
      <div className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <fieldset className="block w-full flex-col sm:flex">
          {toggleSwitchAtTheEnd ? (
            <div
              className={classNames(
                'border-subtle flex justify-between space-x-3 rounded-lg',
                checked && children && 'rounded-b-none',
                switchContainerClassName
              )}
            >
              <div>
                <div
                  className="flex items-center gap-x-2"
                  data-testid={`${rest['data-testid']}-title`}
                >
                  <Label.Root
                    className={classNames(
                      'mt-0.5 text-text-strong-950 text-label-sm',
                      labelClassName
                    )}
                    // htmlFor=""
                  >
                    {title}
                    {LockedIcon}
                  </Label.Root>
                  {Badge && <div className="mb-2">{Badge}</div>}
                </div>
                {description && (
                  <p
                    className={classNames(
                      'text-default -mt-1.5 text-sm leading-normal',
                      descriptionClassName
                    )}
                    data-testid={`${rest['data-testid']}-description`}
                  >
                    {description}
                  </p>
                )}
              </div>
              <div className="my-auto h-full">
                <Switch.Root
                  // data-testid={rest["data-testid"]}
                  // fitToHeight={true}
                  checked={checked}
                  onCheckedChange={onCheckedChange}
                  disabled={disabled}
                  // tooltip={tooltip}
                />
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Switch.Root
                // data-testid={rest['data-testid']}
                // fitToHeight={true}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                // tooltip={tooltip}
              />

              <div>
                <Label.Root
                  className={classNames(
                    'text-text-strong-950 text-label-sm',
                    labelClassName
                  )}
                >
                  {title}
                  {LockedIcon}
                </Label.Root>
                {description && (
                  <p className="text-text-strong-950 text-label-sm -mt-1.5">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}
          {children && (
            <div
              className={classNames('lg:ml-14', childrenClassName)}
              ref={animateRef}
            >
              {checked && (
                <div className={classNames(!toggleSwitchAtTheEnd && 'mt-4')}>
                  {children}
                </div>
              )}
            </div>
          )}
        </fieldset>
      </div>
    </>
  );
}

export default SettingsToggle;
