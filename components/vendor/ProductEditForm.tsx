'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetProductsId,
  usePutProductsId,
} from '@/lib/api/catalogue/catalogue';
import { usePostUploadPresignedUrl } from '@/lib/api/upload/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react';
import type { PostProductsBodyImagesItem } from '@/lib/api/marketplaceAPI.schemas';

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  visibleMarket: boolean;
}

interface UploadedImage {
  file: File;
  preview: string;
  uploaded?: PostProductsBodyImagesItem;
  uploading: boolean;
}

interface ProductEditFormProps {
  productId: string;
}

export function ProductEditForm({ productId }: ProductEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    stock: '',
    visibleMarket: true,
  });
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductsId(productId);
  const updateProductMutation = usePutProductsId();
  const uploadUrlMutation = usePostUploadPresignedUrl();

  // Load product data when available
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name || '',
        price: product.price.toString(),
        stock: product.stock?.toString() || '',
        visibleMarket: product.visibleMarket ?? true,
      });
    }
  }, [productData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          `${file.name} is too large. Maximum size is 10MB`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setImages((prev) => [
          ...prev,
          {
            file,
            preview,
            uploading: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (
    image: UploadedImage
  ): Promise<PostProductsBodyImagesItem | null> => {
    try {
      // Get presigned URL
      const presignedResponse = await uploadUrlMutation.mutateAsync({
        data: {
          fileName: image.file.name,
          contentType: image.file.type,
          fileSize: image.file.size,
        },
      });

      const { uploadUrl, fileUrl, fileName } = presignedResponse.data;

      // Upload to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: image.file,
        headers: {
          'Content-Type': image.file.type,
        },
      });

      return {
        fileName,
        fileUrl,
        altText: image.file.name,
        isPrimary: images.indexOf(image) === 0, // First image is primary
        sortOrder: images.indexOf(image),
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error(`Failed to upload ${image.file.name}`);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    try {
      // Upload new images first
      const uploadedImages: PostProductsBodyImagesItem[] = [];

      if (images.length > 0) {
        setProgress(10);
        toast.info('Uploading images...');

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          setProgress(10 + (i / images.length) * 60);

          const uploadedImage = await uploadImage(image);
          if (uploadedImage) {
            uploadedImages.push(uploadedImage);
          }
        }
      }

      setProgress(80);
      toast.info('Updating product...');

      // Update product
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        visibleMarket: formData.visibleMarket,
        images: uploadedImages,
      };

      await updateProductMutation.mutateAsync({
        id: productId,
        data: productData,
      });

      setProgress(100);
      toast.success('Product updated successfully!');

      // Redirect back to products list
      router.push('/vendor/products');
    } catch (error: unknown) {
      console.error('Product update failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update product';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
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
            <p>Failed to load product. Please try again.</p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mt-2">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-0 h-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Product
              </CardTitle>
              <CardDescription>
                Update your product information and images.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange('name', e.target.value)
                  }
                  placeholder="Enter product name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (GHS) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange('price', e.target.value)
                  }
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    handleInputChange('stock', e.target.value)
                  }
                  placeholder="0"
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">
                    {errors.stock}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibleMarket">Visibility</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visibleMarket"
                    checked={formData.visibleMarket}
                    onCheckedChange={(checked) =>
                      handleInputChange('visibleMarket', checked)
                    }
                  />
                  <Label htmlFor="visibleMarket" className="text-sm">
                    Visible in marketplace
                  </Label>
                </div>
              </div>
            </div>

            {/* Current Images */}
            {productData?.data?.images &&
              productData.data.images.length > 0 && (
                <div className="space-y-4">
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productData.data.images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={image.fileUrl}
                            alt={
                              image.altText ||
                              `Product image ${index + 1}`
                            }
                            className="w-full h-full object-cover"
                          />
                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Add New Images */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Add New Images</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* New Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {image.uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isSubmitting}>
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Updating product...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
