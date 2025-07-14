import {cn as cx} from "@/utils/cn";

import { Input } from "../components/form/inputs/TextField";
// import { Icon } from "../components/icon";
import { RiMapPinLine } from '@remixicon/react';

export type AddressInputProps = {
  value: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (val: string) => void;
  className?: string;
};

function AddressInput({ value, onChange, ...rest }: AddressInputProps) {
  return (
    <div className="relative flex items-center">
      <RiMapPinLine
        className="text-muted absolute left-0.5 ml-3 h-4 w-4 -translate-y-1/2"
        style={{top: '44%'}}
      />
      <Input
        {...rest}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        className={cx('pl-10', rest?.className)}
      />
    </div>
  );
}

export default AddressInput;
