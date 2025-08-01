import {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormError } from '.';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface FormInputProps<TFieldValues extends FieldValues> {
  autoFocus?: boolean;
  readOnly?: boolean;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  errors: FieldErrors<TFieldValues>;
  register?: UseFormRegisterReturn;
  labelExtra?: React.ReactNode;
  description?: React.ReactNode;
  rows?: number;
}
export function FormTextareaInput<TFieldValues extends FieldValues>({
  label,
  required,
  errors,
  autoFocus,
  register,
  labelExtra,
  readOnly,
  placeholder,
  // type,
  // description,
  rows,
  ...rest
}: FormInputProps<TFieldValues>) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <Textarea
        autoFocus={autoFocus}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={rows || 3}
        {...register}
        className={cn('', {
          'border-danger-500': errors?.error,
        })}
        {...rest}
      />
      <div className="w-full">
        {labelExtra && (
          <p className={cn('text-[0.8rem] text-neutral-secondary')}>
            {labelExtra}
          </p>
        )}
        <FormError
          errors={errors}
          fieldName={register?.name as keyof TFieldValues}
        />
      </div>
    </div>
  );
}
