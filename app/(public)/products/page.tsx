import { Suspense } from 'react';
import ProductsPageClient from './ProductsPageClient';

interface ProductsPageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    store?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageClient searchParams={params} />
    </Suspense>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
