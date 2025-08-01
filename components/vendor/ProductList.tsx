'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetVendorProducts } from '@/lib/api/vendor/vendor';
import { useDeleteProductsId } from '@/lib/api/catalogue/catalogue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function ProductList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState<
    'all' | 'visible' | 'hidden'
  >('all');

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetVendorProducts();
  const deleteProductMutation = useDeleteProductsId();

  const products = productsData?.data?.items || [];

  // Filter products based on search term and visibility
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ?? false;
    const matchesVisibility =
      filterVisible === 'all' ||
      (filterVisible === 'visible' && product.visibleMarket) ||
      (filterVisible === 'hidden' && !product.visibleMarket);

    return matchesSearch && matchesVisibility;
  });

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    try {
      await deleteProductMutation.mutateAsync({ id: productId });
      toast.success(`Product "${productName}" deleted successfully`);
      refetch();
    } catch (error: unknown) {
      console.error('Delete product failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/vendor/products/${productId}/edit`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const getStockStatus = (stock: number | undefined) => {
    const stockValue = stock ?? 0;
    if (stockValue === 0)
      return {
        status: 'out-of-stock',
        color: 'destructive' as const,
        text: 'Out of Stock',
      };
    if (stockValue <= 5)
      return {
        status: 'low-stock',
        color: 'secondary' as const,
        text: 'Low Stock',
      };
    return {
      status: 'in-stock',
      color: 'default' as const,
      text: 'In Stock',
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>Failed to load products. Please try again.</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-gray-600">
            Manage your product catalog ({filteredProducts.length} of{' '}
            {products.length} products)
          </p>
        </div>
        <Button
          onClick={() => router.push('/vendor/products/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={
                  filterVisible === 'all' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setFilterVisible('all')}>
                All
              </Button>
              <Button
                variant={
                  filterVisible === 'visible' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setFilterVisible('visible')}>
                <Eye className="w-4 h-4 mr-1" />
                Visible
              </Button>
              <Button
                variant={
                  filterVisible === 'hidden' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setFilterVisible('hidden')}>
                <EyeOff className="w-4 h-4 mr-1" />
                Hidden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            View and manage all your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterVisible !== 'all'
                  ? 'No products found'
                  : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterVisible !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'}
              </p>
              {!searchTerm && filterVisible === 'all' && (
                <Button
                  onClick={() =>
                    router.push('/vendor/products/create')
                  }>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(product.price ?? 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {product.stock}
                            </span>
                            <Badge variant={stockStatus.color}>
                              {stockStatus.text}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.visibleMarket
                                ? 'default'
                                : 'secondary'
                            }>
                            {product.visibleMarket
                              ? 'Active'
                              : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {product.visibleMarket ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">
                              {product.visibleMarket
                                ? 'Visible'
                                : 'Hidden'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                product.id &&
                                handleViewProduct(product.id)
                              }
                              disabled={!product.id}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                product.id &&
                                handleEditProduct(product.id)
                              }
                              disabled={!product.id}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Product
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete
                                    &quot;
                                    {product.name}&quot;? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      product.id &&
                                      product.name &&
                                      handleDeleteProduct(
                                        product.id,
                                        product.name
                                      )
                                    }
                                    disabled={
                                      !product.id || !product.name
                                    }
                                    className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
