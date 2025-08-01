/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import {
  FieldErrors,
  UseFormRegister,
  Control,
  Path,
  FieldValues,
} from 'react-hook-form';
import { FormWizard } from '@/components/form-inputs';
import { InputTypes } from '@/lib/constants';
import BankSelector from './BankSelector';

interface BankInformationFormProps<TFieldValues extends FieldValues> {
  errors: FieldErrors<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  setValue: (name: Path<TFieldValues>, value: any) => void;
  watch: (name: Path<TFieldValues>) => any;
}

const BankInformationForm = <TFieldValues extends FieldValues>({
  errors,
  register,
  setValue,
  watch,
}: BankInformationFormProps<TFieldValues>) => {
  const accountNumber = watch(
    'bankAccountNumber' as Path<TFieldValues>
  );
  const bankCode = watch('bankCode' as Path<TFieldValues>);

  const handleBankSelect = (bankCode: string, bankName: string) => {
    setValue('bankCode' as Path<TFieldValues>, bankCode);
    setValue('bankName' as Path<TFieldValues>, bankName);
  };

  const handleAccountVerification = (accountName: string) => {
    setValue('bankAccountName' as Path<TFieldValues>, accountName);
  };

  const handleAccountNumberBlur = () => {
    // Trigger verification when account number input loses focus
    if (
      bankCode &&
      accountNumber &&
      accountNumber.trim().length > 0
    ) {
      // The verification will be handled by the BankSelector component
      // We just need to trigger it by updating the accountNumber prop
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank *
          </label>
          <BankSelector
            value={bankCode}
            onBankSelect={handleBankSelect}
            onAccountVerification={handleAccountVerification}
            accountNumber={accountNumber}
          />
          {errors.bankCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bankCode.message as string}
            </p>
          )}
        </div>

        <FormWizard
          className="w-full"
          config={[
            {
              label: 'Bank Account Number',
              type: InputTypes.TEXT,
              register: register(
                'bankAccountNumber' as Path<TFieldValues>
              ),
              required: true,
              errors,
              className: 'bank-account-number-field',
              placeholder: 'Enter account number',
              onBlur: handleAccountNumberBlur,
            },
            {
              label: 'Bank Account Name',
              type: InputTypes.TEXT,
              register: register(
                'bankAccountName' as Path<TFieldValues>
              ),
              required: true,
              errors,
              placeholder:
                'Account name will be auto-filled after verification',
              readOnly: true,
            },
          ]}
        />
      </div>

      {/* Hidden fields for form submission */}
      <input
        type="hidden"
        {...register('bankCode' as Path<TFieldValues>)}
      />
      <input
        type="hidden"
        {...register('bankName' as Path<TFieldValues>)}
      />
    </div>
  );
};

export default BankInformationForm;
