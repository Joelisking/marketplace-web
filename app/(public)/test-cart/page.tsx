'use client';

import React, { useState } from 'react';
import { useCartContext } from '@/hooks/use-cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TestCartPage() {
  const {
    items,
    addToCart,
    getItemCount,
    getSubtotal,
    refreshCart,
    isAuthenticated,
    removeFromCart,
  } = useCartContext();
  const [testProduct] = useState({
    id: 'test-product-1',
    name: 'Test Product',
    price: 100,
    imageUrl: '/placeholder-product.jpg',
    vendorName: 'Test Store',
  });

  const handleAddTestProduct = async () => {
    console.log('Adding test product to cart...');
    await addToCart(testProduct.id, 1, testProduct);
    console.log('Test product added to cart');
  };

  const handleRefreshCart = () => {
    console.log('Refreshing cart...');
    refreshCart();
    console.log('Cart refreshed');
  };

  const handleClearCart = async () => {
    console.log('Clearing cart...');
    for (const item of items) {
      await removeFromCart(item.productId);
    }
    console.log('Cart cleared');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cart Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Test Controls
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Authentication Status:
                </p>
                <p className="font-medium">
                  {isAuthenticated ? 'Authenticated' : 'Guest'}
                </p>
              </div>

              <Button
                onClick={handleAddTestProduct}
                className="w-full">
                Add Test Product to Cart
              </Button>

              <Button
                onClick={handleRefreshCart}
                variant="outline"
                className="w-full">
                Refresh Cart
              </Button>

              <Button
                onClick={handleClearCart}
                variant="destructive"
                className="w-full">
                Clear Cart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cart Status */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Cart Status
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Item Count:</p>
                <p className="font-medium">{getItemCount()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Subtotal:</p>
                <p className="font-medium">₵{getSubtotal()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Items in Cart:
                </p>
                <div className="mt-2 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">
                        {item.product?.name || 'Unknown Product'}
                      </p>
                      {item.product?.vendorName && (
                        <p className="text-xs text-gray-500">
                          by {item.product.vendorName}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} | Price: ₵
                        {item.product?.price || 0}
                      </p>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-gray-500 italic">
                      No items in cart
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Debug Information
          </h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                items,
                itemCount: getItemCount(),
                subtotal: getSubtotal(),
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
