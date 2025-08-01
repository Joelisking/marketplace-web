'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Upload, Eye, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui';
import {
  useGetVendorOnboardingDocuments,
  useDeleteVendorOnboardingDocumentsDocumentId,
  usePostVendorOnboardingDocuments,
  usePostVendorOnboardingUploadUrl,
} from '@/lib/api/vendor/vendor';
import { GetVendorOnboardingDocuments200DocumentsItem } from '@/lib/api/marketplaceAPI.schemas';

const DocumentManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<
    string | null
  >(null);

  // Fetch existing documents
  const { data: documentsData, refetch: refetchDocuments } =
    useGetVendorOnboardingDocuments();
  const documents = documentsData?.data?.documents || [];

  // API mutations
  const { mutateAsync: deleteDocument } =
    useDeleteVendorOnboardingDocumentsDocumentId();
  const { mutateAsync: uploadDocument } =
    usePostVendorOnboardingDocuments();
  const { mutateAsync: getPresignedUrl } =
    usePostVendorOnboardingUploadUrl();

  const handleFileUpload = async (
    file: File,
    side: 'FRONT' | 'BACK'
  ) => {
    try {
      setIsUploading(true);
      console.log(
        `Starting upload for Ghana Card ${side.toLowerCase()}:`,
        {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }
      );

      // Step 1: Get presigned URL for upload
      const presignedUrlResponse = await getPresignedUrl({
        data: {
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        },
      });

      const { uploadUrl, fileUrl } = presignedUrlResponse.data;
      console.log(`Presigned URL received for ${side}:`, {
        uploadUrl,
        fileUrl,
      });

      // Step 2: Upload the file to storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`Upload failed for ${side}:`, {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorText,
          uploadUrl,
        });
        throw new Error(
          `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`
        );
      }

      console.log(`Upload successful for ${side}:`, {
        status: uploadResponse.status,
        fileUrl,
      });

      // Step 3: Create the document record
      const documentResponse = await uploadDocument({
        data: {
          documentType: 'GHANA_CARD',
          side: side,
          fileName: file.name,
          fileUrl: fileUrl,
          fileSize: file.size,
          mimeType: file.type,
        },
      });

      console.log(
        `Document record created for ${side}:`,
        documentResponse
      );

      // Refresh documents list
      await refetchDocuments();
      toast.success(`${side} side uploaded successfully`);
    } catch (error) {
      console.error(
        `Failed to upload Ghana Card ${side.toLowerCase()}:`,
        error
      );

      let errorMessage = 'Failed to upload document';
      if (error instanceof Error) {
        if (error.message.includes('has already been uploaded')) {
          errorMessage =
            'This document side has already been uploaded. Please delete the existing document first if you want to replace it.';
        } else if (error.message.includes('Upload failed')) {
          errorMessage =
            'Failed to upload document. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setDeletingDocumentId(documentId);
      await deleteDocument({ documentId });
      await refetchDocuments();
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document. Please try again.');
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const getDocumentBySide = (side: 'FRONT' | 'BACK') => {
    return documents.find((doc) => doc.side === side);
  };

  const frontDocument = getDocumentBySide('FRONT');
  const backDocument = getDocumentBySide('BACK');

  const renderDocumentCard = (
    side: 'FRONT' | 'BACK',
    doc?: GetVendorOnboardingDocuments200DocumentsItem
  ) => {
    const isDeleting = deletingDocumentId === doc?.id;

    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">
            Ghana Card - {side === 'FRONT' ? 'Front' : 'Back'}
          </h4>
          {doc?.isVerified && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </div>
          )}
        </div>

        {doc ? (
          <div className="space-y-3">
            {/* Document Preview */}
            <div className="relative">
              <img
                src={doc.fileUrl}
                alt={`Ghana Card ${side.toLowerCase()}`}
                className="w-full h-32 object-cover rounded border"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 hover:opacity-100 transition-opacity"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(doc.fileUrl, '_blank');
                  }}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>

            {/* Document Info */}
            <div className="text-sm text-gray-600">
              <p>
                <strong>File:</strong> {doc.fileName}
              </p>
              <p>
                <strong>Size:</strong>{' '}
                {doc.fileSize
                  ? (doc.fileSize / 1024 / 1024).toFixed(2)
                  : 'Unknown'}{' '}
                MB
              </p>
              <p>
                <strong>Uploaded:</strong>{' '}
                {new Date(doc.uploadedAt || '').toLocaleDateString()}
              </p>
              {doc.verificationNotes && (
                <p>
                  <strong>Notes:</strong> {doc.verificationNotes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files?.[0]) {
                      handleFileUpload(target.files[0], side);
                    }
                  };
                  input.click();
                }}
                disabled={isUploading || isDeleting}>
                <Upload className="w-4 h-4 mr-1" />
                Replace
              </Button>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteDocument(doc.id!);
                }}
                disabled={isUploading || isDeleting}>
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-3">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
            </div>
            <p className="text-gray-600 mb-3">
              Upload {side.toLowerCase()} side
            </p>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files?.[0]) {
                    handleFileUpload(target.files[0], side);
                  }
                };
                input.click();
              }}
              disabled={isUploading}>
              <Upload className="w-4 h-4 mr-1" />
              Choose File
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Ghana Card Documents
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full mr-2 ${frontDocument ? 'bg-green-500' : 'bg-gray-300'}`}
              />
              <span className="text-sm text-gray-600">
                Front Side
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full mr-2 ${backDocument ? 'bg-green-500' : 'bg-gray-300'}`}
              />
              <span className="text-sm text-gray-600">Back Side</span>
            </div>
          </div>
        </div>

        {frontDocument && backDocument && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Ghana Card upload complete! Your application is ready for
            review.
          </div>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDocumentCard('FRONT', frontDocument)}
        {renderDocumentCard('BACK', backDocument)}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">
              Uploading document...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
