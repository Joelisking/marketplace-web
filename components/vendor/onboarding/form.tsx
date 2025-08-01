import React, { useState } from 'react';
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import { FormWizard } from '@/components/form-inputs';
import { InputTypes } from '@/lib/constants';
import { BusinessType, ExpectedMonthlySales } from '@/lib/enum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import BankInformationForm from './BankInformationForm';

interface Props<TFieldValues extends FieldValues, TContext> {
  control: Control<TFieldValues, TContext>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  setValue: (name: Path<TFieldValues>, value: unknown) => void;
  watch: (name: Path<TFieldValues>) => unknown;
  defaultValues?: TFieldValues;
}

const VendorApplicationForm = <
  TFieldValues extends FieldValues,
  TContext,
>({
  control,
  register,
  errors,
  setValue,
  watch,
}: Props<TFieldValues, TContext>) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [stepKey, setStepKey] = useState(1);

  const businessTypeOptions = Object.entries(BusinessType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      label: key,
      value: String(value),
    }));

  const steps = [
    {
      title: 'Business Information',
      description: 'Enter your business details',
      content: (
        <div className="space-y-6" key="business-info">
          <FormWizard
            key="business-form"
            className="w-full"
            config={[
              {
                label: 'Business Name',
                type: InputTypes.TEXT,
                register: register(
                  'businessName' as Path<TFieldValues>
                ),
                required: true,
                errors,
              },
              {
                label: 'Business Type',
                type: InputTypes.SELECT,
                control: control as unknown as Control<FieldValues>,
                name: 'businessType',
                required: true,
                options: businessTypeOptions,
                errors,
              },
              {
                label: 'Business Description',
                type: InputTypes.TEXTAREA,
                register: register(
                  'businessDescription' as Path<TFieldValues>
                ),
                required: true,
                errors,
              },
              {
                label: 'Business Address',
                type: InputTypes.TEXT,
                register: register(
                  'businessAddress' as Path<TFieldValues>
                ),
                required: true,
                errors,
              },
              {
                label: 'Business Phone',
                type: InputTypes.TEXT,
                register: register(
                  'businessPhone' as Path<TFieldValues>
                ),
                required: true,
                errors,
              },
              {
                label: 'Tax Identification',
                type: InputTypes.TEXT,
                register: register(
                  'taxIdentification' as Path<TFieldValues>
                ),
                errors,
              },
              {
                label: 'Ghana Card Number',
                type: InputTypes.TEXT,
                register: register(
                  'ghanaCardNumber' as Path<TFieldValues>
                ),
                required: true,
                errors,
              },
            ]}
          />
        </div>
      ),
    },

    {
      title: 'Bank Information',
      description: 'Enter your bank account details',
      content: (
        <div className="space-y-6" key="bank-info">
          <BankInformationForm
            errors={errors}
            register={register}
            control={control}
            setValue={setValue}
            watch={watch}
          />
        </div>
      ),
    },
    {
      title: 'Additional Information',
      description: 'Complete your application',
      content: (
        <div className="space-y-6" key="additional-info">
          <FormWizard
            key="additional-form"
            className="w-full"
            config={[
              {
                label: 'Expected Monthly Sales',
                type: InputTypes.SELECT,
                control: control as unknown as Control<FieldValues>,
                name: 'expectedMonthlySales',
                required: true,
                options: Object.values(ExpectedMonthlySales).map(
                  (type) => {
                    return {
                      label: type,
                      value: type,
                    };
                  }
                ),
                errors,
              },
              {
                label: 'Product Categories',
                type: InputTypes.TEXT,
                register: register(
                  'productCategories' as Path<TFieldValues>
                ),
                errors,
                className: 'product-categories-field',
              },
              // Social Media Links
              {
                label: 'Facebook',
                type: InputTypes.TEXT,
                register: register(
                  'socialMediaLinks.facebook' as Path<TFieldValues>
                ),
                errors,
              },
              {
                label: 'Instagram',
                type: InputTypes.TEXT,
                register: register(
                  'socialMediaLinks.instagram' as Path<TFieldValues>
                ),
                errors,
              },
              {
                label: 'Twitter',
                type: InputTypes.TEXT,
                register: register(
                  'socialMediaLinks.twitter' as Path<TFieldValues>
                ),
                errors,
              },
              {
                label: 'LinkedIn',
                type: InputTypes.TEXT,
                register: register(
                  'socialMediaLinks.linkedin' as Path<TFieldValues>
                ),
                errors,
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setStepKey(stepKey + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStepKey(stepKey + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2',
                  currentStep > index + 1
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === index + 1
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                )}>
                {currentStep > index + 1 ? (
                  <Icon name="Check" className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2',
                    currentStep > index + 1
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <div key={`step-${currentStep}-${stepKey}`}>
            {steps[currentStep - 1].content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}>
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={nextStep}
            className="ml-auto">
            Next
            <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" className="ml-auto">
            Submit Application
            <Icon name="Send" className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VendorApplicationForm;
