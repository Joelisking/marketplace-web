import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingCart,
  Store,
  Package,
  Truck,
  Shield,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-blue-600">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products from trusted vendors. Shop with
            confidence and enjoy seamless shopping experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                <Package className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/stores">
                <Store className="h-5 w-5 mr-2" />
                Explore Stores
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <CardTitle>Easy Shopping</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add items to your cart, manage quantities, and
                checkout seamlessly with our intuitive shopping
                experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle>Secure Payments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your transactions are protected with industry-standard
                security measures and secure payment processing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-orange-600" />
                <CardTitle>Fast Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Enjoy quick and reliable delivery with real-time
                tracking and multiple shipping options.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who trust our
            marketplace for their shopping needs.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Start Shopping Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
