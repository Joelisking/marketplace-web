'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProductsId } from '@/lib/api/catalogue/catalogue';
import { usePostCartItems } from '@/lib/api/cart/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  Store,
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductsId(productId);

  // Add to cart mutation
  const addToCartMutation = usePostCartItems({
    mutation: {
      onSuccess: () => {
        toast.success('Product added to cart!');
      },
      onError: (error) => {
        toast.error('Failed to add product to cart');
        console.error('Add to cart error:', error);
      },
    },
  });

  const product = productData?.data;

  // Handle add to cart
  const handleAddToCart = () => {
    addToCartMutation.mutate({
      data: {
        productId,
        quantity,
      },
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div>
            <Skeleton className="h-96 w-full mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-12 w-1/3 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or
            has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage =
    images[selectedImageIndex]?.fileUrl ||
    product.imageUrl ||
    '/placeholder-product.jpg';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <img
                    src={image.fileUrl}
                    alt={
                      image.altText ||
                      `${product.name} - Image ${index + 1}`
                    }
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {product.store && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Store className="h-4 w-4" />
                <Link
                  href={`/stores/${product.store.slug}`}
                  className="hover:text-primary transition-colors">
                  {product.store.name}
                </Link>
              </div>
            )}

            <div className="text-3xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </div>

            <div className="flex items-center gap-4 mb-6">
              {product.stock > 0 ? (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-100">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  4.5 (128 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-24"
                />
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center gap-2"
                  size="lg">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>Quality guarantee</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              This is a high-quality product that offers excellent
              value for money. It features premium materials and
              craftsmanship, ensuring durability and long-lasting
              performance. Perfect for everyday use and designed with
              user comfort in mind.
            </p>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Product Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>SKU:</span>
                <span>{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span>General</span>
              </div>
              <div className="flex justify-between">
                <span>Weight:</span>
                <span>500g</span>
              </div>
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <span>10 x 5 x 2 cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden hover:shadow-lg transition-shadow">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
