import { useGetEnhancedCart } from '@/lib/api/enhanced-cart/enhanced-cart';
import { usePostEnhancedCartItems } from '@/lib/api/enhanced-cart/enhanced-cart';
import { usePutEnhancedCartItemsProductId } from '@/lib/api/enhanced-cart/enhanced-cart';
import { useDeleteEnhancedCartItemsProductId } from '@/lib/api/enhanced-cart/enhanced-cart';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export const useCart = () => {
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const {
    data: cartData,
    isLoading,
    error,
    refetch,
  } = useGetEnhancedCart(undefined, {
    query: {
      enabled: isAuthenticated,
    },
  });

  // Add to cart mutation
  const addToCartMutation = usePostEnhancedCartItems({
    mutation: {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        toast.error('Failed to add product to cart');
        console.error('Add to cart error:', error);
      },
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = usePutEnhancedCartItemsProductId({
    mutation: {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        toast.error('Failed to update cart item');
        console.error('Update cart error:', error);
      },
    },
  });

  // Remove cart item mutation
  const removeCartItemMutation = useDeleteEnhancedCartItemsProductId({
    mutation: {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        toast.error('Failed to remove item from cart');
        console.error('Remove cart item error:', error);
      },
    },
  });

  const cart = cartData?.data?.cart;
  const items = cart?.items || [];

  // Helper functions
  const addToCart = async (
    productId: string,
    quantity: number = 1
  ) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    await addToCartMutation.mutateAsync({
      data: { productId, quantity },
    });
  };

  const updateQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    await updateCartItemMutation.mutateAsync({
      productId,
      data: { quantity },
    });
  };

  const removeFromCart = async (productId: string) => {
    await removeCartItemMutation.mutateAsync({ productId });
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };

  const getItemCount = () => {
    return items.length;
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  return {
    // Data
    cart,
    items,
    isLoading,
    error,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    refetch,

    // Helpers
    getItemQuantity,
    getItemCount,
    getTotalItems,
    getSubtotal,
    isInCart,

    // Mutations
    addToCartMutation,
    updateCartItemMutation,
    removeCartItemMutation,
  };
};
