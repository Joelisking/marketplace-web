'use client';

import React from 'react';
import Image from 'next/image';
import { Check, ShoppingCart } from 'lucide-react';

interface CartToastProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  vendorName?: string;
  quantity: number;
}

export function CartToast({
  product,
  vendorName,
  quantity,
}: CartToastProps) {
  return (
    <div className="flex items-center gap-3 p-2">
      {/* Product Image */}
      <div className="relative h-12 w-12 flex-shrink-0">
        <Image
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </p>
        </div>

        {vendorName && (
          <p className="text-xs text-gray-600">by {vendorName}</p>
        )}

        <p className="text-xs text-gray-500">
          {quantity} {quantity === 1 ? 'item' : 'items'} added to cart
        </p>
      </div>

      {/* Cart Icon */}
      <div className="flex-shrink-0">
        <ShoppingCart className="h-5 w-5 text-blue-600" />
      </div>
    </div>
  );
}
