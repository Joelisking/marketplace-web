'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    store?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  viewMode: 'grid' | 'list';
  onAddToCart: (
    productId: string,
    quantity: number,
    product?: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      vendorName?: string;
    }
  ) => void;
  formatPrice: (price: number) => string;
  showActions?: boolean;
}

export function ProductCard({
  product,
  viewMode,
  onAddToCart,
  formatPrice,
  showActions = true,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  if (viewMode === 'list') {
    return (
      <Card className="flex overflow-hidden hover:shadow-lg transition-shadow">
        <div className="w-48 h-48 flex-shrink-0">
          <Link href={`/products/${product.id}`}>
            <img
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-xl mb-2">
                <Link
                  href={`/products/${product.id}`}
                  className="hover:text-primary transition-colors">
                  {product.name}
                </Link>
              </CardTitle>

              {product.store && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Store className="h-4 w-4" />
                  <Link
                    href={`/stores/${product.store.slug}`}
                    className="hover:text-primary transition-colors">
                    {product.store.name}
                  </Link>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              {product.stock > 0 ? (
                <Badge variant="secondary" className="mt-1">
                  In Stock ({product.stock})
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-1">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-20"
                />
                <Button
                  onClick={() =>
                    onAddToCart(product.id, quantity, {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl:
                        product.imageUrl ||
                        '/placeholder-product.jpg',
                      vendorName: product.store?.name,
                    })
                  }
                  disabled={product.stock === 0}
                  className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}

        {showActions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">
          <Link
            href={`/products/${product.id}`}
            className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>

        {product.store && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Store className="h-4 w-4" />
            <Link
              href={`/stores/${product.store.slug}`}
              className="hover:text-primary transition-colors">
              {product.store.name}
            </Link>
          </div>
        )}

        <div className="text-xl font-bold text-primary mb-3">
          {formatPrice(product.price)}
        </div>

        {product.stock > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            {product.stock} in stock
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-2 w-full">
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(parseInt(e.target.value) || 1)
              }
              className="w-20"
            />
            <Button
              onClick={() =>
                onAddToCart(product.id, quantity, {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl:
                    product.imageUrl || '/placeholder-product.jpg',
                  vendorName: product.store?.name,
                })
              }
              disabled={product.stock === 0}
              className="flex-1 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
