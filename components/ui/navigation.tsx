'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './button';
import { CartDrawer } from './cart-drawer';
import { CartPopover } from './cart-popover';
import { useCartContext } from '@/hooks/use-cart-context';
import { Search, User, Menu, ShoppingCart } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = '' }: NavigationProps) {
  const { isAuthenticated, user } = useAuth();
  const { getTotalItems, showPopover, onPopoverClose } =
    useCartContext();

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link
              href="/stores"
              className="text-gray-700 hover:text-gray-900 transition-colors">
              Stores
            </Link>
          </div>

          {/* Right side - Search, Cart, Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Cart Icon */}
            <CartPopover
              showPopover={showPopover}
              onPopoverClose={onPopoverClose}>
              <CartDrawer>
                <div className="relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-medium text-white">
                      {getTotalItems() > 99 ? '99+' : getTotalItems()}
                    </div>
                  )}
                </div>
              </CartDrawer>
            </CartPopover>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    {user?.role === 'customer'
                      ? 'Dashboard'
                      : 'Account'}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
