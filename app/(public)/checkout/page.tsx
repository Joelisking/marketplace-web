'use client';

import React, { useState, useEffect } from 'react';
import { useCartContext } from '@/hooks/use-cart-context';
import { useAuth } from '@/hooks/use-auth';
import {
  Store,
  Truck,
  Shield,
  CreditCard,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckoutForm } from '@/components/ui/checkout-form';
import { AuthModal } from '@/components/ui/auth-modal';
import {
  usePostPaymentsInitialize,
  usePostPaymentsVerify,
} from '@/lib/api/payment/payment';
import { toast } from 'sonner';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, getItemCount, getSubtotal, removeFromCart } =
    useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'failed'
  >('idle');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Payment mutations
  const initializePaymentMutation = usePostPaymentsInitialize();
  const verifyPaymentMutation = usePostPaymentsVerify();

  // Calculate totals
  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₵500
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  // Simple clearCart function that removes all items
  const clearCart = async () => {
    for (const item of items) {
      await removeFromCart(item.productId);
    }
  };

  // Check for payment reference in URL params (Paystack callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const trxref = urlParams.get('trxref');

    if (reference || trxref) {
      const paymentRef = reference || trxref;
      if (paymentRef) {
        handlePaymentVerification(paymentRef);
      }
    }
  }, []);

  // Show auth modal if user is not authenticated
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated,
      itemsLength: items.length,
      showAuthModal,
    });
    if (!isAuthenticated && items.length > 0) {
      setShowAuthModal(true);
    } else if (isAuthenticated && showAuthModal) {
      // Close auth modal when user becomes authenticated
      setShowAuthModal(false);
    }
  }, [isAuthenticated, items.length, showAuthModal]);

  const handlePaymentVerification = async (reference: string) => {
    setPaymentStatus('processing');
    try {
      const response = await verifyPaymentMutation.mutateAsync({
        data: { reference },
      });

      if (response.data.status === 'success') {
        setPaymentStatus('success');
        await clearCart();
        toast.success(
          'Payment successful! Your order has been placed.'
        );
        // Redirect to payment success page
        window.location.href = '/payment-success';
      } else {
        setPaymentStatus('failed');
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error(
        'Payment verification failed. Please contact support.'
      );
      console.error('Payment verification error:', error);
    }
  };

  const handleCheckout = async (data: CheckoutFormData) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!user) {
      toast.error('Please log in to continue with checkout');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Initializing payment with amount:', total * 100);

      // Initialize payment with Paystack
      const response = await initializePaymentMutation.mutateAsync({
        data: {
          orderId: `order_${Date.now()}`, // Generate a temporary order ID
          email: data.email || (user?.email as string),
          amount: total * 100, // Convert to pesewas (Paystack expects amount in kobo)
          callbackUrl: `${window.location.origin}/payment-success`,
          metadata: {
            customerName: `${data.firstName} ${data.lastName}`,
            customerPhone: data.phone,
            shippingAddress: data.address,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product?.price || 0,
            })),
          },
        },
      });

      console.log('Payment initialization response:', response);

      // Redirect to Paystack payment page
      if (response.data.authorizationUrl) {
        console.log(
          'Redirecting to Paystack:',
          response.data.authorizationUrl
        );
        window.location.href = response.data.authorizationUrl;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Checkout error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast.success(
      'Authentication successful! You can now proceed with checkout.'
    );
    // Force a small delay to ensure auth state is updated
    setTimeout(() => {
      // The checkout form should now be accessible
    }, 100);
  };

  const handleAuthStateChange = () => {
    // Force re-evaluation of authentication state
    // This will trigger the useEffect that manages the auth modal
    setShowAuthModal(false);
  };

  // Show payment status if processing
  if (paymentStatus === 'processing') {
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

  // Show success message
  if (paymentStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive
            a confirmation email shortly.
          </p>
          <Button asChild>
            <a href="/orders">View Orders</a>
          </Button>
        </div>
      </div>
    );
  }

  // Show error message
  if (paymentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            There was an issue with your payment. Please try again or
            contact support.
          </p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">
            Add some items to your cart before checking out.
          </p>
          <Button asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                onSubmit={handleCheckout}
                isLoading={isLoading}
                defaultValues={{
                  firstName: (user?.firstName as string) || '',
                  lastName: (user?.lastName as string) || '',
                  email: (user?.email as string) || '',
                  phone: '',
                  address: '',
                  city: 'Accra',
                  state: 'Greater Accra',
                  zipCode: '',
                  country: 'Ghana',
                  deliveryZone: '',
                  deliveryInstructions: '',
                  acceptTerms: false,
                }}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {getItemCount()} item
                      {getItemCount() !== 1 ? 's' : ''}
                    </p>

                    {/* Group items by vendor */}
                    {(() => {
                      const groupedItems = items.reduce(
                        (groups, item) => {
                          const vendorName =
                            item.product?.vendorName ||
                            'Unknown Vendor';
                          if (!groups[vendorName]) {
                            groups[vendorName] = [];
                          }
                          groups[vendorName].push(item);
                          return groups;
                        },
                        {} as Record<string, typeof items>
                      );

                      return Object.entries(groupedItems).map(
                        ([vendorName, vendorItems]) => (
                          <div key={vendorName} className="space-y-2">
                            {/* Vendor Header */}
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <Store className="h-4 w-4 text-gray-500" />
                              <h4 className="text-sm font-medium text-gray-700">
                                {vendorName}
                              </h4>
                            </div>

                            {/* Vendor Items */}
                            <div className="space-y-3">
                              {vendorItems.map((item) => (
                                <div
                                  key={item.productId}
                                  className="flex items-center gap-3">
                                  {/* Product Image */}
                                  <div className="relative h-12 w-12 flex-shrink-0">
                                    <Image
                                      src={
                                        item.product?.imageUrl ||
                                        '/placeholder-product.jpg'
                                      }
                                      alt={
                                        item.product?.name ||
                                        'Product'
                                      }
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                      {item.product?.name ||
                                        `Product ${item.productId}`}
                                    </h5>
                                    <p className="text-xs text-gray-600">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>

                                  {/* Price */}
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatPrice(
                                      (item.product?.price || 0) *
                                        item.quantity
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      );
                    })()}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>

                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over ₵500</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        Pay with Paystack (Cards, Mobile Money, Bank
                        Transfer)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        onAuthStateChange={handleAuthStateChange}
      />
    </>
  );
}
