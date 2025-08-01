import React, { useEffect, useState } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Label } from '@/components/ui';
import { SpecialSelect } from '@/components/ui/special-select';
import { FormError } from './error';
import { Option } from '@/lib/constants';

interface Props {
  autoFocus?: boolean;
  label: string;
  required?: boolean;
  errors: FieldErrors<FieldValues>;
  name: string;
  options: Option[];
  defaultValue?: Option;
  placeholder?: string;
  onChange: (option: Option) => void;
  searchPlaceholder?: string;
  value: Option;
}

export const FormSpecialSelect = ({
  label,
  required,
  errors,
  options,
  defaultValue,
  onChange,
  placeholder,
  value: propValue,
  searchPlaceholder,
  name,
}: Props) => {
  const [value, setValue] = useState<Option | undefined>(
    defaultValue || propValue
  );

  // Fix: Compare by value property instead of object reference
  useEffect(() => {
    if (propValue?.value !== value?.value) {
      setValue(propValue);
    }
  }, [propValue?.value, value?.value]); // Only depend on the actual value, not the object

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <SpecialSelect
        onChange={(option) => {
          onChange(option);
          setValue(option);
        }}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        options={options}
        searchPlaceholder={searchPlaceholder}
        className={cn('border-neutral-300 text-sm hover:ring-0', {
          'border-danger-500': errors && errors.error,
        })}
      />

      <FormError errors={errors} fieldName={name} />
    </div>
  );
};
