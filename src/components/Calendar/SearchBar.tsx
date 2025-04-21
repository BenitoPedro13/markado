import React, { forwardRef } from 'react';
import * as Input from '@/components/align-ui/ui/input';
import { RiSearchLine } from '@remixicon/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = 'Search...', className = '' }, ref) => {
    return (
      <div className={`relative ${className}`}>
        <Input.Root>
          <Input.Icon>
            <RiSearchLine className="size-4" />
          </Input.Icon>
          <Input.Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
        </Input.Root>
      </div>
    );
  }
); 