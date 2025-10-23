"use client";

import React, { forwardRef, useId, useState } from "react";

import { cn as classNames } from "@/utils/cn";
import { RiCloseLine } from "@remixicon/react";
import { useLocale } from "@/hooks/use-locale";
import type { InputFieldProps, InputProps } from "./form/types";
import * as BaseInput from "./input";

// Re-exported Input that now wraps Align UI input components
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { isFullWidth = true, className, ...props },
  ref
) {
  return (
    <BaseInput.Input
      ref={ref}
      className={classNames(isFullWidth && "w-full", className)}
      {...props}
    />
  );
});

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(props, ref) {
  const id = useId();
  const { t: _t, isLocaleReady } = useLocale();
  const t = props.t || _t;
  const name = props.name || "";

  const {
    label = t(name),
    labelProps,
    labelClassName,
    disabled,
    LockedIcon,
    placeholder = isLocaleReady ? t(`${name}_placeholder`) : "",
    className,
    addOnLeading,
    addOnSuffix,
    addOnFilled = true,
    addOnClassname,
    inputIsFullWidth,
    hint,
    type,
    hintErrors,
    labelSrOnly,
    noLabel,
    containerClassName,
    readOnly,
    showAsteriskIndicator,
    onClickAddon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    t: __t,
    dataTestid,
    error,
    ...passThrough
  } = props;

  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className={classNames(containerClassName)}>
      {addOnLeading || addOnSuffix ? (
        <BaseInput.Root hasError={!!error}>
          {addOnLeading && (
            <BaseInput.Affix className={classNames(addOnClassname)}>
              {addOnLeading}
            </BaseInput.Affix>
          )}
          <BaseInput.Wrapper className="px-0">
            <BaseInput.Input
              id={id}
              type={type}
              placeholder={placeholder}
              className={classNames(
                className,
                "disabled:bg-subtle disabled:hover:border-subtle disabled:cursor-not-allowed"
              )}
              {...passThrough}
              {...(type === "search" && {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setInputValue(e.target.value);
                  props.onChange && props.onChange(e);
                },
                value: inputValue,
              })}
              readOnly={readOnly}
              disabled={readOnly || disabled}
              ref={ref}
            />
            {type === "search" && inputValue?.toString().length > 0 && (
              <BaseInput.Icon
                as={RiCloseLine}
                className="cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                  setInputValue("");
                  props.onChange &&
                    props.onChange(
                      e as unknown as React.ChangeEvent<HTMLInputElement>
                    );
                }}
              />
            )}
          </BaseInput.Wrapper>
          {addOnSuffix && (
            <BaseInput.Affix
              className={classNames(addOnClassname)}
              onClick={onClickAddon}
            >
              {addOnSuffix}
            </BaseInput.Affix>
          )}
        </BaseInput.Root>
      ) : (
        <BaseInput.Root hasError={!!error}>
          <BaseInput.Wrapper>
            <BaseInput.Input
              id={id}
              type={type}
              placeholder={placeholder}
              className={classNames(
                className,
                "disabled:bg-subtle disabled:hover:border-subtle disabled:cursor-not-allowed"
              )}
              {...passThrough}
              readOnly={readOnly}
              ref={ref}
              disabled={readOnly || disabled}
            />
          </BaseInput.Wrapper>
        </BaseInput.Root>
      )}
      {hint && (
        <div className="text-default mt-2 flex items-center text-sm">{hint}</div>
      )}
    </div>
  );
});

export const TextField = forwardRef<HTMLInputElement, InputFieldProps>(function TextField(props, ref) {
  return <InputField ref={ref} {...props} />;
});
