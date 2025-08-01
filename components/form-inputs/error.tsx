/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { ErrorProps } from './types';

// Provide a default value for TFieldValues if not passed
type Props<TFieldValues extends FieldValues = Record<string, any>> = {
  errors: FieldErrors<TFieldValues>;
  fieldName: keyof TFieldValues; // Expecting a field name
};

export const FormError = <TFieldValues extends Record<string, any>>({
  errors,
  fieldName,
}: Props<TFieldValues>): JSX.Element | null => {
  // Get the field error based on the field name
  const fieldError =
    errors[fieldName] ?? inlineGetError(errors, fieldName as string);

  // Ensure that message is a string or default to an empty string
  const errorProps: ErrorProps = {
    error: !!fieldError, // Determine if there's an error
    message:
      (fieldError?.message as string) ??
      fieldError?.value?.message ??
      '', // Default to empty string if no message
  };

  return errorProps.error ? (
    <p
      className={cn(
        'text-[0.8rem] font-medium text-red-600 dark:text-red-900'
      )}>
      {errorProps.message}
    </p>
  ) : null;
};

function inlineGetError(
  errors: FieldErrors<FieldValues>,
  path: string
) {
  return path
    .split('.')
    .reduce((acc: any, key) => acc?.[key], errors);
}
