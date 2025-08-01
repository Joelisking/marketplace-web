import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

import { toast } from 'sonner';
import { cartStorage } from '@/lib/cart-storage';

export interface GuestCartItem {
  productId: string;
  quantity: number;
  addedAt: number;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    vendorName?: string;
  };
}

export interface GuestCart {
  items: GuestCartItem[];
  lastSync: number;
}

export const useGuestCart = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<GuestCart>({
    items: [],
    lastSync: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const localCart = cartStorage.getCart();
      if (localCart) {
        setCart({
          items: localCart.items,
          lastSync: localCart.lastSync,
        });
      }
    }
  }, [isAuthenticated]);

  // Force refresh cart from localStorage
  const refreshCart = useCallback(() => {
    if (!isAuthenticated) {
      const localCart = cartStorage.getCart();
      if (localCart) {
        setCart({
          items: localCart.items,
          lastSync: localCart.lastSync,
        });
      }
    }
  }, [isAuthenticated]);

  // Add item to guest cart
  const addToCart = async (
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
      toast.error('Please use the authenticated cart system');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = cartStorage.addItem(
        productId,
        quantity,
        product
      );
      setCart({
        items: updatedCart.items,
        lastSync: updatedCart.lastSync,
      });

      // Force a re-render by updating the state again
      setTimeout(() => {
        refreshCart();
      }, 100);
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity in guest cart
  const updateQuantity = async (
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
      toast.error('Please use the authenticated cart system');
      return;
    }

    if (quantity < 1) return;

    setIsLoading(true);
    try {
      const updatedCart = cartStorage.updateItem(
        productId,
        quantity,
        product
      );
      setCart({
        items: updatedCart.items,
        lastSync: updatedCart.lastSync,
      });

      // Force a re-render by updating the state again
      setTimeout(() => {
        refreshCart();
      }, 100);
    } catch (error) {
      toast.error('Failed to update cart item');
      console.error('Update cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from guest cart
  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      toast.error('Please use the authenticated cart system');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = cartStorage.removeItem(productId);
      setCart({
        items: updatedCart.items,
        lastSync: updatedCart.lastSync,
      });

      // Force a re-render by updating the state again
      setTimeout(() => {
        refreshCart();
      }, 100);
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error('Remove cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear guest cart
  const clearCart = () => {
    if (isAuthenticated) {
      toast.error('Please use the authenticated cart system');
      return;
    }

    cartStorage.clearCart();
    setCart({ items: [], lastSync: 0 });
  };

  // Get item quantity
  const getItemQuantity = (productId: string) => {
    const item = cart.items.find(
      (item) => item.productId === productId
    );
    return item?.quantity || 0;
  };

  // Get item count (unique products)
  const getItemCount = () => {
    return cart.items.length;
  };

  // Get total items (sum of quantities)
  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get subtotal
  const getSubtotal = () => {
    return cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  // Check if item is in cart
  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.productId === productId);
  };

  // Get cart for sync (when user authenticates)
  const getCartForSync = () => {
    return cartStorage.getCartForSync();
  };

  // Mark cart as synced (after successful sync with server)
  const markSynced = (userId?: string) => {
    cartStorage.markSynced(userId);
    setCart((prev) => ({ ...prev, lastSync: Date.now() }));
  };

  return {
    // Data
    cart,
    items: cart.items,
    isLoading,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,

    // Helpers
    getItemQuantity,
    getItemCount,
    getTotalItems,
    getSubtotal,
    isInCart,
    getCartForSync,
    markSynced,
  };
};
