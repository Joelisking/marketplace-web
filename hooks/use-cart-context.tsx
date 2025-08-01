'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './use-auth';
import { useCart } from './use-cart';
import { useGuestCart } from './use-guest-cart';
import { usePostEnhancedCartSync } from '@/lib/api/enhanced-cart/enhanced-cart';
import { toast } from 'sonner';
import { CartToast } from '@/components/ui/cart-toast';
import { cartStorage } from '@/lib/cart-storage';

interface CartContextType {
  // Data
  items: Array<{
    productId: string;
    quantity: number;
    product?: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      vendorName?: string;
    };
  }>;
  isLoading: boolean;

  // Actions
  addToCart: (
    productId: string,
    quantity?: number,
    product?: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      vendorName?: string;
    }
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    product?: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      vendorName?: string;
    }
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => void;

  // Helpers
  getItemQuantity: (productId: string) => number;
  getItemCount: () => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isInCart: (productId: string) => boolean;

  // Auth status
  isAuthenticated: boolean;

  // Popover functionality
  showPopover: boolean;
  onPopoverClose: () => void;

  // Sync functionality
  syncCartMutation: ReturnType<typeof usePostEnhancedCartSync>;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const authenticatedCart = useCart();
  const guestCart = useGuestCart();
  const [showPopover, setShowPopover] = useState(false);
  // Force update counter to trigger re-renders
  const [, setForceUpdate] = useState(0);

  // Sync mutation for when user authenticates
  const syncCartMutation = usePostEnhancedCartSync({
    mutation: {
      onSuccess: () => {
        if (user?.id && typeof user.id === 'string') {
          guestCart.markSynced(user.id);
        }
        setForceUpdate((prev) => prev + 1);
      },
      onError: (error) => {
        toast.error('Failed to sync cart');
        console.error('Sync cart error:', error);
      },
    },
  });

  // Auto-sync guest cart when user authenticates
  useEffect(() => {
    if (isAuthenticated && user?.id && typeof user.id === 'string') {
      const guestItems = guestCart.getCartForSync();
      // Only sync if there are items and they haven't been synced for this user
      if (
        guestItems.length > 0 &&
        !cartStorage.hasBeenSyncedForUser(user.id)
      ) {
        syncCartMutation.mutate({
          data: {
            localItems: guestItems,
          },
        });
      }
    }
  }, [isAuthenticated, user?.id]);

  // Use authenticated cart if user is logged in, otherwise use guest cart
  const activeCart = isAuthenticated ? authenticatedCart : guestCart;

  // Enhanced addToCart function that shows popover and triggers updates
  const addToCartWithPopover = useCallback(
    async (
      productId: string,
      quantity: number = 1,
      product?: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        vendorName?: string;
      }
    ) => {
      if (isAuthenticated) {
        await authenticatedCart.addToCart(productId, quantity);
      } else {
        await guestCart.addToCart(productId, quantity, product);
      }

      // Show custom toast with product information
      if (product) {
        toast.custom(
          () => (
            <CartToast
              product={product}
              vendorName={product.vendorName}
              quantity={quantity}
            />
          ),
          {
            duration: 3000,
          }
        );
      }

      setShowPopover(true);
      setForceUpdate((prev) => prev + 1);
    },
    [isAuthenticated, authenticatedCart, guestCart]
  );

  const handlePopoverClose = useCallback(() => {
    setShowPopover(false);
  }, []);

  // Refresh cart data
  const refreshCart = useCallback(() => {
    if (isAuthenticated) {
      authenticatedCart.refetch?.();
    } else {
      guestCart.refreshCart?.();
    }
    setForceUpdate((prev) => prev + 1);
  }, [isAuthenticated, authenticatedCart, guestCart]);

  // Enhanced update quantity with force update
  const updateQuantityWithRefresh = useCallback(
    async (
      productId: string,
      quantity: number,
      product?: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        vendorName?: string;
      }
    ) => {
      if (isAuthenticated) {
        await authenticatedCart.updateQuantity(productId, quantity);
      } else {
        await guestCart.updateQuantity(productId, quantity, product);
      }
      setForceUpdate((prev) => prev + 1);
    },
    [isAuthenticated, authenticatedCart, guestCart]
  );

  // Enhanced remove from cart with force update
  const removeFromCartWithRefresh = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        await authenticatedCart.removeFromCart(productId);
      } else {
        await guestCart.removeFromCart(productId);
      }
      setForceUpdate((prev) => prev + 1);
    },
    [isAuthenticated, authenticatedCart, guestCart]
  );

  const contextValue: CartContextType = {
    // Data
    items: activeCart.items,
    isLoading: activeCart.isLoading,

    // Actions
    addToCart: addToCartWithPopover,
    updateQuantity: updateQuantityWithRefresh,
    removeFromCart: removeFromCartWithRefresh,
    refreshCart,

    // Helpers
    getItemQuantity: activeCart.getItemQuantity,
    getItemCount: activeCart.getItemCount,
    getTotalItems: activeCart.getTotalItems,
    getSubtotal: activeCart.getSubtotal,
    isInCart: activeCart.isInCart,

    // Auth status
    isAuthenticated,

    // Popover functionality
    showPopover,
    onPopoverClose: handlePopoverClose,

    // Sync functionality
    syncCartMutation,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      'useCartContext must be used within a CartProvider'
    );
  }
  return context;
}
