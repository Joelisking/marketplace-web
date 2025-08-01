'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormWizard } from '@/components/form-inputs/wizard';
import { InputTypes } from '@/lib/constants';

import { User, MapPin, ChevronDown, CreditCard } from 'lucide-react';
import { DELIVERY_ZONES } from '@/lib/constants';

// Zod schema for checkout form validation
const checkoutSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),

  // Shipping Address
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(3, 'Please enter a valid zip code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),

  // Delivery Zone
  deliveryZone: z.string().min(1, 'Please select a delivery zone'),

  // Additional Information
  deliveryInstructions: z.string().optional(),
  acceptTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      'You must accept the terms and conditions'
    ),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CheckoutFormData>;
}

// Custom Delivery Zone Component
interface DeliveryZoneInputProps {
  label: string;
  required?: boolean;
  errors: Record<string, { message?: string }>;
  value?: string;
  onChange: (value: string) => void;
}

function DeliveryZoneInput({
  label,
  required,
  errors,
  value,
  onChange,
}: DeliveryZoneInputProps) {
  const [isDeliveryZoneOpen, setIsDeliveryZoneOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<
    'up' | 'down'
  >('down');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDeliveryZoneOpen(false);
      }
    };

    if (isDeliveryZoneOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeliveryZoneOpen]);

  const handleDeliveryZoneToggle = () => {
    if (!isDeliveryZoneOpen) {
      // Check if there's enough space below
      const button = document.getElementById('delivery-zone-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 400; // Approximate height of dropdown

        setDropdownPosition(
          spaceBelow < dropdownHeight && spaceAbove > spaceBelow
            ? 'up'
            : 'down'
        );
      }
    }
    setIsDeliveryZoneOpen(!isDeliveryZoneOpen);
  };

  return (
    <div>
      <Label htmlFor="deliveryZone">
        {label} {required && '*'}
      </Label>
      <div className="relative" ref={dropdownRef}>
        <button
          id="delivery-zone-button"
          type="button"
          onClick={handleDeliveryZoneToggle}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <span
            className={
              value ? 'text-foreground' : 'text-muted-foreground'
            }>
            {value
              ? DELIVERY_ZONES.find((z) => z.id === value)?.name ||
                'Select your delivery zone'
              : 'Select your delivery zone'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {isDeliveryZoneOpen && (
          <div
            className={`absolute z-50 w-full max-h-96 overflow-auto rounded-md border bg-popover shadow-md ${
              dropdownPosition === 'up'
                ? 'bottom-full mb-1'
                : 'top-full mt-1'
            }`}>
            {DELIVERY_ZONES.map((zone) => (
              <div key={zone.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => {
                    onChange(zone.id);
                    setIsDeliveryZoneOpen(false);
                  }}
                  className="w-full px-3 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="font-medium text-sm">
                    {zone.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">
                      Areas covered:
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {zone.locations.map((location, index) => (
                      <span key={location}>
                        {location}
                        {index < zone.locations.length - 1
                          ? ', '
                          : ''}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {errors?.deliveryZone && (
        <p className="text-red-500 text-sm mt-1">
          {errors.deliveryZone.message}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: CheckoutFormProps) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ghana',
      deliveryZone: '',
      deliveryInstructions: '',
      acceptTerms: false,
      ...defaultValues,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Please provide your contact details for order confirmation
            and delivery
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormWizard
              config={[
                {
                  type: InputTypes.TEXT,
                  label: 'First Name',
                  required: true,
                  register: form.register('firstName'),
                  errors,
                  placeholder: 'Enter your first name',
                },
                {
                  type: InputTypes.TEXT,
                  label: 'Last Name',
                  required: true,
                  register: form.register('lastName'),
                  errors,
                  placeholder: 'Enter your last name',
                },
              ]}
            />
          </div>

          <div className="mt-4 space-y-4">
            <FormWizard
              config={[
                {
                  type: InputTypes.EMAIL,
                  label: 'Email Address',
                  required: true,
                  register: form.register('email'),
                  errors,
                  placeholder: 'Enter your email address',
                },
              ]}
            />

            <FormWizard
              config={[
                {
                  type: InputTypes.TEXT,
                  label: 'Phone Number',
                  required: true,
                  register: form.register('phone'),
                  errors,
                  placeholder: 'Enter your phone number',
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Where should we deliver your order?
          </p>

          <div className="space-y-4">
            <FormWizard
              config={[
                {
                  type: InputTypes.TEXTAREA,
                  label: 'Address',
                  required: true,
                  register: form.register('address'),
                  errors,
                  placeholder: 'Enter your full address',
                  rows: 3,
                },
              ]}
            />

            <div className="">
              <FormWizard
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                config={[
                  {
                    type: InputTypes.TEXT,
                    label: 'City',
                    required: true,
                    register: form.register('city'),
                    errors,
                    placeholder: 'Enter your city',
                  },
                  {
                    type: InputTypes.TEXT,
                    label: 'State/Region',
                    required: true,
                    register: form.register('state'),
                    errors,
                    placeholder: 'Enter your state or region',
                  },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormWizard
                config={[
                  {
                    type: InputTypes.TEXT,
                    label: 'ZIP Code',
                    required: true,
                    register: form.register('zipCode'),
                    errors,
                    placeholder: 'Enter your ZIP code',
                  },
                  {
                    type: InputTypes.TEXT,
                    label: 'Country',
                    required: true,
                    register: form.register('country'),
                    errors,
                    placeholder: 'Enter your country',
                  },
                ]}
              />
            </div>

            {/* Custom Delivery Zone */}
            <DeliveryZoneInput
              label="Delivery Zone"
              required={true}
              errors={errors}
              value={watch('deliveryZone')}
              onChange={(value) => setValue('deliveryZone', value)}
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...form.register('acceptTerms')}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-sm">
                    <Label
                      htmlFor="acceptTerms"
                      className="font-medium">
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-gray-600 mt-1">
                      By placing this order, you agree to our terms of
                      service and privacy policy.
                    </p>
                  </div>
                </div>
                {errors?.acceptTerms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          {errors?.acceptTerms && (
            <p className="text-red-500 text-sm mt-1">
              {errors.acceptTerms.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="px-8">
          <CreditCard className="h-4 w-4 mr-2" />
          {isLoading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
}
