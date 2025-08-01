'use client';

import React, { useState } from 'react';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormError } from './error';

import { Label } from '../ui/label';
import { LucideIconProps } from '../ui/icon';
import { InputTypes } from '@/lib/constants';
import { Input } from '../ui/input';

interface Props<TFieldValues extends FieldValues> {
  labelExtra?: string;
  label?: string;
  required?: boolean;
  errors: FieldErrors<TFieldValues>;
  autoFocus?: boolean;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  description?: React.ReactNode;
  suffix?: LucideIconProps;
  suffixClass?: string;
  onSuffixClick?: () => void;
  prefix?: LucideIconProps;
  prefixClass?: string;
  onPrefixClick?: () => void;
  className?: string;
  onBlur?: () => void;
}

export const FormTextInput = <TFieldValues extends FieldValues>({
  errors,
  labelExtra,
  required,
  label,
  register,
  onBlur,
  ...rest
}: Props<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = rest.type === InputTypes.PASSWORD;
  const isPasswordType = showPassword
    ? InputTypes.TEXT
    : InputTypes.PASSWORD;
  const passwordIcon = showPassword ? 'Eye' : 'EyeOff';

  const handleIsPasswordToggle = () => {
    if (!isPassword) return;
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className={cn('flex items-center gap-1')}>
          <span>{label}</span>
          {required && <span className="text-red-500"> * </span>}
        </Label>
      )}
      <div className="relative">
        <Input
          className={cn(rest.className, {
            'border-red-500': errors?.error,
          })}
          {...register}
          {...rest}
          type={showPassword ? isPasswordType : rest.type}
          onBlur={onBlur}
        />
        {isPassword && (
          <button
            type="button"
            className={cn(
              'absolute right-2 top-1/2 transform -translate-y-1/2',
              rest.suffixClass
            )}
            onClick={handleIsPasswordToggle}>
            {passwordIcon}
          </button>
        )}
        {!isPassword && rest.suffix && (
          <button
            type="button"
            className={cn(
              'absolute right-2 top-1/2 transform -translate-y-1/2',
              rest.suffixClass
            )}
            onClick={rest.onSuffixClick}>
            {rest.suffix}
          </button>
        )}
      </div>
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
};
