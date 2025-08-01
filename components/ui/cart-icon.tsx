'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/hooks/use-cart-context';
import { Badge } from './badge';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
  const { getTotalItems } = useCartContext();

  const itemCount = getTotalItems();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 transition-colors ${className}`}>
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Link>
  );
}
