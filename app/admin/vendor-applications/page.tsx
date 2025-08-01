/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetVendorOnboardingAdminApplications,
  usePostVendorOnboardingAdminApplicationsApplicationIdReview,
} from '@/lib/api/admin/admin';
import {
  VENDOR_APPLICATION_STATUS,
  VENDOR_BUSINESS_TYPES,
  type VendorApplicationStatus,
  type VendorBusinessType,
} from '@/lib/types/vendor-applications';

export default function VendorApplicationsPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    businessType: 'all',
    search: '',
    page: 1,
    limit: 20,
  });

  const [quickApproveLoading, setQuickApproveLoading] = useState<
    string | null
  >(null);

  const {
    data: applicationsData,
    isLoading: loading,
    refetch: fetchApplications,
  } = useGetVendorOnboardingAdminApplications({
    page: filters.page,
    limit: filters.limit,
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== 'all' && {
      status: filters.status as VendorApplicationStatus,
    }),
    ...(filters.businessType !== 'all' && {
      businessType: filters.businessType as VendorBusinessType,
    }),
  });

  const applications = applicationsData?.data?.applications || [];
  const pagination = applicationsData?.data?.meta || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  // Ensure pagination properties are always defined
  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 0;

  // If meta.total is 0 but we have applications, use the applications length as total
  const total =
    pagination.total ||
    (applications.length > 0 ? applications.length : 0);

  const handleFilterChange = (
    newFilters: Partial<typeof filters>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const reviewMutation =
    usePostVendorOnboardingAdminApplicationsApplicationIdReview({
      mutation: {
        onSuccess: () => {
          // Refetch the applications list to update the UI
          fetchApplications();
          setQuickApproveLoading(null);
        },
        onError: (error) => {
          console.error('Quick approve failed:', error);
          setQuickApproveLoading(null);
        },
      },
    });

  const handleQuickApprove = async (applicationId: string) => {
    setQuickApproveLoading(applicationId);

    // Use the generated mutation with the request body as data property
    reviewMutation.mutate({
      applicationId,
      data: {
        status: VENDOR_APPLICATION_STATUS.APPROVED,
        reviewNotes: 'Quick approved by admin',
      },
    });
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'UNDER_REVIEW':
        return <FileText className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vendor Applications
          </h1>
          <p className="text-muted-foreground">
            Review and manage vendor applications
          </p>
        </div>
        <Button onClick={() => fetchApplications()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  handleFilterChange({ status: value })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.UNDER_REVIEW}>
                    Under Review
                  </SelectItem>
                  <SelectItem
                    value={
                      VENDOR_APPLICATION_STATUS.DOCUMENTS_REQUESTED
                    }>
                    Documents Requested
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.APPROVED}>
                    Approved
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.REJECTED}>
                    Rejected
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_APPLICATION_STATUS.SUSPENDED}>
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Business Type
              </label>
              <Select
                value={filters.businessType}
                onValueChange={(value) =>
                  handleFilterChange({ businessType: value })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem
                    value={VENDOR_BUSINESS_TYPES.INDIVIDUAL}>
                    Individual
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_BUSINESS_TYPES.SOLE_PROPRIETORSHIP}>
                    Sole Proprietorship
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_BUSINESS_TYPES.PARTNERSHIP}>
                    Partnership
                  </SelectItem>
                  <SelectItem
                    value={
                      VENDOR_BUSINESS_TYPES.LIMITED_LIABILITY_COMPANY
                    }>
                    Limited Liability Company
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_BUSINESS_TYPES.CORPORATION}>
                    Corporation
                  </SelectItem>
                  <SelectItem
                    value={VENDOR_BUSINESS_TYPES.COOPERATIVE}>
                    Cooperative
                  </SelectItem>
                  <SelectItem value={VENDOR_BUSINESS_TYPES.OTHER}>
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Items per page
              </label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) =>
                  handleFilterChange({ limit: parseInt(value) })
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application: any) => (
          <Card
            key={application.id}
            className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {application.businessName}
                  </CardTitle>
                  <CardDescription>
                    {application.businessType.replace(/_/g, ' ')}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusIcon(application.status)}
                  <span className="ml-1">
                    {application.status.replace(/_/g, ' ')}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Applicant:
                  </span>
                  <span className="font-medium">
                    {application.user.firstName}{' '}
                    {application.user.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Email:
                  </span>
                  <span className="font-medium">
                    {application.user.email}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Applied:
                  </span>
                  <span className="font-medium">
                    {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Documents:
                  </span>
                  <div className="flex gap-1">
                    {application.businessDocuments.map(
                      (
                        doc: {
                          isVerified: boolean;
                          documentType: string;
                        },
                        index: number
                      ) => (
                        <Badge
                          key={index}
                          variant={
                            doc.isVerified ? 'default' : 'secondary'
                          }
                          className="text-xs">
                          {doc.documentType.replace(/_/g, ' ')}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" className="flex-1">
                  <Link
                    href={`/admin/vendor-applications/${application.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
                {application.status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleQuickApprove(application.id)}
                    disabled={quickApproveLoading === application.id}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {quickApproveLoading === application.id
                      ? 'Approving...'
                      : 'Quick Approve'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No applications found
            </h3>
            <p className="text-muted-foreground mb-4">
              No vendor applications match your current filters.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  status: 'all',
                  businessType: 'all',
                  search: '',
                  page: 1,
                  limit: 20,
                })
              }>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(1, currentPage - 1))
                  }
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, currentPage + 1)
                    )
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {applications.length} of {total} applications
      </div>
    </div>
  );
}
