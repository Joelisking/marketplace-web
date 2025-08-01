import React from 'react';
import { ProductEditForm } from '@/components/vendor/ProductEditForm';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  return <ProductEditForm productId={id} />;
}
