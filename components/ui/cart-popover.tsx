'use client';

import React, { useState, useEffect } from 'react';
import { useCartContext } from '@/hooks/use-cart-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Package,
  Truck,
  Shield,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartPopoverProps {
  children: React.ReactNode;
  showPopover: boolean;
  onPopoverClose: () => void;
}

export function CartPopover({
  children,
  showPopover,
  onPopoverClose,
}: CartPopoverProps) {
  const [open, setOpen] = useState(false);
  const { items, getTotalItems, getSubtotal } = useCartContext();

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  // Calculate totals
  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  // Show popover when item is added
  useEffect(() => {
    if (showPopover && items.length > 0) {
      setOpen(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setOpen(false);
        onPopoverClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopover, items.length, onPopoverClose]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Item Added to Cart
              </h4>
              <p className="text-sm text-gray-600">
                {getTotalItems()} item
                {getTotalItems() !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>

          {/* Cart Items Preview */}
          <div className="space-y-2 mb-3">
            {items.slice(0, 3).map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={
                        product.imageUrl || '/placeholder-product.jpg'
                      }
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h5>
                    {product.vendorName && (
                      <p className="text-xs text-gray-500">
                        by {product.vendorName}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} •{' '}
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(product.price * item.quantity)}
                  </span>
                </div>
              );
            })}

            {items.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{items.length - 3} more item
                {items.length - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <Separator className="my-3" />

          {/* Summary */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
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

            <Button
              variant="outline"
              className="w-full"
              size="sm"
              asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
