import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const CreateVendorApplicationSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: 'Business Name is required' }),
  businessType: z.object(
    {
      value: z
        .string()
        .min(1, { message: 'Business Type is required' }),
      label: z.string(),
    },
    {
      message: 'Business Type is required',
    }
  ),
  businessDescription: z
    .string()
    .min(10, { message: 'Business Description is required' }),
  businessAddress: z
    .string()
    .min(10, { message: 'Business Address is required' }),
  businessPhone: z
    .string()
    .min(10, { message: 'Business Phone is required' }),
  taxIdentification: z
    .string()
    .min(1, { message: 'Tax Identification Number is required' }),
  ghanaCardNumber: z
    .string()
    .min(1, { message: 'Ghana Card Number is required' }),
  // Remove Ghana Card URL fields - these will be handled via documents endpoint
  // ghanaCardFront: z.string().min(1, { message: 'Ghana Card Front is required' }),
  // ghanaCardBack: z.string().min(1, { message: 'Ghana Card Back is required' }),

  bankName: z.string().min(2, { message: 'Bank Name is required' }),
  bankAccountNumber: z
    .string()
    .min(10, { message: 'Bank Account Number is required' }),
  bankAccountName: z
    .string()
    .min(2, { message: 'Bank Account Name is required' }),
  bankCode: z.string().min(3, { message: 'Bank Code is required' }),
  expectedMonthlySales: z.object(
    {
      value: z
        .string()
        .min(1, { message: 'Expected Monthly Sales is required' }),
      label: z.string(),
    },
    {
      message: 'Expected Monthly Sales is required',
    }
  ),
  productCategories: z
    .string()
    .min(1, { message: 'Product Categories is required' }),
  socialMediaLinks: z
    .object({
      facebook: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type VendorApplicationRequestDto = z.infer<
  typeof CreateVendorApplicationSchema
>;

export const CreateVendorApplicationValidator = zodResolver(
  CreateVendorApplicationSchema
);
