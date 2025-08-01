'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Download,
  FileText,
  User,
  Building,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationReviewDialog } from '@/components/admin';
import { useGetVendorOnboardingAdminApplicationsApplicationId } from '@/lib/api/admin/admin';
import { VendorApplication } from '@/lib/api/admin/vendor-applications';

export default function VendorApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const { data: applicationData, isLoading: loading } =
    useGetVendorOnboardingAdminApplicationsApplicationId(
      id as string,
      {
        query: {
          enabled: !!id,
        },
      }
    );

  const application = applicationData?.data?.application as
    | VendorApplication
    | undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'DOCUMENTS_REQUESTED':
        return 'bg-orange-100 text-orange-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Application not found
          </h3>
          <p className="text-muted-foreground mb-4">
            The requested application could not be found.
          </p>
          <Button
            onClick={() => router.push('/admin/vendor-applications')}>
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/vendor-applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {application.businessName}
            </h1>
            <p className="text-muted-foreground">
              Application ID: {application.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(application.status)}>
            {application.status.replace(/_/g, ' ')}
          </Badge>
          <Button onClick={() => setShowReviewDialog(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Review Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business Name
                </label>
                <p className="font-medium">
                  {application.businessName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business Type
                </label>
                <p className="font-medium">
                  {application.businessType.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">
                {application.businessDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.businessAddress}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-sm flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {application.businessPhone}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tax ID
                </label>
                <p className="text-sm">
                  {application.taxIdentification || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Expected Sales
                </label>
                <p className="text-sm">
                  {application.expectedMonthlySales.replace(
                    /_/g,
                    ' '
                  )}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Product Categories
              </label>
              <div className="flex flex-wrap gap-1 mt-1">
                {application.productCategories.map(
                  (category, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs">
                      {category}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="font-medium">
                  {application.user.firstName}{' '}
                  {application.user.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Ghana Card
                </label>
                <p className="text-sm">
                  {application.ghanaCardNumber}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {application.user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-sm flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {application.user.phone}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Application Date
              </label>
              <p className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(application.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bank Name
                </label>
                <p className="font-medium">{application.bankName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bank Code
                </label>
                <p className="text-sm">{application.bankCode}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Number
                </label>
                <p className="text-sm">
                  {application.bankAccountNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Name
                </label>
                <p className="text-sm">
                  {application.bankAccountName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Business Documents
            </CardTitle>
            <CardDescription>
              Uploaded documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.businessDocuments.map((document) => (
                <div
                  key={document.id}
                  className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">
                        {document.documentType.replace(/_/g, ' ')}
                        {document.side && ` (${document.side})`}
                      </span>
                    </div>
                    <Badge
                      variant={
                        document.isVerified ? 'default' : 'secondary'
                      }>
                      {document.isVerified
                        ? 'Verified'
                        : 'Unverified'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span>File: {document.fileName}</span>
                    </div>
                    <div>
                      <span>
                        Size: {formatFileSize(document.fileSize)}
                      </span>
                    </div>
                    <div>
                      <span>
                        Uploaded: {formatDate(document.uploadedAt)}
                      </span>
                    </div>
                    {document.isVerified && document.verifiedAt && (
                      <div>
                        <span>
                          Verified: {formatDate(document.verifiedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review History */}
      {application.reviewedAt && (
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reviewed At
                  </label>
                  <p className="text-sm">
                    {formatDate(application.reviewedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reviewed By
                  </label>
                  <p className="text-sm">{application.reviewedBy}</p>
                </div>
              </div>
              {application.reviewNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Review Notes
                  </label>
                  <p className="text-sm mt-1">
                    {application.reviewNotes}
                  </p>
                </div>
              )}
              {application.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Rejection Reason
                  </label>
                  <p className="text-sm mt-1 text-red-600">
                    {application.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      {showReviewDialog && (
        <ApplicationReviewDialog
          application={application}
          onClose={() => setShowReviewDialog(false)}
          onReview={() => window.location.reload()}
        />
      )}
    </div>
  );
}
