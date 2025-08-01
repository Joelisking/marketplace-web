import React from 'react';
import { ProductEditForm } from '@/components/vendor/ProductEditForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({
  params,
}: EditProductPageProps) {
  return <ProductEditForm productId={params.id} />;
}
