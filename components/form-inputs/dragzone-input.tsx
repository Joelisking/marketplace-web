import { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { DropZone, Label } from '@/components/ui';
import { FormError } from './error';

interface Props {
  label: string;
  required?: boolean;
  errors: FieldErrors<FieldValues>;
  onChange: (files: FileList | null) => void;
  defaultValue: FileList | null;
  name: string;
}
export default function FormDropzoneInput({
  label,
  required,
  errors,
  defaultValue,
  onChange,
  name,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <DropZone
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <FormError errors={errors} fieldName={name} />
    </div>
  );
}
