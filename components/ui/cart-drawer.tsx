'use client';

import React, { useState } from 'react';
import { useCartContext } from '@/hooks/use-cart-context';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ShoppingCart,
  Plus,
  Minus,
  CreditCard,
  Package,
  Truck,
  Shield,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(
    new Set()
  );
  const {
    items,
    updateQuantity,
    removeFromCart,
    getItemCount,
    getSubtotal,
    refreshCart,
  } = useCartContext();

  // Handle quantity update
  const handleQuantityUpdate = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      await updateQuantity(productId, newQuantity);
      // Force refresh after update
      setTimeout(() => {
        refreshCart();
      }, 100);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
    // Force refresh after removal
    setTimeout(() => {
      refreshCart();
    }, 100);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  // Calculate totals
  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₵500
  const total = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <p className="text-sm text-gray-600">
            {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in
            your cart
          </p>
        </SheetHeader>

        {/* Guest user notice */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                You&apos;re shopping as a guest.
                <Link href="/login" className="underline ml-1">
                  Sign in
                </Link>{' '}
                to save your cart.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Add some items to get started
                </p>
                <Button asChild>
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const product = item.product;

                  if (!product) {
                    console.warn('Product not found for item:', item);
                    return null;
                  }

                  return (
                    <Card
                      key={item.productId}
                      className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          {/* Product Image */}
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={
                                product.imageUrl ||
                                '/placeholder-product.jpg'
                              }
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </h4>
                                {product.vendorName && (
                                  <p className="text-xs text-gray-600 mb-1">
                                    by {product.vendorName}
                                  </p>
                                )}
                                <p className="text-sm font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveItem(item.productId)
                                }
                                className="h-6 w-6 p-0">
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1 ||
                                    updatingItems.has(item.productId)
                                  }
                                  className="h-6 w-6 p-0">
                                  <Minus className="h-3 w-3" />
                                </Button>

                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(
                                      e.target.value
                                    );
                                    if (!isNaN(value) && value > 0) {
                                      handleQuantityUpdate(
                                        item.productId,
                                        value
                                      );
                                    }
                                  }}
                                  className="w-12 h-6 text-center text-xs"
                                  disabled={updatingItems.has(
                                    item.productId
                                  )}
                                />

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={updatingItems.has(
                                    item.productId
                                  )}
                                  className="h-6 w-6 p-0">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <span className="text-sm font-medium text-gray-900">
                                {formatPrice(
                                  product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-3">
                {/* Summary Items */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0
                        ? 'Free'
                        : formatPrice(shipping)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck className="h-3 w-3" />
                    <span>Free shipping on orders over ₵500</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="h-3 w-3" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Package className="h-3 w-3" />
                    <span>Easy returns</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="sm" asChild>
                    <Link href="/checkout">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
