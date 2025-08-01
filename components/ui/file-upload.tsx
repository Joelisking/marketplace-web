import React, { useState } from 'react';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File | null) => void;
  preview?: string | null;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelect,
  preview,
  error,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        alert(
          `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File must be an image');
        return;
      }
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <label
        htmlFor={id}
        className={cn(
          'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
          error && 'border-red-500 bg-red-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Icon
            name="Image"
            className={cn(
              'w-8 h-8 mb-4',
              error ? 'text-red-500' : 'text-gray-500'
            )}
          />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or
            drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
        <input
          id={id}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
        />
      </label>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
