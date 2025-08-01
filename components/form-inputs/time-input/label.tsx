import React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { Input, Label, LucideIconProps } from '@/components/ui';
import { cn } from '@/lib/utils';

import { FormError } from '../error';

interface Props {
  errors: FieldErrors<FieldValues>;
  className?: string;
  label?: string;
  required?: boolean;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange: (option: string | undefined) => void;
  placeholder?: string;
  suffix: LucideIconProps;
  name: string;
}

export const LabelInput = ({
  className,
  errors,
  label,
  required,
  onChange,
  suffix,
  value, // explicitly extract value
  // defaultValue, // extract defaultValue if needed
  ...rest
}: Props) => {
  // Ensure value is controlled by falling back to an empty string if undefined
  const effectiveValue = value !== undefined ? value : '';

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <Input
        className={cn(className, {
          'border-red-500': errors?.error,
        })}
        {...rest}
        value={effectiveValue}
        onChange={(e) => onChange(e.target.value)}
        readOnly={true}
        {...(suffix && { suffix })}
      />

      <FormError errors={errors} fieldName={rest.name} />
    </div>
  );
};
