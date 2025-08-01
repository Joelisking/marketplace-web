'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { usePostPaymentsVerify } from '@/lib/api/payment/payment';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    'success' | 'failed' | 'pending'
  >('pending');

  const verifyPaymentMutation = usePostPaymentsVerify();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    if (reference || trxref) {
      const paymentRef = reference || trxref;
      if (paymentRef) {
        verifyPayment(paymentRef);
      } else {
        setIsVerifying(false);
        setVerificationStatus('failed');
      }
    } else {
      setIsVerifying(false);
      setVerificationStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await verifyPaymentMutation.mutateAsync({
        data: { reference },
      });

      if (response.data.status === 'success') {
        setVerificationStatus('success');
        toast.success('Payment verified successfully!');
      } else {
        setVerificationStatus('failed');
        toast.error('Payment verification failed.');
      }
    } catch (error) {
      setVerificationStatus('failed');
      toast.error(
        'Payment verification failed. Please contact support.'
      );
      console.error('Payment verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            There was an issue verifying your payment. Please contact
            support if you believe this is an error.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Thank you for your purchase! Your order has been placed
              successfully and you will receive a confirmation email
              shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • You&apos;ll receive an order confirmation email
                </li>
                <li>• Vendors will process your order</li>
                <li>
                  • You&apos;ll be notified when your order ships
                </li>
                <li>• Track your order status in your account</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="flex items-center gap-2">
                <Link href="/orders">
                  View My Orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we load the payment details...
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
