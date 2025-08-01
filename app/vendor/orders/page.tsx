'use client';

import React from 'react';
import { useGetVendorOrders } from '@/lib/api/vendor-orders/vendor-orders';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getZoneById } from '@/lib/constants';

function VendorOrders() {
  const { data: ordersData, isLoading, error } = useGetVendorOrders();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">
              Error loading orders: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = ordersData?.data?.orders || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const deliveryZone = getZoneById(
              order.deliveryZone || ''
            );

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id?.slice(-8) || 'N/A'}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₵
                        {order.total
                          ? (order.total / 100).toFixed(2)
                          : '0.00'}
                      </p>
                      <Badge
                        variant={
                          order.status === 'DELIVERED'
                            ? 'default'
                            : 'secondary'
                        }
                        className="mt-1">
                        {order.status || 'UNKNOWN'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Customer</h4>
                      <p className="text-sm">
                        {order.customer?.firstName || 'N/A'}{' '}
                        {order.customer?.lastName || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        Delivery Zone
                      </h4>
                      {deliveryZone ? (
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {deliveryZone.name}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {deliveryZone.locations
                              .slice(0, 3)
                              .join(', ')}
                            {deliveryZone.locations.length > 3 &&
                              '...'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No zone selected
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VendorOrders;
