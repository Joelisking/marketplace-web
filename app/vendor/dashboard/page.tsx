/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  useGetVendorDashboard,
  useGetVendorProductsStats,
  useGetVendorStore,
} from '@/lib/api/vendor/vendor';
import { useGetVendorOrders } from '@/lib/api/vendor-orders/vendor-orders';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import PaystackAccountSetup from '@/components/vendor/PaystackAccountSetup';

function VendorDashboard() {
  const router = useRouter();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetVendorDashboard();
  const { data: productsStats, isLoading: productsLoading } =
    useGetVendorProductsStats();
  const { data: storeData, isLoading: storeLoading } =
    useGetVendorStore();

  const { data: recentOrders, isLoading: recentOrdersLoading } =
    useGetVendorOrders({
      page: '1',
    });

  const isLoading =
    dashboardLoading ||
    productsLoading ||
    storeLoading ||
    recentOrdersLoading;

  const statsCards = [
    {
      title: 'Total Products',
      value:
        dashboardData?.data?.stats?.totalProducts?.toString() || '0',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Visible Products',
      value:
        dashboardData?.data?.stats?.visibleProducts?.toString() ||
        '0',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock Products',
      value:
        dashboardData?.data?.stats?.lowStockProducts?.toString() ||
        '0',
      change: '-1.2%',
      changeType: 'negative' as const,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Value',
      value: formatCurrency(productsStats?.data?.totalValue || 0),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      icon: Plus,
      action: () => router.push('/vendor/products'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'View Orders',
      description: 'Manage your orders',
      icon: ShoppingCart,
      action: () => router.push('/vendor/orders'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: BarChart3,
      action: () => router.push('/vendor/analytics'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Store Settings',
      description: 'Manage store settings',
      icon: Settings,
      action: () => router.push('/vendor/settings'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const getOrderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case 'shipped':
        return (
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800">
            <Package className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case 'delivered':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {storeData?.data?.name || 'Vendor'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <Button
          onClick={() => router.push('/vendor/products')}
          className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp
                      className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}
                    />
                    <span
                      className={`text-sm ml-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="quick-actions">
            Quick Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Store Performance
                </CardTitle>
                <CardDescription>
                  Key metrics for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Products
                  </span>
                  <span className="font-semibold">
                    {dashboardData?.data?.stats?.totalProducts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Visible Products
                  </span>
                  <span className="font-semibold">
                    {dashboardData?.data?.stats?.visibleProducts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Low Stock Products
                  </span>
                  <span className="font-semibold">
                    {dashboardData?.data?.stats?.lowStockProducts ||
                      0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Paystack Account Setup */}
            <PaystackAccountSetup
              hasPaystackAccount={
                !!storeData?.data?.paystackAccountCode
              }
              paystackAccountCode={
                storeData?.data?.paystackAccountCode
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders from your customers
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/vendor/orders')}
                  className="flex items-center gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders?.data?.orders?.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <p className="text-sm text-gray-400">
                    Orders will appear here once customers start
                    shopping
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders?.data?.orders
                    ?.slice(0, 5)
                    .map((order) => (
                      <div
                        key={order.id ?? Math.random()}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">
                              Order #{(order.id ?? '').slice(-8)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(order as any).items?.length ?? 0}{' '}
                              items •{' '}
                              {formatCurrency(order.total || 0)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getOrderStatusBadge(order?.status ?? '')}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (order.id)
                                router.push(
                                  `/vendor/orders/${order.id}`
                                );
                            }}
                            disabled={!order.id}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
                onClick={action.action}>
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon
                      className={`w-6 h-6 ${action.color}`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VendorDashboard;
