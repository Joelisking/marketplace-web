import { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Label, RadioGroup, RadioGroupItem } from '@/components/ui';
import { FormError } from './error';
import { Option } from '@/lib/constants';

interface Props {
  autoFocus?: boolean;
  label: string;
  required?: boolean;
  errors: FieldErrors<FieldValues>;
  defaultValue?: string | undefined;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  name: string;
}

export const FormRadioInput = ({
  label,
  required,
  errors,
  onChange,
  defaultValue,
  options,
  disabled,
  name,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <RadioGroup
        name={name}
        disabled={disabled}
        onValueChange={onChange}
        defaultValue={defaultValue?.toString()}
        className="flex flex-col items-start gap-6 py-1 lg:flex-row">
        {options?.map((item: Option, key: number) => (
          <div className="flex items-center space-x-2" key={key}>
            <RadioGroupItem
              checked={
                item.value.toString() === defaultValue?.toString()
              }
              value={item.value}
              id={'option-' + (key + 1)}
            />
            <Label
              className="text-base"
              htmlFor={'option-' + (key + 1)}>
              {item?.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <FormError errors={errors} fieldName={name} />
    </div>
  );
};
