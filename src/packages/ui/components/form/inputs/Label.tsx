import { cn as classNames } from "@/utils/cn";
import { JSX } from "react";

export function Label(props: JSX.IntrinsicElements["label"]) {
  const { className, ...restProps } = props;
  return (
    <label
      className={classNames(
        "text-default text-strong-950 mb-2 block text-sm font-medium leading-none",
        className
      )}
      {...restProps}>
      {props.children}
    </label>
  );
}
