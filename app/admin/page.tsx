'use client';
import React from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetVendorOnboardingAdminDashboard } from '@/lib/api/admin/admin';
export default function AdminDashboard() {
  const {
    data: dashboardData,
    isLoading: loading,
    refetch: fetchDashboardStats,
  } = useGetVendorOnboardingAdminDashboard();

  const stats = dashboardData?.data?.dashboard;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-muted-foreground mb-4">
            Unable to fetch dashboard statistics.
          </p>
          <Button onClick={() => fetchDashboardStats()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of vendor applications and platform statistics
          </p>
        </div>
        <Button
          onClick={() => {
            fetchDashboardStats();
          }}
          variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              All time vendor applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.approvedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.rejectedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Applications rejected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Total Applications
              </span>
              <span className="text-lg font-bold">
                {stats?.totalApplications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Pending Applications
              </span>
              <span className="text-lg font-bold">
                {stats?.pendingApplications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Avg Processing Time
              </span>
              <span className="text-lg font-bold">
                {stats?.averageProcessingTime || 0} days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Recent Applications
            </CardTitle>
            <CardDescription>
              Latest vendor applications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentApplications?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (application: any, index: number) => (
                  <div
                    key={application?.id || index}
                    className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {application?.businessName ||
                          'Unknown Business'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {application?.user?.email || 'No email'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Applied{' '}
                        {application?.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : 'Unknown date'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getStatusColor(
                          application?.status || 'UNKNOWN'
                        )}>
                        {(application?.status || 'UNKNOWN').replace(
                          /_/g,
                          ' '
                        )}
                      </Badge>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/admin/vendor-applications/${application?.id || ''}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              ) || (
                <div className="text-center text-muted-foreground py-4">
                  No recent applications
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/vendor-applications">
                  View All Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
