'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { ErrorResponse, isErrorResponse } from '@/lib/utils';

import {
  CreateVendorApplicationValidator,
  VendorApplicationRequestDto,
} from './types';
import {
  usePostVendorOnboardingApplication,
  useGetVendorOnboardingDocuments,
} from '@/lib/api/vendor/vendor';
import { useRouter } from 'next/navigation';
import { PostVendorOnboardingApplicationBody } from '@/lib/api/marketplaceAPI.schemas';
import VendorApplicationForm from './form';
import DocumentManager from './DocumentManager';

const Create = () => {
  const router = useRouter();

  // Get documents from the API
  const { data: documentsData } = useGetVendorOnboardingDocuments();
  const documents = documentsData?.data?.documents || [];

  const { mutateAsync: createVendorApplication } =
    usePostVendorOnboardingApplication();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<VendorApplicationRequestDto>({
    resolver: CreateVendorApplicationValidator,
    mode: 'all',
  });

  const onSubmit = async (data: VendorApplicationRequestDto) => {
    try {
      if (documents.length === 0) {
        toast.error(
          'Please upload both sides of your Ghana Card before submitting the application.'
        );
        return;
      }

      const frontDocument = documents.find((d) => d.side === 'FRONT');
      const backDocument = documents.find((d) => d.side === 'BACK');

      if (!frontDocument || !backDocument) {
        toast.error(
          'Please upload both front and back sides of your Ghana Card.'
        );
        return;
      }

      console.log('Submitting application data...');
      const applicationData = {
        businessName: data.businessName,
        businessType: data.businessType.value,
        businessDescription: data.businessDescription,
        businessAddress: data.businessAddress,
        businessPhone: data.businessPhone,
        socialMediaLinks: data.socialMediaLinks,
        ghanaCardNumber: data.ghanaCardNumber,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
        bankCode: data.bankCode,
        expectedMonthlySales: data.expectedMonthlySales.value,
        commissionRate: 5,
        productCategories: data.productCategories
          ? [data.productCategories]
          : [],
      } as PostVendorOnboardingApplicationBody;

      await createVendorApplication({
        data: applicationData,
      });

      console.log('Application submitted successfully');
      toast.success('Vendor Application created successfully');
      router.push('/vendor/dashboard');
    } catch (error) {
      console.error('Application submission failed:', error);

      let errorMessage = 'Failed to submit application';

      if (error instanceof Error) {
        if (error.message.includes('403')) {
          errorMessage =
            'Access denied. Please contact support if this issue persists.';
        } else if (error.message.includes('Network')) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      } else if (isErrorResponse(error as ErrorResponse)) {
        const errorResponse = isErrorResponse(error as ErrorResponse);
        errorMessage = errorResponse?.description || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Vendor Application
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your vendor application to start selling on our
            marketplace
          </p>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <VendorApplicationForm
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />

          <div className="mt-8">
            <DocumentManager />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={documents.length < 2}>
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default Create;
