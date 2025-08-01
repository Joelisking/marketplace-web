'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usePostVendorPaymentAccountFromApplication } from '@/lib/api/vendor/vendor';
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  Loader2,
} from 'lucide-react';

interface PaystackAccountSetupProps {
  hasPaystackAccount: boolean;
  paystackAccountCode?: string;
}

export default function PaystackAccountSetup({
  hasPaystackAccount,
  paystackAccountCode,
}: PaystackAccountSetupProps) {
  const [isCreating, setIsCreating] = useState(false);

  const createAccountMutation =
    usePostVendorPaymentAccountFromApplication({
      mutation: {
        onSuccess: () => {
          toast.success('Paystack sub-account created successfully!');
          // Refresh the page to show updated status
          window.location.reload();
        },
        onError: (error) => {
          console.error('Failed to create Paystack account:', error);
          toast.error(
            error.response?.data?.message ||
              'Failed to create Paystack sub-account. Please try again.'
          );
        },
      },
    });

  const handleCreateAccount = async () => {
    setIsCreating(true);
    try {
      await createAccountMutation.mutateAsync({ data: {} });
    } catch {
      // Error is handled by the mutation onError callback
    } finally {
      setIsCreating(false);
    }
  };

  if (hasPaystackAccount && paystackAccountCode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Paystack Account Active
          </CardTitle>
          <CardDescription>
            Your Paystack sub-account is set up and ready to receive
            payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Account Code:
              </span>
              <Badge variant="secondary" className="font-mono">
                {paystackAccountCode}
              </Badge>
            </div>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You can now receive payments from customers. All
                transactions will be automatically split between your
                account and the platform.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Setup Paystack Account
        </CardTitle>
        <CardDescription>
          Create your Paystack sub-account to start receiving payments
          from customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will create a Paystack sub-account using the bank
              information from your vendor application. You must have
              an approved application to proceed.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              What happens next:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Paystack sub-account created with your application
                data
              </li>
              <li>
                • 5% platform fee automatically deducted from sales
              </li>
              <li>
                • Remaining 95% sent directly to your bank account
              </li>
              <li>• Automatic settlement on T+1 business days</li>
            </ul>
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={isCreating || createAccountMutation.isPending}
            className="w-full">
            {isCreating || createAccountMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Create Paystack Account
              </>
            )}
          </Button>

          {createAccountMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createAccountMutation.error?.response?.data
                  ?.message ||
                  'An error occurred while creating your Paystack account. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
