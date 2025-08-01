'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProducts } from '@/lib/api/catalogue/catalogue';
import { useCartContext } from '@/hooks/use-cart-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid, List } from 'lucide-react';

import { ProductCard } from '@/components/ui/product-card';
import { ProductFilters } from '@/components/ui/product-filters';

interface ProductsPageClientProps {
  searchParams?: {
    q?: string;
    page?: string;
    store?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}

export default function ProductsPageClient({
  searchParams,
}: ProductsPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.q || ''
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 10000,
  ]);

  // Parse search parameters
  const currentPage = parseInt(searchParams?.page || '1');
  const currentSearch = searchParams?.q || '';
  const currentStore = searchParams?.store || '';
  const currentCategory = searchParams?.category || '';
  const currentSort = searchParams?.sort || '';

  // Mock data for filters (in a real app, this would come from API)
  const categories = [
    { id: '1', name: 'Electronics', count: 45 },
    { id: '2', name: 'Clothing', count: 32 },
    { id: '3', name: 'Home & Garden', count: 28 },
    { id: '4', name: 'Books', count: 15 },
  ];

  const stores = [
    { id: '1', name: 'TechStore', count: 25 },
    { id: '2', name: 'FashionHub', count: 18 },
    { id: '3', name: 'HomeEssentials', count: 12 },
  ];

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProducts({
    q: currentSearch,
    page: currentPage.toString(),
    storeId: currentStore || undefined,
    category: currentCategory || undefined,
  });

  const { addToCart } = useCartContext();

  const products = productsData?.data?.items || [];
  const pagination = productsData?.data?.meta;

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (currentSort) params.set('sort', currentSort);
    params.set('page', '1');

    router.push(`/products?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('q', currentSearch);
    if (currentSort) params.set('sort', currentSort);
    params.set('page', page.toString());

    router.push(`/products?${params.toString()}`);
  };

  // Handle add to cart
  const handleAddToCart = async (
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
    if (product) {
      await addToCart(productId, quantity, product);
    } else {
      // Find the product to get its details
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        await addToCart(productId, quantity, {
          id: foundProduct.id,
          name: foundProduct.name,
          price: foundProduct.price,
          imageUrl:
            foundProduct.imageUrl || '/placeholder-product.jpg',
          vendorName: foundProduct.store?.name,
        });
      } else {
        await addToCart(productId, quantity);
      }
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedStores([]);
    setPriceRange([0, 10000]);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-md mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load products. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentSearch
            ? `Search results for "${currentSearch}"`
            : 'All Products'}
        </h1>
        {pagination && (
          <p className="text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}{' '}
            to{' '}
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.total
            )}{' '}
            of {pagination.total} products
          </p>
        )}
      </div>

      {/* Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        categories={categories}
        stores={stores}
        selectedCategories={selectedCategories}
        selectedStores={selectedStores}
        priceRange={priceRange}
        onCategoryChange={handleCategoryChange}
        onStoreChange={handleStoreChange}
        onPriceRangeChange={setPriceRange}
        onClearFilters={handleClearFilters}
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />

      {/* View Mode Toggle and Sort */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Sort Options */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={currentSort}
          onChange={(e) => {
            const params = new URLSearchParams();
            if (currentSearch) params.set('q', currentSearch);
            if (e.target.value) params.set('sort', e.target.value);
            params.set('page', '1');

            router.push(`/products?${params.toString()}`);
          }}>
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
          <option value="created_desc">Newest First</option>
          <option value="created_asc">Oldest First</option>
        </select>
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            {currentSearch
              ? `No products match your search for "${currentSearch}"`
              : 'No products available at the moment.'}
          </p>
          {currentSearch && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                router.push('/products');
              }}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination &&
        (() => {
          const totalPages = Math.ceil(
            pagination.total / pagination.pageSize
          );
          return (
            totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                      handlePageChange(pagination.page - 1)
                    }>
                    Previous
                  </Button>

                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            page === pagination.page
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => handlePageChange(page)}>
                          {page}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    disabled={pagination.page >= totalPages}
                    onClick={() =>
                      handlePageChange(pagination.page + 1)
                    }>
                    Next
                  </Button>
                </div>
              </div>
            )
          );
        })()}
    </div>
  );
}
