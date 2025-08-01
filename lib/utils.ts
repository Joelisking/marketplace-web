import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Option } from './constants';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ErrorDetail {
  code: string;
  description: string;
  type: number;
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  data?: {
    errors: ErrorDetail[];
  };
  errors: ErrorDetail[];
}
export const isErrorResponse = (error: ErrorResponse) => {
  const err = error.errors ?? error?.data?.errors;
  const errorResponse = err[0];
  console.log('Error message', errorResponse.description);
  return errorResponse;
};

export const cleanArrayObject = (fitItems: Option[]) => {
  const cleanedArray = fitItems?.filter(
    (item) =>
      item && // Ensure item is not null or undefined
      Object.keys(item).length > 0 && // Ensure the object is not empty
      item.label?.trim() !== '' && // Check that 'label' is not an empty string
      item.value?.trim() !== '' // Check that 'value' is not an empty string
  );
  return cleanedArray;
};

export const calculateFitAndOverflow = (
  options: Option[],
  maxCharacters: number
): {
  fitItems: Option[];
  overflowItems: Option[];
  overflowCount: number;
  currentTotal: number;
} => {
  // Function to calculate total length (label length + 3)
  const calculateTotalLength = (label: string): number =>
    label.length + 4;
  const maxChars = maxCharacters - 5;

  const fitItems: Option[] = [];
  let currentTotal = 0;

  // Track the items that fit within the maxCharacters
  cleanArrayObject(options)?.forEach((item) => {
    const itemLength = calculateTotalLength(item.label);
    if (currentTotal + itemLength <= maxChars) {
      fitItems.push(item);
      currentTotal += itemLength;
    }
  });

  const fitItemsValues = fitItems?.map((item) => item.value);
  const overflowItems = options.filter(
    (item) => !fitItemsValues?.includes(item.value)
  );

  // Calculate overflow count
  const overflowCount = options.length - fitItems.length;

  const cleanedArray = cleanArrayObject(fitItems);

  // console.log(cleanedArray, "cleanedArray", options, fitItems);

  return {
    currentTotal,
    fitItems: cleanedArray,
    overflowCount,
    overflowItems,
  };
};

export const formatTime = (hours: number, minutes: number) => {
  let result = '';

  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    // Add a space if hours is included
    if (hours > 0) result += ' ';
    result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return result.trim(); // Ensure there are no extra spaces
};

export function generateDriverId(
  firstName: string,
  lastName: string,
  dob: string
): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const birthYear = new Date(dob).getFullYear();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${firstInitial}${lastInitial}${birthYear}${randomNum}`;
}

export const IdSchema = (msg: string) =>
  z.object(
    {
      value: z.string({
        message: `${msg} is required`,
      }),
      label: z.string(),
    },
    {
      message: `${msg} is required`,
    }
  );

/**
 * Validates a file for upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'],
  } = options;

  const errors: string[] = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(
      `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    );
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type must be one of: ${allowedTypes.join(', ')}`
    );
  }

  // Check file extension
  const fileExtension =
    '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(
      `File extension must be one of: ${allowedExtensions.join(', ')}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

/**
 * Generates a unique filename
 */
export const generateUniqueFilename = (
  originalName: string
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
};
