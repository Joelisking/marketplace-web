import { useAuth } from './use-auth';
import { useCart } from './use-cart';
import { useGuestCart } from './use-guest-cart';
import { usePostEnhancedCartSync } from '@/lib/api/enhanced-cart/enhanced-cart';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cartStorage } from '@/lib/cart-storage';

export const useUnifiedCart = () => {
  const { isAuthenticated, user } = useAuth();
  const authenticatedCart = useCart();
  const guestCart = useGuestCart();
  const [showPopover, setShowPopover] = useState(false);

  // Sync mutation for when user authenticates
  const syncCartMutation = usePostEnhancedCartSync({
    mutation: {
      onSuccess: () => {
        if (user?.id && typeof user.id === 'string') {
          guestCart.markSynced(user.id);
        }
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

  // Enhanced addToCart function that shows popover
  const addToCartWithPopover = async (
    productId: string,
    quantity: number = 1,
    product?: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
    }
  ) => {
    if (isAuthenticated) {
      await activeCart.addToCart(productId, quantity);
    } else {
      await activeCart.addToCart(productId, quantity, product);
    }
    setShowPopover(true);
  };

  const handlePopoverClose = () => {
    setShowPopover(false);
  };

  // Refresh cart data
  const refreshCart = () => {
    if (isAuthenticated) {
      authenticatedCart.refetch?.();
    } else {
      guestCart.refreshCart?.();
    }
  };

  return {
    // Data
    items: activeCart.items,
    isLoading: activeCart.isLoading,

    // Actions
    addToCart: addToCartWithPopover,
    updateQuantity: activeCart.updateQuantity,
    removeFromCart: activeCart.removeFromCart,
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
};
