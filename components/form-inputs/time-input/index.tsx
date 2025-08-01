import React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { TimeType } from '@/lib/constants';

import { LabelInput } from './label';
import { MomentInput } from './moment';
import { TimeInput } from './time';

interface Props {
  label: string;
  required?: boolean;
  errors: FieldErrors<FieldValues>;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange: (option: string | undefined) => void;
  placeholder?: string;
  type: TimeType;
  name: string;
}
export const FormClockInput = ({
  label,
  required,
  errors,
  value,
  defaultValue,
  onChange,
  placeholder,
  type,
  name,
}: Props) => {
  // Ensure value is controlled by falling back to an empty string if undefined
  const effectiveValue = value !== undefined ? value : '';

  return (
    <Popover>
      <PopoverTrigger className="w-full p-0 py-0">
        <LabelInput
          required={required}
          value={effectiveValue}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          errors={errors}
          placeholder={placeholder}
          label={label}
          className="cursor-pointer bg-white text-neutral-secondary"
          suffix={type === TimeType.Moment ? 'Watch' : 'Clock'}
        />
      </PopoverTrigger>
      <PopoverContent
        onWheel={(event) => event.stopPropagation()}
        align="start"
        className="relative w-80 space-y-4 overflow-hidden px-6 py-5">
        {type === TimeType.Moment ? (
          <MomentInput onChange={onChange} />
        ) : (
          <TimeInput onChange={onChange} />
        )}
      </PopoverContent>
    </Popover>
  );
};
