import { useState } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Label } from '@/components/ui';
import { FormError } from './error';
import { DatePicker } from '@/components/ui/date-picker';
import { TheCalendarProps } from '@/components/ui/the-calendar';

interface Props extends TheCalendarProps {
  label: string;
  required?: boolean;
  errors: FieldErrors<FieldValues>;
  disabled?: { after?: Date; before?: Date };
  fromYear?: number;
  name: string;
}
export const FormDateInput = ({
  label,
  required,
  errors,
  value,
  onChange,
  disabled,
  fromYear,
  name,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <DatePicker
        open={open}
        onToggle={() => setOpen(!open)}
        value={value}
        onChange={onChange}
        minDate={
          fromYear
            ? new Date(fromYear, 0, 1)
            : disabled?.before
              ? disabled?.before
              : undefined
        }
        maxDate={disabled?.after ?? undefined}
        className={cn('', {
          'border-red-500': errors && errors.error,
        })}
      />
      <FormError errors={errors} fieldName={name} />
    </div>
  );
};
